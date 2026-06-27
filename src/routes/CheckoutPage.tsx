import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import { fluid1920 } from "../navDesignTokens";
import { createShopifyCart, isShopifyConfigured } from "../shopify/client";
import { useShopifyProducts, useShopifyVariantMap, variantMapKey } from "../shopify/hooks";
import { cartTotalItems, useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import {
  formatPriceShort,
  parsePriceValue,
} from "../components/productDetailUtils";

/* ── Design tokens (mirror CartDropdown) ── */
const PAGE_BG = "#f3ede3";
const ACCENT = "#bc7e5a";
const TAN = "#ccbca6";
const MUTED = "#4b4a4a";
const DARK = "#1a1814";
const BORDER = "rgba(204,188,166,0.45)";
const CARD_BG = "rgba(204,188,166,0.18)";

const sectionTitleSx = {
  fontFamily: FONT_SURGENA,
  fontWeight: 600,
  fontSize: fluid1920(22, { min: 17, max: 24 }),
  color: DARK,
  letterSpacing: "0.01em",
};

const labelSx = {
  fontFamily: FONT_NAV,
  fontWeight: 600,
  fontSize: fluid1920(11, { min: 10, max: 12 }),
  color: MUTED,
  textTransform: "uppercase" as const,
  letterSpacing: "0.07em",
  mb: "6px",
};

const inputBaseSx = {
  width: "100%",
  bgcolor: PAGE_BG,
  border: `1.5px solid ${BORDER}`,
  borderRadius: "10px",
  px: fluid1920(18, { min: 13, max: 20 }),
  py: fluid1920(13, { min: 10, max: 15 }),
  fontFamily: FONT_NAV,
  fontWeight: 400,
  fontSize: fluid1920(14, { min: 13, max: 15 }),
  color: DARK,
  outline: "none",
  transition: "border-color 0.18s",
  boxSizing: "border-box" as const,
  "&:focus": { borderColor: ACCENT },
  "&::placeholder": { color: TAN, opacity: 1 },
};

type Fields = {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pin: string;
};

const EMPTY: Fields = {
  name: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  pin: "",
};

/* ── Breadcrumb chevron ── */
function Chevron() {
  return (
    <Box
      component="svg"
      viewBox="0 0 10 16"
      fill="none"
      aria-hidden
      sx={{ width: 7, height: 11, display: "block", flexShrink: 0 }}
    >
      <path
        d="M2 2l6 6-6 6"
        stroke={TAN}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}

/* ── Checkmark for confirmation ── */
function CheckCircle() {
  return (
    <Box
      component="svg"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      sx={{ width: 64, height: 64, display: "block" }}
    >
      <circle cx="32" cy="32" r="31" stroke={ACCENT} strokeWidth="2" />
      <path
        d="M18 33l10 10 18-20"
        stroke={ACCENT}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}

/* ── Field wrapper ── */
function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <Box component="label" htmlFor={id} sx={{ display: "block" }}>
      <Typography component="span" sx={labelSx}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

/* ── Order confirmation screen ── */
function Confirmation({ name }: { name: string }) {
  const customer = useAuthStore((s) => s.customer);
  const displayName =
    name.split(" ")[0] ||
    customer?.firstName ||
    "there";

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        py: fluid1920(80, { min: 48, max: 96 }),
        textAlign: "center",
        gap: fluid1920(24, { min: 18, max: 28 }),
      }}
    >
      <CheckCircle />
      <Stack gap="8px" alignItems="center">
        <Typography
          sx={{
            fontFamily: FONT_SURGENA,
            fontWeight: 600,
            fontSize: fluid1920(36, { min: 26, max: 40 }),
            color: DARK,
            letterSpacing: "0.01em",
          }}
        >
          Order Placed!
        </Typography>
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 500,
            fontSize: fluid1920(15, { min: 13, max: 16 }),
            color: MUTED,
          }}
        >
          Thank you, {displayName}. We've received your order.
        </Typography>
      </Stack>

      <Box
        sx={{
          bgcolor: CARD_BG,
          borderRadius: "14px",
          px: fluid1920(36, { min: 24, max: 40 }),
          py: fluid1920(20, { min: 14, max: 24 }),
          border: `1px solid ${BORDER}`,
          width: "100%",
          maxWidth: 420,
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 400,
            fontSize: fluid1920(14, { min: 13, max: 15 }),
            color: MUTED,
            lineHeight: 1.65,
          }}
        >
          Our team will reach out within 48 hours to confirm your order and
          discuss customisation details. Estimated lead time is{" "}
          <Box component="span" sx={{ color: ACCENT, fontWeight: 600 }}>
            5 weeks
          </Box>{" "}
          from confirmation.
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap="12px"
        alignItems="center"
        sx={{ mt: "4px" }}
      >
        <ButtonBase
          component={RouterLink}
          to="/orders"
          sx={{
            bgcolor: ACCENT,
            color: PAGE_BG,
            fontFamily: FONT_NAV,
            fontWeight: 700,
            fontSize: fluid1920(13, { min: 12, max: 14 }),
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            px: fluid1920(28, { min: 20, max: 32 }),
            py: fluid1920(13, { min: 10, max: 15 }),
            borderRadius: "12px",
            "&:hover": { opacity: 0.9 },
          }}
        >
          View My Orders
        </ButtonBase>
        <ButtonBase
          component={RouterLink}
          to="/"
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: fluid1920(13, { min: 12, max: 14 }),
            color: ACCENT,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            border: `1.5px solid rgba(188,126,90,0.35)`,
            px: fluid1920(24, { min: 18, max: 28 }),
            py: fluid1920(12, { min: 9, max: 14 }),
            borderRadius: "12px",
            "&:hover": { opacity: 0.75 },
          }}
        >
          ← Continue Shopping
        </ButtonBase>
      </Stack>
    </Stack>
  );
}

