const PENDING_CHECKOUT_KEY = "corners_checkout_pending";
const PENDING_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

/** Mark that the customer was sent to Shopify checkout (used on return). */
export function markCheckoutPending(): void {
  sessionStorage.setItem(PENDING_CHECKOUT_KEY, String(Date.now()));
}

export function clearCheckoutPending(): void {
  sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
}

function hasRecentCheckoutPending(): boolean {
  const raw = sessionStorage.getItem(PENDING_CHECKOUT_KEY);
  if (!raw) return false;
  const started = Number(raw);
  if (!Number.isFinite(started)) return false;
  return Date.now() - started < PENDING_TTL_MS;
}

function isShopifyCheckoutReferrer(referrer: string): boolean {
  try {
    const host = new URL(referrer).hostname;
    return (
      host.endsWith(".myshopify.com") ||
      host === "shopify.com" ||
      host.endsWith(".shopify.com")
    );
  } catch {
    return false;
  }
}

/** True when the customer likely completed checkout and returned from Shopify. */
export function shouldShowCheckoutSuccessReturn(): boolean {
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);
  if (params.get("order") === "success") return false;

  const path = window.location.pathname;
  if (path !== "/" && path !== "/checkout") return false;

  const ref = document.referrer;
  if (ref && isShopifyCheckoutReferrer(ref)) return true;

  return hasRecentCheckoutPending();
}
