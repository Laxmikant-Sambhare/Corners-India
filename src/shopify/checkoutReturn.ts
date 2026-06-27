const PENDING_CHECKOUT_KEY = "corners_checkout_pending";
/** Keep pending checkout long enough for customers who close the tab after paying. */
const PENDING_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type PendingCheckout = {
  startedAt: number;
  cartId: string | null;
};

function readRawPending(): string | null {
  try {
    return localStorage.getItem(PENDING_CHECKOUT_KEY);
  } catch {
    return null;
  }
}

function writeRawPending(value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(PENDING_CHECKOUT_KEY);
    else localStorage.setItem(PENDING_CHECKOUT_KEY, value);
  } catch {
    // ignore quota / private mode
  }
}

/** Mark that the customer was sent to Shopify checkout. */
export function markCheckoutPending(cartId?: string): void {
  const payload: PendingCheckout = {
    startedAt: Date.now(),
    cartId: cartId ?? null,
  };
  writeRawPending(JSON.stringify(payload));
  // Legacy sessionStorage key (older builds)
  try {
    sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
  } catch {
    // ignore
  }
}

export function clearCheckoutPending(): void {
  writeRawPending(null);
  try {
    sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
  } catch {
    // ignore
  }
}

export function getPendingCheckout(): PendingCheckout | null {
  const raw = readRawPending();
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as PendingCheckout;
      if (
        typeof parsed.startedAt === "number" &&
        Number.isFinite(parsed.startedAt) &&
        Date.now() - parsed.startedAt < PENDING_TTL_MS
      ) {
        return {
          startedAt: parsed.startedAt,
          cartId: parsed.cartId ?? null,
        };
      }
      clearCheckoutPending();
      return null;
    } catch {
      clearCheckoutPending();
      return null;
    }
  }

  // Migrate legacy sessionStorage timestamp-only pending entries.
  try {
    const legacy = sessionStorage.getItem(PENDING_CHECKOUT_KEY);
    if (!legacy) return null;
    const startedAt = Number(legacy);
    if (!Number.isFinite(startedAt) || Date.now() - startedAt >= PENDING_TTL_MS) {
      sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
      return null;
    }
    return { startedAt, cartId: null };
  } catch {
    return null;
  }
}

export function isShopifyCheckoutReferrer(referrer: string): boolean {
  try {
    const host = new URL(referrer).hostname;
    return (
      host.endsWith(".myshopify.com") ||
      host === "shopify.com" ||
      host.endsWith(".shopify.com") ||
      host === "checkout.shopify.com"
    );
  } catch {
    return false;
  }
}

/** True when the customer likely returned from Shopify checkout (referrer hint only). */
export function likelyReturnedFromShopifyCheckout(): boolean {
  if (typeof window === "undefined") return false;
  const ref = document.referrer;
  return Boolean(ref && isShopifyCheckoutReferrer(ref));
}
