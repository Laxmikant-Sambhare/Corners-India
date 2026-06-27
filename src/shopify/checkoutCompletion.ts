import {
  fetchCartById,
  isShopifyConfigured,
} from "./client";
import {
  fetchCustomerOrders,
  isCustomerAccountAccessToken,
} from "./customerAccountAuth";
import type { PendingCheckout } from "./checkoutReturn";

/** True when Shopify indicates checkout finished since `pending.startedAt`. */
export async function verifyCheckoutCompleted(
  pending: PendingCheckout,
  accessToken: string | null,
): Promise<boolean> {
  if (pending.cartId && isShopifyConfigured) {
    try {
      const cart = await fetchCartById(pending.cartId);
      if (cart === null) return true;
    } catch {
      // fall through to order check
    }
  }

  if (accessToken && isCustomerAccountAccessToken(accessToken)) {
    try {
      const orders = await fetchCustomerOrders(accessToken, 1);
      const latest = orders[0];
      if (latest) {
        const processedAt = new Date(latest.processedAt).getTime();
        // Allow 1 minute clock skew; order must be from this checkout attempt.
        if (processedAt >= pending.startedAt - 60_000) return true;
      }
    } catch {
      // ignore — cart check is primary
    }
  }

  return false;
}
