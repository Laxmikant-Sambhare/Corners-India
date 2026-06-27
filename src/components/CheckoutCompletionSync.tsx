import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { verifyCheckoutCompleted } from "../shopify/checkoutCompletion";
import {
  clearCheckoutPending,
  getPendingCheckout,
  likelyReturnedFromShopifyCheckout,
} from "../shopify/checkoutReturn";
import { selectIsLoggedIn, useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

/**
 * Clears the local cart when a NEW Shopify order proves checkout completed —
 * e.g. customer paid but never clicked "Continue shopping".
 * Only runs for signed-in customers (order API proof).
 */
export function CheckoutCompletionSync() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const accessToken = useAuthStore((s) => s.accessToken);
  const loggedIn = useAuthStore(selectIsLoggedIn);
  const clearCart = useCartStore((s) => s.clearCart);
  const checking = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("order") === "success") return;

    const pending = getPendingCheckout();
    if (!pending || !loggedIn || !accessToken) return;

    // Avoid checking while the customer is likely still on Shopify checkout.
    if (Date.now() - pending.startedAt < 30_000) return;

    const returnedFromShopify = likelyReturnedFromShopifyCheckout();
    // Background sync for "closed tab after paying"; skip random page loads.
    if (!returnedFromShopify && pathname === "/checkout") return;
    if (!returnedFromShopify && Date.now() - pending.startedAt < 5 * 60_000) {
      return;
    }

    if (checking.current) return;
    checking.current = true;

    void (async () => {
      try {
        const completed = await verifyCheckoutCompleted(pending, accessToken);
        if (!completed) return;

        clearCheckoutPending();
        clearCart();

        if (pathname !== "/checkout") {
          void navigate({ to: "/checkout", search: { order: "success" } });
        }
      } finally {
        checking.current = false;
      }
    })();
  }, [accessToken, clearCart, loggedIn, navigate, pathname]);

  return null;
}
