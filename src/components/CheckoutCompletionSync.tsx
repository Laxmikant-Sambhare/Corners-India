import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { verifyCheckoutCompleted } from "../shopify/checkoutCompletion";
import {
  clearCheckoutPending,
  getPendingCheckout,
  likelyReturnedFromShopifyCheckout,
} from "../shopify/checkoutReturn";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

/**
 * Clears the local cart when Shopify confirms checkout completed — even if the
 * customer never clicked "Continue shopping" or hit /checkout?order=success.
 */
export function CheckoutCompletionSync() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const accessToken = useAuthStore((s) => s.accessToken);
  const clearCart = useCartStore((s) => s.clearCart);
  const items = useCartStore((s) => s.items);
  const checking = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("order") === "success") return;

    const pending = getPendingCheckout();
    if (!pending) return;

    // Referrer from Shopify is a hint to check immediately; verification still
    // requires cart deletion or a matching new order (avoids false clears on abandon).
    const shouldCheck =
      likelyReturnedFromShopifyCheckout() || items.length > 0 || Boolean(accessToken);
    if (!shouldCheck) return;

    if (checking.current) return;
    checking.current = true;

    void (async () => {
      try {
        const completed = await verifyCheckoutCompleted(pending, accessToken);
        if (!completed) return;

        clearCheckoutPending();
        const hadItems = items.length > 0;
        clearCart();

        if (hadItems && pathname !== "/checkout") {
          void navigate({ to: "/checkout", search: { order: "success" } });
        }
      } finally {
        checking.current = false;
      }
    })();
  }, [accessToken, clearCart, items.length, navigate, pathname]);

  return null;
}
