import { type RefObject, useEffect, useState } from "react";

const SETTLE_MS = 200;
const SAFETY_TIMEOUT_MS = 15000;

function getPriorityMedia(container: HTMLElement): (HTMLImageElement | HTMLVideoElement)[] {
  const elements: (HTMLImageElement | HTMLVideoElement)[] = [];

  container.querySelectorAll("img, video").forEach((node) => {
    if (node.tagName === "IMG") {
      const img = node as HTMLImageElement;
      if (img.loading === "lazy" || img.dataset.skipAssetLoader === "true") return;
      elements.push(img);
      return;
    }
    elements.push(node as HTMLVideoElement);
  });

  return elements;
}

function isMediaLoaded(el: HTMLImageElement | HTMLVideoElement): boolean {
  if (el.tagName === "IMG") {
    return (el as HTMLImageElement).complete;
  }
  return (el as HTMLVideoElement).readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;
}

/**
 * Returns true once priority images (non-lazy) and videos inside `containerRef`
 * have finished loading. Re-evaluates when the DOM changes so async content
 * (e.g. Shopify product grids) is included before the page is shown.
 */
export function usePageAssetsReady(
  containerRef: RefObject<HTMLElement | null>,
  resetKey: string,
): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);

    const container = containerRef.current;
    if (!container) {
      setReady(true);
      return;
    }

    let cancelled = false;
    let debounceId: ReturnType<typeof setTimeout> | undefined;
    let settleId: ReturnType<typeof setTimeout> | undefined;
    let safetyId: ReturnType<typeof setTimeout> | undefined;
    const listenerCleanups: (() => void)[] = [];

    function clearPendingTimers() {
      if (debounceId !== undefined) clearTimeout(debounceId);
      if (settleId !== undefined) clearTimeout(settleId);
    }

    function clearListeners() {
      listenerCleanups.forEach((cleanup) => cleanup());
      listenerCleanups.length = 0;
    }

    function attachListeners(pending: (HTMLImageElement | HTMLVideoElement)[]) {
      clearListeners();

      pending.forEach((el) => {
        const onDone = () => scheduleEvaluate();

        if (el.tagName === "IMG") {
          el.addEventListener("load", onDone, { once: true });
          el.addEventListener("error", onDone, { once: true });
          listenerCleanups.push(() => {
            el.removeEventListener("load", onDone);
            el.removeEventListener("error", onDone);
          });
          return;
        }

        el.addEventListener("canplaythrough", onDone, { once: true });
        el.addEventListener("loadeddata", onDone, { once: true });
        el.addEventListener("error", onDone, { once: true });
        listenerCleanups.push(() => {
          el.removeEventListener("canplaythrough", onDone);
          el.removeEventListener("loadeddata", onDone);
          el.removeEventListener("error", onDone);
        });
      });
    }

    const root = container;

    function evaluate() {
      if (cancelled) return;

      const pending = getPriorityMedia(root).filter((el) => !isMediaLoaded(el));

      if (pending.length > 0) {
        clearPendingTimers();
        setReady(false);
        attachListeners(pending);
        return;
      }

      clearListeners();
      clearPendingTimers();

      settleId = setTimeout(() => {
        if (cancelled) return;

        const stillPending = getPriorityMedia(root).filter((el) => !isMediaLoaded(el));
        if (stillPending.length === 0) {
          setReady(true);
        } else {
          evaluate();
        }
      }, SETTLE_MS);
    }

    function scheduleEvaluate() {
      clearPendingTimers();
      debounceId = setTimeout(evaluate, 50);
    }

    const observer = new MutationObserver(scheduleEvaluate);
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"],
    });

    scheduleEvaluate();

    safetyId = setTimeout(() => {
      if (!cancelled) setReady(true);
    }, SAFETY_TIMEOUT_MS);

    return () => {
      cancelled = true;
      observer.disconnect();
      clearPendingTimers();
      if (safetyId !== undefined) clearTimeout(safetyId);
      clearListeners();
    };
  }, [containerRef, resetKey]);

  return ready;
}
