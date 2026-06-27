import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "@tanstack/react-router";
import { useState } from "react";
import {
  OrderDetailModal,
  formatOrderDate,
  formatOrderMoney,
  isOrderCancelled,
  orderStatusLabel,
} from "../components/OrderDetailModal";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import {
  furnitureListingBadgeFontSize,
  furnitureListingBadgePadX,
  furnitureListingBadgePadY,
  furnitureListingCardImageMaxW,
  furnitureListingCardMetaGap,
  furnitureListingCardMetaMaxW,
  furnitureListingCardPad,
  furnitureListingCardRadius,
  furnitureListingCardSectionGap,
  furnitureListingGridColGap,
  furnitureListingGridRowGap,
  furnitureListingImageH,
  furnitureListingPriceSize,
  furnitureListingProductTitleSize,
  fluid1920,
  shopBorderWidth,
  shopRadius,
} from "../navDesignTokens";
import {
  isCustomerAccountAccessToken,
  type OrderDetail,
} from "../shopify/customerAccountAuth";
import { useCustomerOrders } from "../shopify/hooks";
import { useAuthStore } from "../store/authStore";

const ACCENT = "#bc7e5a";
const PAGE_BG = "#f3ede3";
const DARK = "#1a1814";
const MUTED = "#4b4a4a";
const TAN = "#ccbca6";
const BORDER = "rgba(204,188,166,0.45)";
const CARD_BG = "rgba(204,188,166,0.13)";

function orderCardSubtitle(order: OrderDetail): string {
  const itemCount = order.lineItems.reduce((sum, li) => sum + li.quantity, 0);
  const primary = order.lineItems[0]?.title ?? "Order";
  if (order.lineItems.length <= 1) {
    return `${formatOrderDate(order.processedAt)} · ${itemCount} item`;
  }
  return `${formatOrderDate(order.processedAt)} · ${primary} +${order.lineItems.length - 1} more`;
}

function OrderCard({
  order,
  onOpen,
}: {
  order: OrderDetail;
  onOpen: () => void;
}) {
  const heroItem = order.lineItems[0];
  const cancelled = isOrderCancelled(order);
  const statusLabel = orderStatusLabel(order);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <Box aria-hidden sx={{ height: 10, flexShrink: 0 }} />
      <Box
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
        sx={{
          flex: 1,
          borderRadius: furnitureListingCardRadius,
          border: `${shopBorderWidth} solid ${TAN}`,
          boxSizing: "border-box",
          px: furnitureListingCardPad,
          py: furnitureListingCardPad,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: furnitureListingCardSectionGap,
          cursor: "pointer",
          width: "100%",
          bgcolor: PAGE_BG,
          opacity: cancelled ? 0.72 : 1,
          transition:
            "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s ease, border-color 0.28s ease",
          "@media (hover: hover)": {
            "&:hover": {
              transform: "translateY(-6px)",
              borderColor: ACCENT,
              boxShadow: "0 14px 32px rgba(75, 74, 74, 0.12)",
              "& .order-card-image": {
                transform: "scale(1.05)",
              },
              "& .order-card-title": {
                color: ACCENT,
              },
            },
          },
          "&:active": {
            transform: "translateY(-2px)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: furnitureListingCardMetaMaxW,
          }}
        >
          <Box
            sx={{
              bgcolor: cancelled ? "rgba(75,74,74,0.14)" : TAN,
              color: cancelled ? MUTED : PAGE_BG,
              px: furnitureListingBadgePadX,
              py: furnitureListingBadgePadY,
              borderRadius: shopRadius,
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: furnitureListingBadgeFontSize,
              textTransform: "uppercase",
              lineHeight: 1,
              border: cancelled ? `1px solid rgba(75,74,74,0.18)` : "none",
            }}
          >
            {statusLabel}
          </Box>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 500,
              fontSize: 12,
              color: MUTED,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            #{order.orderNumber}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            maxWidth: furnitureListingCardImageMaxW,
            height: furnitureListingImageH,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            mx: "auto",
            overflow: "hidden",
            borderRadius: shopRadius,
            bgcolor: "rgba(255,255,255,0.35)",
          }}
        >
          {heroItem?.imageUrl ? (
            <Box
              component="img"
              className="order-card-image"
              src={heroItem.imageUrl}
              alt={heroItem.imageAlt ?? heroItem.title}
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
                transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          ) : (
            <Typography sx={{ fontFamily: FONT_NAV, fontSize: 13, color: MUTED }}>
              Order
            </Typography>
          )}
        </Box>

        <Stack
          sx={{
            alignItems: "flex-start",
            width: "100%",
            maxWidth: furnitureListingCardMetaMaxW,
            gap: furnitureListingCardMetaGap,
          }}
        >
          <Typography
            className="order-card-title"
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: furnitureListingProductTitleSize,
              lineHeight: 1,
              textTransform: "uppercase",
              color: MUTED,
              transition: "color 0.28s ease",
            }}
          >
            {heroItem?.title ?? `Order #${order.orderNumber}`}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 500,
              fontSize: furnitureListingPriceSize,
              lineHeight: 1,
              color: ACCENT,
            }}
          >
            {formatOrderMoney(order.totalPrice.amount, order.totalPrice.currencyCode)}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 400,
              fontSize: 13,
              lineHeight: 1.45,
              color: MUTED,
            }}
          >
            {orderCardSubtitle(order)}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: ACCENT,
              mt: 0.5,
            }}
          >
            View details
          </Typography>
        </Stack>
      </Box>
      <Box aria-hidden sx={{ height: 20, flexShrink: 0 }} />
    </Box>
  );
}

