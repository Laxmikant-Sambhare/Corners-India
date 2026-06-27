import { useNavigate } from "@tanstack/react-router";
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
 * When a customer returns from Shopify checkout (any page), verify completion
 * and send them to the order confirmation screen.
 */
export function PostCheckoutReturnHandler() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const clearCart = useCartStore((s) => s.clearCart);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("order") === "success") return;

    const pending = getPendingCheckout();
    if (!pending || !likelyReturnedFromShopifyCheckout()) return;

    handled.current = true;

    void (async () => {
      const completed = await verifyCheckoutCompleted(pending, accessToken);
      if (!completed) {
        handled.current = false;
        return;
      }

      clearCheckoutPending();
      clearCart();
      void navigate({ to: "/checkout", search: { order: "success" } });
    })();
  }, [accessToken, clearCart, navigate]);

  return null;
}