/* ── Empty cart state ── */
function EmptyCart() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        py: fluid1920(80, { min: 48, max: 96 }),
        gap: fluid1920(20, { min: 16, max: 24 }),
        textAlign: "center",
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden
        sx={{ width: 52, height: 52, color: TAN }}
      >
        <path
          d="M16 20V14a8 8 0 0 1 16 0v6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 20h32l-3 22H11L8 20Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </Box>
      <Typography
        sx={{
          fontFamily: FONT_SURGENA,
          fontWeight: 600,
          fontSize: fluid1920(24, { min: 20, max: 28 }),
          color: DARK,
        }}
      >
        Your cart is empty
      </Typography>
      <Typography
        sx={{
          fontFamily: FONT_NAV,
          fontWeight: 400,
          fontSize: fluid1920(14, { min: 13, max: 15 }),
          color: MUTED,
        }}
      >
        Add some pieces before checking out.
      </Typography>
      <ButtonBase
        component={RouterLink}
        to="/category/furniture"
        sx={{
          bgcolor: ACCENT,
          color: PAGE_BG,
          fontFamily: FONT_NAV,
          fontWeight: 600,
          fontSize: fluid1920(13, { min: 12, max: 14 }),
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          px: fluid1920(32, { min: 22, max: 36 }),
          py: fluid1920(14, { min: 11, max: 16 }),
          borderRadius: "10px",
          "&:hover": { opacity: 0.9 },
        }}
      >
        Shop Furniture
      </ButtonBase>
    </Stack>
  );
}

