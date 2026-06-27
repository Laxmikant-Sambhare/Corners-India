import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import {
  clearCheckoutPending,
  shouldShowCheckoutSuccessReturn,
} from "../shopify/checkoutReturn";

/**
 * After Shopify checkout, "Continue shopping" lands on myshopify.com unless the
 * Hydrogen redirect theme is installed. When it is, customers arrive on `/` from
 * Shopify — this sends them to our order confirmation screen.
 */
export function PostCheckoutReturnHandler() {
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    if (!shouldShowCheckoutSuccessReturn()) return;

    handled.current = true;
    clearCheckoutPending();
    void navigate({ to: "/checkout", search: { order: "success" } });
  }, [navigate]);

  return null;
}