export function OrdersPage() {
  const customer = useAuthStore((s) => s.customer);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const loggedIn = isLoggedIn();
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const needsReauth =
    loggedIn &&
    Boolean(accessToken) &&
    !isCustomerAccountAccessToken(accessToken!);
  const { data: orders, isLoading, isError, error, refetch, isFetching } =
    useCustomerOrders();

  return (
    <>
      <Stack gap={fluid1920(40, { min: 28, max: 48 })}>
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
              ? "Tap an order to view full details, tracking, and delivery info."
              : "Sign in to view your order history and track deliveries."}
          </Typography>
        </Stack>

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
                View order history, track shipments, and get delivery updates on
                your Corners account.
              </Typography>
            </Stack>
            <ButtonBase
              component={RouterLink}
              to="/login?next=%2Forders"
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

        {loggedIn && needsReauth && (
          <Box
            sx={{
              bgcolor: "rgba(188,126,90,0.08)",
              border: `1px solid rgba(188,126,90,0.25)`,
              borderRadius: "16px",
              p: fluid1920(24, { min: 18, max: 28 }),
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontSize: fluid1920(14, { min: 13, max: 15 }),
                color: DARK,
                mb: 2,
                lineHeight: 1.6,
              }}
            >
              Your session needs to be refreshed. Sign out, then sign in again with
              &ldquo;Continue with Shopify&rdquo; to load orders and tracking.
            </Typography>
            <ButtonBase
              component={RouterLink}
              to="/login?next=%2Forders"
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 600,
                fontSize: fluid1920(12, { min: 11, max: 13 }),
                color: ACCENT,
                textTransform: "uppercase",
              }}
            >
              Sign in again
            </ButtonBase>
          </Box>
        )}

        {loggedIn && !needsReauth && (
          <Stack gap={fluid1920(16, { min: 12, max: 20 })}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography
                sx={{
                  fontFamily: FONT_SURGENA,
                  fontWeight: 600,
                  fontSize: fluid1920(24, { min: 18, max: 26 }),
                  color: DARK,
                }}
              >
                Your orders
              </Typography>
              <ButtonBase
                type="button"
                onClick={() => void refetch()}
                disabled={isFetching}
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 600,
                  fontSize: fluid1920(12, { min: 11, max: 13 }),
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: ACCENT,
                  opacity: isFetching ? 0.5 : 1,
                }}
              >
                {isFetching ? "Refreshing…" : "Refresh"}
              </ButtonBase>
            </Stack>

            {isLoading ? (
              <Stack alignItems="center" py={6}>
                <CircularProgress sx={{ color: ACCENT }} size={32} />
              </Stack>
            ) : isError ? (
              <Box
                sx={{
                  bgcolor: "rgba(188,126,90,0.08)",
                  border: `1px solid rgba(188,126,90,0.25)`,
                  borderRadius: "16px",
                  p: fluid1920(24, { min: 18, max: 28 }),
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontSize: fluid1920(14, { min: 13, max: 15 }),
                    color: DARK,
                    mb: 2,
                  }}
                >
                  {error instanceof Error
                    ? error.message
                    : "Could not load your orders. Try signing out and back in."}
                </Typography>
                <ButtonBase
                  type="button"
                  onClick={() => void refetch()}
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 600,
                    fontSize: fluid1920(12, { min: 11, max: 13 }),
                    color: ACCENT,
                    textTransform: "uppercase",
                  }}
                >
                  Try again
                </ButtonBase>
              </Box>
            ) : orders && orders.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                  },
                  rowGap: furnitureListingGridRowGap,
                  columnGap: furnitureListingGridColGap,
                  width: "100%",
                }}
              >
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onOpen={() => setSelectedOrder(order)}
                  />
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  bgcolor: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  borderRadius: "20px",
                  p: fluid1920(36, { min: 24, max: 42 }),
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT_SURGENA,
                    fontWeight: 600,
                    fontSize: fluid1920(20, { min: 16, max: 22 }),
                    color: DARK,
                    mb: 1,
                  }}
                >
                  No orders yet
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontSize: fluid1920(14, { min: 13, max: 15 }),
                    color: MUTED,
                    mb: 3,
                  }}
                >
                  When you place an order, it will show up here with live tracking.
                </Typography>
                <ButtonBase
                  component={RouterLink}
                  to="/"
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
                  Start shopping
                </ButtonBase>
              </Box>
            )}
          </Stack>
        )}
      </Stack>

      <OrderDetailModal
        open={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        contactEmail={customer?.email}
      />
    </>
  );
}