/* ════════════════════════════════════════════════════════
   Main page
════════════════════════════════════════════════════════ */
export function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const customer = useAuthStore((s) => s.customer);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  /** Shopify variant map: "product title lower__size" → variantId */
  const variantMap = useShopifyVariantMap();
  const { isLoading: productsLoading, isFetched: productsFetched } =
    useShopifyProducts();

  /* Detect return from Shopify checkout (?order=success) */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("order") === "success") {
      clearCart();
      setConfirmed(true);
      // Clean up the URL without a full reload
      window.history.replaceState({}, "", "/checkout");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Pre-fill email from logged-in customer */
  useEffect(() => {
    if (customer && !fields.email) {
      setFields((prev) => ({
        ...prev,
        name: prev.name || `${customer.firstName} ${customer.lastName}`.trim(),
        email: prev.email || customer.email,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const subtotal = items.reduce(
    (sum, i) => sum + parsePriceValue(i.product.price) * i.quantity,
    0,
  );
  const totalUnits = cartTotalItems(items);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (submitError) setSubmitError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!isShopifyConfigured) {
      setSubmitError(
        "Checkout is not connected to Shopify on this deployment. " +
          "Add VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN in Netlify, then redeploy.",
      );
      return;
    }

    if (productsLoading || !productsFetched) {
      setSubmitError("Products are still loading. Please wait a moment and try again.");
      return;
    }

    if (variantMap.size === 0) {
      setSubmitError(
        "No Shopify products are available for checkout. " +
          "In Shopify Admin, publish products to your Headless sales channel.",
      );
      return;
    }

    const lines = items.flatMap((item) => {
      const key = variantMapKey(item.product.name, item.size);
      const variantId = variantMap.get(key);
      if (!variantId) return [];
      return [{ merchandiseId: variantId, quantity: item.quantity }];
    });

    if (lines.length === 0) {
      setSubmitError(
        "Cart items couldn't be matched to Shopify. Clear your cart, add products again from the shop, then retry.",
      );
      return;
    }

    if (lines.length < items.length) {
      setSubmitError(
        "Some cart items couldn't be checked out. Remove them or re-add from the product page.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Split name into first / last for Shopify address pre-fill
      const nameParts = fields.name.trim().split(" ");
      const firstName = nameParts[0] ?? "";
      const lastName = nameParts.slice(1).join(" ");

      const checkoutUrl = await createShopifyCart(lines, {
        email: fields.email || undefined,
        phone: fields.phone || undefined,
        deliveryAddressPreferences: [
          {
            deliveryAddress: {
              firstName,
              lastName,
              address1: fields.address1 || undefined,
              address2: fields.address2 || undefined,
              city: fields.city || undefined,
              province: fields.state || undefined,
              zip: fields.pin || undefined,
              country: "India",
              phone: fields.phone || undefined,
            },
          },
        ],
      });

      // Redirect to Shopify hosted checkout.
      // return_url points back to /checkout?order=success so we can
      // detect the return, clear the cart, and show order confirmation.
      const url = new URL(checkoutUrl);
      url.searchParams.set(
        "return_url",
        `${window.location.origin}/checkout?order=success`,
      );
      window.location.href = url.toString();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Could not connect to checkout. Please try again.";
      setSubmitError(msg);
      setIsSubmitting(false);
    }
  }

  if (confirmed) {
    return <Confirmation name={fields.name} />;
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  /* ── Login gate ── */
  if (!isLoggedIn()) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        gap={fluid1920(28, { min: 20, max: 32 })}
        sx={{ py: fluid1920(80, { min: 56, max: 96 }), textAlign: "center" }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: CARD_BG,
            border: `1.5px solid ${BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            sx={{ width: 32, height: 32 }}
          >
            <circle cx="12" cy="8" r="4" stroke={ACCENT} strokeWidth="1.6" />
            <path
              d="M4 20c0-4 3.582-7 8-7s8 3 8 7"
              stroke={ACCENT}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </Box>
        </Box>

        <Stack gap="8px" alignItems="center">
          <Typography
            component="h2"
            sx={{
              fontFamily: FONT_SURGENA,
              fontWeight: 600,
              fontSize: fluid1920(36, { min: 24, max: 40 }),
              color: DARK,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            Sign in to continue
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 400,
              fontSize: fluid1920(14, { min: 13, max: 15 }),
              color: MUTED,
              maxWidth: 380,
              lineHeight: 1.6,
            }}
          >
            Create an account or sign in to place your order and track it from
            your dashboard.
          </Typography>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} gap="12px">
          <ButtonBase
            onClick={() =>
              void navigate({ to: "/login", search: { next: "/checkout" } })
            }
            sx={{
              bgcolor: ACCENT,
              color: PAGE_BG,
              fontFamily: FONT_NAV,
              fontWeight: 700,
              fontSize: fluid1920(13, { min: 12, max: 14 }),
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              px: fluid1920(36, { min: 24, max: 40 }),
              py: fluid1920(14, { min: 11, max: 16 }),
              borderRadius: "12px",
              "&:hover": { opacity: 0.9 },
            }}
          >
            Sign In / Register
          </ButtonBase>
          <ButtonBase
            component={RouterLink}
            to="/"
            sx={{
              border: `1.5px solid ${BORDER}`,
              color: MUTED,
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: fluid1920(13, { min: 12, max: 14 }),
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              px: fluid1920(28, { min: 20, max: 32 }),
              py: fluid1920(13, { min: 10, max: 15 }),
              borderRadius: "12px",
              "&:hover": { borderColor: ACCENT, color: ACCENT },
            }}
          >
            Continue Shopping
          </ButtonBase>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack gap={fluid1920(48, { min: 32, max: 56 })}>
      {/* Breadcrumb */}
      <Stack direction="row" alignItems="center" gap="10px">
        <ButtonBase
          component={RouterLink}
          to="/"
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 500,
            fontSize: fluid1920(13, { min: 12, max: 14 }),
            color: TAN,
            "&:hover": { color: MUTED },
          }}
        >
          Home
        </ButtonBase>
        <Chevron />
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 500,
            fontSize: fluid1920(13, { min: 12, max: 14 }),
            color: MUTED,
          }}
        >
          Checkout
        </Typography>
      </Stack>

      {/* Page title */}
      <Stack gap="6px">
        <Typography
          component="h1"
          sx={{
            fontFamily: FONT_SURGENA,
            fontWeight: 600,
            fontSize: fluid1920(52, { min: 32, max: 60 }),
            color: DARK,
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}
        >
          Checkout
        </Typography>
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 400,
            fontSize: fluid1920(14, { min: 13, max: 15 }),
            color: MUTED,
          }}
        >
          {totalUnits} {totalUnits === 1 ? "item" : "items"} · All pieces are
          made to order
        </Typography>
      </Stack>

      {/* Two-column layout */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 400px" },
          gap: fluid1920(48, { min: 32, max: 56 }),
          alignItems: "start",
        }}
      >
        {/* ── LEFT: Form ── */}
        <Stack gap={fluid1920(40, { min: 28, max: 44 })}>
          {/* Contact */}
          <Stack gap={fluid1920(24, { min: 18, max: 28 })}>
            <Stack gap="4px">
              <Typography sx={sectionTitleSx}>Contact</Typography>
              <Divider sx={{ borderColor: BORDER, mt: "10px" }} />
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: fluid1920(16, { min: 12, max: 18 }),
              }}
            >
              <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
                <Field label="Full Name" id="name">
                  <Box
                    component="input"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={fields.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    sx={inputBaseSx}
                  />
                </Field>
              </Box>
              <Field label="Email Address" id="email">
                <Box
                  component="input"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={fields.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  sx={inputBaseSx}
                />
              </Field>
              <Field label="Phone Number" id="phone">
                <Box
                  component="input"
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={fields.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  sx={inputBaseSx}
                />
              </Field>
            </Box>
          </Stack>

          {/* Shipping */}
          <Stack gap={fluid1920(24, { min: 18, max: 28 })}>
            <Stack gap="4px">
              <Typography sx={sectionTitleSx}>Shipping Address</Typography>
              <Divider sx={{ borderColor: BORDER, mt: "10px" }} />
            </Stack>

            <Stack gap={fluid1920(16, { min: 12, max: 18 })}>
              <Field label="Address Line 1" id="address1">
                <Box
                  component="input"
                  id="address1"
                  name="address1"
                  type="text"
                  placeholder="House / Flat / Street"
                  value={fields.address1}
                  onChange={handleChange}
                  required
                  autoComplete="address-line1"
                  sx={inputBaseSx}
                />
              </Field>
              <Field label="Address Line 2 (optional)" id="address2">
                <Box
                  component="input"
                  id="address2"
                  name="address2"
                  type="text"
                  placeholder="Landmark, Area"
                  value={fields.address2}
                  onChange={handleChange}
                  autoComplete="address-line2"
                  sx={inputBaseSx}
                />
              </Field>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: fluid1920(16, { min: 12, max: 18 }),
                }}
              >
                <Field label="City" id="city">
                  <Box
                    component="input"
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Mumbai"
                    value={fields.city}
                    onChange={handleChange}
                    required
                    autoComplete="address-level2"
                    sx={inputBaseSx}
                  />
                </Field>
                <Field label="State" id="state">
                  <Box
                    component="input"
                    id="state"
                    name="state"
                    type="text"
                    placeholder="Maharashtra"
                    value={fields.state}
                    onChange={handleChange}
                    required
                    autoComplete="address-level1"
                    sx={inputBaseSx}
                  />
                </Field>
                <Field label="PIN Code" id="pin">
                  <Box
                    component="input"
                    id="pin"
                    name="pin"
                    type="text"
                    placeholder="400001"
                    value={fields.pin}
                    onChange={handleChange}
                    required
                    autoComplete="postal-code"
                    inputMode="numeric"
                    sx={inputBaseSx}
                  />
                </Field>
              </Box>
            </Stack>
          </Stack>

          {/* Delivery note */}
          <Box
            sx={{
              bgcolor: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: "14px",
              px: fluid1920(24, { min: 18, max: 28 }),
              py: fluid1920(18, { min: 14, max: 22 }),
            }}
          >
            <Stack direction="row" gap="12px" alignItems="flex-start">
              <Box
                component="svg"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden
                sx={{
                  width: 18,
                  height: 18,
                  flexShrink: 0,
                  mt: "2px",
                  color: ACCENT,
                }}
              >
                <circle
                  cx="10"
                  cy="10"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M10 9v5M10 6.5v.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 400,
                  fontSize: fluid1920(13, { min: 12, max: 14 }),
                  color: MUTED,
                  lineHeight: 1.6,
                }}
              >
                All Corners pieces are{" "}
                <Box component="span" sx={{ fontWeight: 600, color: DARK }}>
                  made to order
                </Box>
                . Estimated lead time is 5 weeks from order confirmation.
                Shipping charges are calculated on volumetric weight and will be
                confirmed by our team.
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* ── RIGHT: Order summary ── */}
        <Stack
          gap={fluid1920(20, { min: 16, max: 24 })}
          sx={{
            bgcolor: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: "18px",
            p: fluid1920(28, { min: 20, max: 32 }),
            position: { lg: "sticky" },
            top: { lg: "100px" },
          }}
        >
          <Typography
            sx={{
              fontFamily: FONT_SURGENA,
              fontWeight: 600,
              fontSize: fluid1920(20, { min: 16, max: 22 }),
              color: DARK,
              letterSpacing: "0.01em",
            }}
          >
            Order Summary
          </Typography>

          <Divider sx={{ borderColor: BORDER }} />

          {/* Items */}
          <Stack
            component="ul"
            sx={{
              listStyle: "none",
              m: 0,
              p: 0,
              gap: fluid1920(16, { min: 12, max: 18 }),
              maxHeight: "min(50vh, 360px)",
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                background: TAN,
                borderRadius: "4px",
              },
            }}
          >
            {items.map((cartItem) => (
              <Box
                key={cartItem.id}
                component="li"
                sx={{
                  display: "flex",
                  gap: fluid1920(14, { min: 10, max: 16 }),
                  alignItems: "flex-start",
                  pb: fluid1920(16, { min: 12, max: 18 }),
                  borderBottom: `1px solid ${BORDER}`,
                  "&:last-child": { borderBottom: "none", pb: 0 },
                }}
              >
                <Box
                  component="img"
                  src={cartItem.product.image}
                  alt={cartItem.product.name}
                  sx={{
                    width: fluid1920(64, { min: 52, max: 72 }),
                    height: fluid1920(64, { min: 52, max: 72 }),
                    flexShrink: 0,
                    objectFit: "cover",
                    borderRadius: "8px",
                    bgcolor: "#e8dfd4",
                  }}
                />
                <Stack sx={{ flex: 1, minWidth: 0, gap: "3px" }}>
                  <Typography
                    sx={{
                      fontFamily: FONT_NAV,
                      fontWeight: 600,
                      fontSize: fluid1920(13, { min: 12, max: 14 }),
                      color: DARK,
                      lineHeight: 1.3,
                    }}
                  >
                    {cartItem.product.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONT_NAV,
                      fontWeight: 400,
                      fontSize: fluid1920(12, { min: 11, max: 13 }),
                      color: TAN,
                    }}
                  >
                    {cartItem.size}
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="baseline"
                    sx={{ mt: "2px" }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_NAV,
                        fontWeight: 500,
                        fontSize: fluid1920(12, { min: 11, max: 13 }),
                        color: MUTED,
                      }}
                    >
                      Qty: {cartItem.quantity}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONT_NAV,
                        fontWeight: 600,
                        fontSize: fluid1920(13, { min: 12, max: 14 }),
                        color: ACCENT,
                      }}
                    >
                      {formatPriceShort(cartItem.product.price)}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ borderColor: BORDER }} />

          {/* Subtotal rows */}
          <Stack gap={fluid1920(10, { min: 8, max: 12 })}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 500,
                  fontSize: fluid1920(13, { min: 12, max: 14 }),
                  color: MUTED,
                }}
              >
                Subtotal
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 600,
                  fontSize: fluid1920(13, { min: 12, max: 14 }),
                  color: DARK,
                }}
              >
                RS {Math.round(subtotal).toLocaleString("en-IN")}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 500,
                  fontSize: fluid1920(13, { min: 12, max: 14 }),
                  color: MUTED,
                }}
              >
                Shipping
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 500,
                  fontSize: fluid1920(13, { min: 12, max: 14 }),
                  color: TAN,
                }}
              >
                Calculated by team
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 500,
                  fontSize: fluid1920(12, { min: 11, max: 13 }),
                  color: TAN,
                }}
              >
                MRP incl. of all taxes
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: BORDER }} />

          {/* Total */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 700,
                fontSize: fluid1920(14, { min: 13, max: 15 }),
                color: DARK,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Total
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_SURGENA,
                fontWeight: 600,
                fontSize: fluid1920(22, { min: 18, max: 24 }),
                color: DARK,
              }}
            >
              RS {Math.round(subtotal).toLocaleString("en-IN")}
            </Typography>
          </Stack>

          {/* Error message */}
          {submitError && (
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 500,
                fontSize: fluid1920(12, { min: 11, max: 13 }),
                color: "#c0392b",
                textAlign: "center",
                lineHeight: 1.5,
                bgcolor: "rgba(192,57,43,0.06)",
                border: "1px solid rgba(192,57,43,0.18)",
                borderRadius: "8px",
                px: "12px",
                py: "10px",
              }}
            >
              {submitError}
            </Typography>
          )}

          {/* CTA */}
          <ButtonBase
            type="submit"
            disabled={isSubmitting}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              bgcolor: ACCENT,
              color: PAGE_BG,
              py: fluid1920(15, { min: 12, max: 17 }),
              borderRadius: "12px",
              fontFamily: FONT_NAV,
              fontWeight: 700,
              fontSize: fluid1920(13, { min: 12, max: 14 }),
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              textAlign: "center",
              opacity: isSubmitting ? 0.7 : 1,
              "&:hover": { opacity: isSubmitting ? 0.7 : 0.92 },
              transition: "opacity 0.15s",
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting && (
              <CircularProgress size={14} sx={{ color: PAGE_BG }} />
            )}
            {isSubmitting ? "Redirecting to checkout…" : "Place Order"}
          </ButtonBase>

          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 400,
              fontSize: fluid1920(12, { min: 11, max: 13 }),
              color: TAN,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            {isShopifyConfigured
              ? "You'll be securely redirected to Shopify to complete payment."
              : "By placing an order you agree to our terms. Payment details will be shared by our team."}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
