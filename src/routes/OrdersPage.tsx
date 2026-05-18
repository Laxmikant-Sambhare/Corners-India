import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import { fluid1920 } from "../navDesignTokens";
import { useAuthStore } from "../store/authStore";

const ACCENT = "#bc7e5a";
const PAGE_BG = "#f3ede3";
const DARK = "#1a1814";
const MUTED = "#4b4a4a";
const TAN = "#ccbca6";
const BORDER = "rgba(204,188,166,0.45)";
const CARD_BG = "rgba(204,188,166,0.13)";

const SHOP_ID = import.meta.env.VITE_SHOPIFY_SHOP_ID ?? "";
const CUSTOMER_PORTAL_URL = `https://shopify.com/${SHOP_ID}/account`;

const labelSx = {
  fontFamily: FONT_NAV,
  fontWeight: 600,
  fontSize: fluid1920(11, { min: 10, max: 12 }),
  color: MUTED,
  textTransform: "uppercase" as const,
  letterSpacing: "0.07em",
  mb: "6px",
  display: "block",
};

const inputSx = {
  width: "100%",
  bgcolor: PAGE_BG,
  border: `1.5px solid ${BORDER}`,
  borderRadius: "10px",
  px: fluid1920(16, { min: 13, max: 18 }),
  py: fluid1920(12, { min: 10, max: 14 }),
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

/* ── Info card ── */
function InfoCard({
  icon,
  title,
  body,
  cta,
  ctaHref,
  ctaExternal = true,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  ctaHref: string;
  ctaExternal?: boolean;
}) {
  return (
    <Box
      sx={{
        bgcolor: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: "16px",
        p: fluid1920(28, { min: 20, max: 32 }),
        display: "flex",
        flexDirection: "column",
        gap: fluid1920(16, { min: 12, max: 18 }),
        flex: 1,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "12px",
          bgcolor: "rgba(188,126,90,0.12)",
          border: `1px solid rgba(188,126,90,0.2)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Stack gap="6px" sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontFamily: FONT_SURGENA,
            fontWeight: 600,
            fontSize: fluid1920(18, { min: 15, max: 20 }),
            color: DARK,
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 400,
            fontSize: fluid1920(13, { min: 12, max: 14 }),
            color: MUTED,
            lineHeight: 1.65,
          }}
        >
          {body}
        </Typography>
      </Stack>
      {ctaExternal ? (
        <Box
          component="a"
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: fluid1920(12, { min: 11, max: 13 }),
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: ACCENT,
            textDecoration: "none",
            "&:hover": { opacity: 0.75 },
          }}
        >
          {cta}
          <Box component="span" aria-hidden>↗</Box>
        </Box>
      ) : (
        <ButtonBase
          component={RouterLink}
          to={ctaHref}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: fluid1920(12, { min: 11, max: 13 }),
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: ACCENT,
            "&:hover": { opacity: 0.75 },
          }}
        >
          {cta} →
        </ButtonBase>
      )}
    </Box>
  );
}

/* ════════════════════════════════════════════════════════
   Main page
════════════════════════════════════════════════════════ */
export function OrdersPage() {
  const customer = useAuthStore((s) => s.customer);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const loggedIn = isLoggedIn();

  const [orderNo, setOrderNo] = useState("");
  const [email, setEmail] = useState("");

  function handleTrack(e: FormEvent) {
    e.preventDefault();
    if (!orderNo.trim()) return;
    const base = `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN ?? ""}`;
    window.open(`${base}/apps/track-order?order=${encodeURIComponent(orderNo)}&email=${encodeURIComponent(email)}`, "_blank");
  }

  return (
    <Stack gap={fluid1920(52, { min: 36, max: 60 })}>
      {/* Header */}
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
          {loggedIn && customer ? `Hi, ${customer.firstName}.` : "My Orders"}
        </Typography>
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 400,
            fontSize: fluid1920(14, { min: 13, max: 15 }),
            color: MUTED,
          }}
        >
          {loggedIn
            ? "Manage your orders and track deliveries below."
            : "Sign in to view your order history and track deliveries."}
        </Typography>
      </Stack>

      {/* Not logged in CTA */}
      {!loggedIn && (
        <Box
          sx={{
            bgcolor: CARD_BG,
            border: `1.5px solid ${BORDER}`,
            borderRadius: "20px",
            p: fluid1920(40, { min: 28, max: 48 }),
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { sm: "center" },
            gap: fluid1920(24, { min: 16, max: 28 }),
            justifyContent: "space-between",
          }}
        >
          <Stack gap="6px">
            <Typography
              sx={{
                fontFamily: FONT_SURGENA,
                fontWeight: 600,
                fontSize: fluid1920(22, { min: 17, max: 24 }),
                color: DARK,
              }}
            >
              Sign in to see your orders
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 400,
                fontSize: fluid1920(13, { min: 12, max: 14 }),
                color: MUTED,
                maxWidth: 380,
                lineHeight: 1.65,
              }}
            >
              View order history, track shipments and get delivery updates from your account.
            </Typography>
          </Stack>
          <ButtonBase
            component={RouterLink}
            to="/login"
            sx={{
              bgcolor: ACCENT,
              color: PAGE_BG,
              fontFamily: FONT_NAV,
              fontWeight: 700,
              fontSize: fluid1920(13, { min: 12, max: 14 }),
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              px: fluid1920(32, { min: 22, max: 36 }),
              py: fluid1920(14, { min: 11, max: 16 }),
              borderRadius: "12px",
              whiteSpace: "nowrap",
              flexShrink: 0,
              "&:hover": { opacity: 0.9 },
            }}
          >
            Sign In
          </ButtonBase>
        </Box>
      )}

      {/* Logged in — account portal + info cards */}
      {loggedIn && (
        <Stack gap={fluid1920(14, { min: 10, max: 16 })}>
          {/* Main CTA — Shopify Customer Portal */}
          <Box
            sx={{
              bgcolor: DARK,
              borderRadius: "20px",
              p: fluid1920(36, { min: 24, max: 42 }),
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { sm: "center" },
              justifyContent: "space-between",
              gap: fluid1920(20, { min: 14, max: 24 }),
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circle */}
            <Box sx={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", right: -60, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />

            <Stack gap="6px" sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                sx={{
                  fontFamily: FONT_SURGENA,
                  fontWeight: 600,
                  fontSize: fluid1920(24, { min: 18, max: 26 }),
                  color: PAGE_BG,
                  lineHeight: 1.2,
                }}
              >
                View Order History
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 400,
                  fontSize: fluid1920(13, { min: 12, max: 14 }),
                  color: "rgba(243,237,227,0.55)",
                  maxWidth: 360,
                  lineHeight: 1.65,
                }}
              >
                See all your past orders, invoices, and delivery status in your Shopify account portal.
              </Typography>
            </Stack>

            <Box
              component="a"
              href={CUSTOMER_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                bgcolor: ACCENT,
                color: PAGE_BG,
                fontFamily: FONT_NAV,
                fontWeight: 700,
                fontSize: fluid1920(13, { min: 12, max: 14 }),
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                px: fluid1920(28, { min: 20, max: 32 }),
                py: fluid1920(14, { min: 11, max: 16 }),
                borderRadius: "12px",
                whiteSpace: "nowrap",
                flexShrink: 0,
                textDecoration: "none",
                display: "inline-block",
                position: "relative",
                zIndex: 1,
                "&:hover": { opacity: 0.9 },
              }}
            >
              My Orders ↗
            </Box>
          </Box>

          {/* Info cards row */}
          <Stack direction={{ xs: "column", sm: "row" }} gap={fluid1920(14, { min: 10, max: 16 })}>
            <InfoCard
              title="Track Delivery"
              body="Get real-time delivery updates and estimated arrival directly from the carrier."
              cta="Track on Shopify"
              ctaHref={CUSTOMER_PORTAL_URL}
              icon={
                <Box component="svg" viewBox="0 0 24 24" fill="none" aria-hidden sx={{ width: 24, height: 24 }}>
                  <path d="M3 9h12v11H3zM15 11l5 2.5V20h-5" stroke={ACCENT} strokeWidth="1.5" strokeLinejoin="round" />
                  <circle cx="7" cy="21" r="2" stroke={ACCENT} strokeWidth="1.4" />
                  <circle cx="18" cy="21" r="2" stroke={ACCENT} strokeWidth="1.4" />
                </Box>
              }
            />
            <InfoCard
              title="Returns & Exchange"
              body="Ordered the wrong size or changed your mind? Start a return or exchange request."
              cta="Manage Return"
              ctaHref={CUSTOMER_PORTAL_URL}
              icon={
                <Box component="svg" viewBox="0 0 24 24" fill="none" aria-hidden sx={{ width: 24, height: 24 }}>
                  <path d="M3 10h13a5 5 0 0 1 0 10H9" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M6 7L3 10l3 3" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </Box>
              }
            />
            <InfoCard
              title="Need Help?"
              body="Have a question about your order, fabric, or customisation? Our team is here for you."
              cta="Contact Us"
              ctaHref="mailto:hello@cornersindia.com"
              icon={
                <Box component="svg" viewBox="0 0 24 24" fill="none" aria-hidden sx={{ width: 24, height: 24 }}>
                  <circle cx="12" cy="12" r="9" stroke={ACCENT} strokeWidth="1.5" />
                  <path d="M12 8v5M12 16h.01" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" />
                </Box>
              }
            />
          </Stack>
        </Stack>
      )}

      {/* Track order form — always visible */}
      <Box
        sx={{
          bgcolor: CARD_BG,
          border: `1px solid ${BORDER}`,
          borderRadius: "20px",
          p: fluid1920(36, { min: 24, max: 42 }),
        }}
      >
        <Stack gap={fluid1920(20, { min: 16, max: 24 })}>
          <Stack gap="4px">
            <Typography
              sx={{
                fontFamily: FONT_SURGENA,
                fontWeight: 600,
                fontSize: fluid1920(22, { min: 17, max: 24 }),
                color: DARK,
              }}
            >
              Track an Order
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 400,
                fontSize: fluid1920(13, { min: 12, max: 14 }),
                color: MUTED,
              }}
            >
              Enter your order number and email to check delivery status.
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleTrack}>
            <Stack direction={{ xs: "column", sm: "row" }} gap={fluid1920(12, { min: 10, max: 14 })}>
              <Box sx={{ flex: 1 }}>
                <Typography component="label" htmlFor="orderNo" sx={labelSx}>
                  Order Number
                </Typography>
                <Box
                  component="input"
                  id="orderNo"
                  type="text"
                  placeholder="#1001"
                  value={orderNo}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrderNo(e.target.value)}
                  required
                  sx={inputSx}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography component="label" htmlFor="trackEmail" sx={labelSx}>
                  Email Address
                </Typography>
                <Box
                  component="input"
                  id="trackEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  sx={inputSx}
                />
              </Box>
              <Stack justifyContent="flex-end">
                <ButtonBase
                  type="submit"
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
                    borderRadius: "10px",
                    whiteSpace: "nowrap",
                    mt: { xs: "4px", sm: "22px" },
                    "&:hover": { opacity: 0.9 },
                  }}
                >
                  Track Order
                </ButtonBase>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
