import {
  fetchCustomerOrders,
  isCustomerAccountAccessToken,
} from "./customerAccountAuth";
import type { PendingCheckout } from "./checkoutReturn";

/** Max time after checkout redirect to match a new order (24h). */
const ORDER_MATCH_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * True only when there is proof checkout finished AFTER we sent the customer to
 * Shopify — a new order created after `pending.startedAt`.
 *
 * We intentionally do NOT treat a missing Shopify cart as completion: carts can
 * be unavailable during an in-progress checkout or from another browser tab.
 */
export async function verifyCheckoutCompleted(
  pending: PendingCheckout,
  accessToken: string | null,
): Promise<boolean> {
  if (!accessToken || !isCustomerAccountAccessToken(accessToken)) {
    return false;
  }

  try {
    const orders = await fetchCustomerOrders(accessToken, 3);
    const checkoutStarted = pending.startedAt;

    for (const order of orders) {
      const processedAt = new Date(order.processedAt).getTime();
      if (processedAt <= checkoutStarted) continue;
      if (processedAt - checkoutStarted > ORDER_MATCH_WINDOW_MS) continue;
      return true;
    }
  } catch {
    return false;
  }

  return false;
}
