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
import {
  catalogProductCardBadgeSx,
  catalogProductCardGridSx,
  catalogProductCardImageBoxSx,
  catalogProductCardPriceSx,
  catalogProductCardSurfaceSx,
  catalogProductCardTitleSx,
} from "../components/CatalogProductCard";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import {
  furnitureListingCardMetaMaxW,
  fluid1920,
  shopRadius,
} from "../navDesignTokens";
import {
  isCustomerAccountAccessToken,
  type OrderDetail,
} from "../shopify/customerAccountAuth";
import { useCustomerOrders } from "../shopify/hooks";
import { selectIsLoggedIn, useAuthStore } from "../store/authStore";

const ACCENT = "#bc7e5a";
const PAGE_BG = "#f3ede3";
const DARK = "#1a1814";
const MUTED = "#4b4a4a";
const TAN = "#ccbca6";
const BORDER = "rgba(204,188,166,0.45)";
const HELPER_TEXT = "rgba(75,74,74,0.62)";

const frostedCardSx = {
  bgcolor: "rgba(255,255,255,0.42)",
  border: `1px solid ${BORDER}`,
  borderRadius: shopRadius,
  backdropFilter: "blur(6px)",
} as const;

const primaryBtnSx = {
  bgcolor: ACCENT,
  color: PAGE_BG,
  fontFamily: FONT_NAV,
  fontWeight: 700,
  fontSize: { xs: 12, sm: fluid1920(13, { min: 12, max: 14 }) },
  textTransform: "uppercase" as const,
  letterSpacing: "0.07em",
  borderRadius: shopRadius,
  minHeight: { xs: 48, sm: "auto" },
  px: { xs: 3, sm: fluid1920(32, { min: 22, max: 36 }) },
  py: { xs: 1.25, sm: fluid1920(14, { min: 11, max: 16 }) },
  whiteSpace: "nowrap" as const,
  flexShrink: 0,
  transition: "opacity 0.15s",
  "&:hover": { opacity: 0.9 },
};

const ordersGridSx = {
  ...catalogProductCardGridSx,
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(3, minmax(0, 1fr))",
  },
  rowGap: { xs: 1.25, sm: 2, md: catalogProductCardGridSx.rowGap.sm },
} as const;

function orderCardSubtitle(order: OrderDetail): string {
  const itemCount = order.lineItems.reduce((sum, li) => sum + li.quantity, 0);
  const primary = order.lineItems[0]?.title ?? "Order";
  if (order.lineItems.length <= 1) {
    return `${formatOrderDate(order.processedAt)} · ${itemCount} item`;
  }
  return `${formatOrderDate(order.processedAt)} · ${primary} +${order.lineItems.length - 1} more`;
}

function OrderStatusBadge({
  order,
  cancelled,
  statusLabel,
}: {
  order: OrderDetail;
  cancelled: boolean;
  statusLabel: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 0.5,
      }}
    >
      <Box
        sx={{
          ...catalogProductCardBadgeSx,
          bgcolor: cancelled ? "rgba(75,74,74,0.14)" : TAN,
          color: cancelled ? MUTED : PAGE_BG,
          border: cancelled ? `1px solid rgba(75,74,74,0.18)` : "none",
          maxWidth: "72%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {statusLabel}
      </Box>
      <Typography
        sx={{
          fontFamily: FONT_NAV,
          fontWeight: 500,
          fontSize: { xs: 9, sm: 10, md: 12 },
          color: MUTED,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          flexShrink: 0,
        }}
      >
        #{order.orderNumber}
      </Typography>
    </Box>
  );
}

function OrderCardImage({
  heroItem,
  cancelled,
}: {
  heroItem: OrderDetail["lineItems"][0] | undefined;
  cancelled: boolean;
}) {
  return (
    <Box
      sx={{
        ...catalogProductCardImageBoxSx,
        borderRadius: shopRadius,
        bgcolor: "rgba(255,255,255,0.35)",
        width: { xs: 88, sm: "100%" },
        maxWidth: { xs: 88, sm: furnitureListingCardMetaMaxW },
        height: { xs: 88, sm: 120, md: catalogProductCardImageBoxSx.height.md },
        mx: { xs: 0, sm: "auto" },
        flexShrink: 0,
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
            opacity: cancelled ? 0.85 : 1,
          }}
        />
      ) : (
        <Typography sx={{ fontFamily: FONT_NAV, fontSize: 13, color: MUTED }}>
          Order
        </Typography>
      )}
    </Box>
  );
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
          ...catalogProductCardSurfaceSx,
          ...frostedCardSx,
          flex: 1,
          display: "flex",
          flexDirection: { xs: "row", sm: "column" },
          alignItems: { xs: "flex-start", sm: "center" },
          cursor: "pointer",
          width: "100%",
          bgcolor: PAGE_BG,
          opacity: cancelled ? 0.72 : 1,
          gap: { xs: 1.5, sm: catalogProductCardSurfaceSx.gap.sm },
          px: { xs: 1.25, sm: catalogProductCardSurfaceSx.px.sm },
          py: { xs: 1.25, sm: catalogProductCardSurfaceSx.py.sm },
          transition:
            "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s ease, border-color 0.28s ease",
          "@media (hover: hover)": {
            "&:hover": {
              transform: { xs: "none", sm: "translateY(-6px)" },
              borderColor: ACCENT,
              boxShadow: { xs: "none", sm: "0 14px 32px rgba(75, 74, 74, 0.12)" },
              "& .order-card-image": {
                transform: "scale(1.05)",
              },
              "& .order-card-title": {
                color: ACCENT,
              },
            },
          },
          "&:active": {
            transform: { xs: "scale(0.99)", sm: "translateY(-2px)" },
          },
        }}
      >
        <Box sx={{ display: { xs: "block", sm: "none" }, flexShrink: 0 }}>
          <OrderCardImage heroItem={heroItem} cancelled={cancelled} />
        </Box>

        <Stack
          sx={{
            flex: 1,
            minWidth: 0,
            width: "100%",
            gap: { xs: 0.75, sm: 1, md: 1.25 },
          }}
        >
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <OrderStatusBadge
              order={order}
              cancelled={cancelled}
              statusLabel={statusLabel}
            />
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: furnitureListingCardMetaMaxW,
            }}
          >
            <OrderStatusBadge
              order={order}
              cancelled={cancelled}
              statusLabel={statusLabel}
            />
          </Box>

          <Box sx={{ display: { xs: "none", sm: "block" }, width: "100%" }}>
            <OrderCardImage heroItem={heroItem} cancelled={cancelled} />
          </Box>

          <Stack
            sx={{
              alignItems: "flex-start",
              width: "100%",
              maxWidth: furnitureListingCardMetaMaxW,
              gap: { xs: 0.5, sm: 0.75, md: 1.25 },
            }}
          >
            <Typography
              className="order-card-title"
              sx={{
                ...catalogProductCardTitleSx,
                transition: "color 0.28s ease",
                wordBreak: "break-word",
                display: "-webkit-box",
                WebkitLineClamp: { xs: 2, sm: 3 },
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {heroItem?.title ?? `Order #${order.orderNumber}`}
            </Typography>
            <Typography sx={catalogProductCardPriceSx}>
              {formatOrderMoney(order.totalPrice.amount, order.totalPrice.currencyCode)}
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 400,
                fontSize: { xs: 10, sm: 11, md: 13 },
                lineHeight: 1.45,
                color: HELPER_TEXT,
              }}
            >
              {orderCardSubtitle(order)}
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 600,
                fontSize: { xs: 10, sm: 11 },
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: ACCENT,
                mt: { xs: 0.25, sm: 0.5 },
              }}
            >
              View details →
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

export function OrdersPage() {
  const customer = useAuthStore((s) => s.customer);
  const accessToken = useAuthStore((s) => s.accessToken);
  const loggedIn = useAuthStore(selectIsLoggedIn);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const needsReauth =
    loggedIn &&
    Boolean(accessToken) &&
    !isCustomerAccountAccessToken(accessToken!);
  const { data: orders, isLoading, isError, error, refetch, isFetching } =
    useCustomerOrders();

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: { lg: 960 },
          mx: "auto",
          pb: { xs: 2, sm: 0 },
        }}
      >
        <Stack
          gap={{ xs: 2, sm: fluid1920(40, { min: 28, max: 48 }) }}
          sx={{
            ...frostedCardSx,
            px: { xs: 2.5, sm: 3 },
            py: { xs: 2.5, sm: 3 },
          }}
        >
          <Stack gap={{ xs: "8px", sm: "6px" }}>
            <Box
              sx={{
                width: { xs: 28, sm: 32 },
                height: "2px",
                bgcolor: ACCENT,
                borderRadius: "1px",
                mb: { xs: 0.5, sm: 0 },
              }}
            />
            <Typography
              component="h1"
              sx={{
                fontFamily: FONT_SURGENA,
                fontWeight: 600,
                fontSize: { xs: 28, sm: 34, lg: fluid1920(52, { min: 32, max: 60 }) },
                color: DARK,
                lineHeight: 1.08,
                letterSpacing: "-0.01em",
              }}
            >
              {loggedIn && customer ? `Hi, ${customer.firstName}.` : "My Orders"}
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 400,
                fontSize: { xs: 13, sm: fluid1920(14, { min: 13, max: 15 }) },
                color: MUTED,
                lineHeight: 1.6,
                maxWidth: { xs: 320, sm: "none" },
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
              ...frostedCardSx,
              bgcolor: PAGE_BG,
              p: { xs: 2, sm: fluid1920(40, { min: 28, max: 48 }) },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { sm: "center" },
              gap: { xs: 2, sm: fluid1920(24, { min: 16, max: 28 }) },
              justifyContent: "space-between",
            }}
          >
            <Stack gap="6px">
              <Typography
                sx={{
                  fontFamily: FONT_SURGENA,
                  fontWeight: 600,
                  fontSize: { xs: 18, sm: fluid1920(22, { min: 17, max: 24 }) },
                  color: DARK,
                }}
              >
                Sign in to see your orders
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 400,
                  fontSize: { xs: 12, sm: fluid1920(13, { min: 12, max: 14 }) },
                  color: HELPER_TEXT,
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
                ...primaryBtnSx,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Sign In
            </ButtonBase>
          </Box>
        )}

        {loggedIn && needsReauth && (
          <Box
            sx={{
              ...frostedCardSx,
              bgcolor: "rgba(188,126,90,0.08)",
              border: `1px solid rgba(188,126,90,0.25)`,
              p: { xs: 2, sm: fluid1920(24, { min: 18, max: 28 }) },
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontSize: { xs: 13, sm: fluid1920(14, { min: 13, max: 15 }) },
                color: DARK,
                mb: 2,
                lineHeight: 1.6,
              }}
            >
              Your session needs to be refreshed. Sign out, then sign in again to
              load orders and tracking.
            </Typography>
            <ButtonBase
              component={RouterLink}
              to="/login?next=%2Forders"
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 600,
                fontSize: { xs: 11, sm: fluid1920(12, { min: 11, max: 13 }) },
                color: ACCENT,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Sign in again
            </ButtonBase>
          </Box>
        )}

        {loggedIn && !needsReauth && (
          <Stack gap={{ xs: 1.5, sm: fluid1920(16, { min: 12, max: 20 }) }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={1}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography
                  sx={{
                    fontFamily: FONT_SURGENA,
                    fontWeight: 600,
                    fontSize: { xs: 18, sm: fluid1920(24, { min: 18, max: 26 }) },
                    color: DARK,
                  }}
                >
                  Your orders
                </Typography>
                {!isLoading && orders && orders.length > 0 ? (
                  <Box
                    sx={{
                      fontFamily: FONT_NAV,
                      fontWeight: 600,
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: PAGE_BG,
                      bgcolor: TAN,
                      px: 1,
                      py: 0.35,
                      borderRadius: shopRadius,
                      lineHeight: 1.2,
                    }}
                  >
                    {orders.length}
                  </Box>
                ) : null}
              </Stack>
              <ButtonBase
                type="button"
                onClick={() => void refetch()}
                disabled={isFetching}
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 600,
                  fontSize: { xs: 10, sm: fluid1920(12, { min: 11, max: 13 }) },
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: ACCENT,
                  opacity: isFetching ? 0.5 : 1,
                  flexShrink: 0,
                }}
              >
                {isFetching ? "Refreshing…" : "Refresh"}
              </ButtonBase>
            </Stack>

            {isLoading ? (
              <Stack alignItems="center" py={{ xs: 4, sm: 6 }}>
                <CircularProgress sx={{ color: ACCENT }} size={32} />
              </Stack>
            ) : isError ? (
              <Box
                sx={{
                  ...frostedCardSx,
                  bgcolor: "rgba(188,126,90,0.08)",
                  border: `1px solid rgba(188,126,90,0.25)`,
                  p: { xs: 2, sm: fluid1920(24, { min: 18, max: 28 }) },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontSize: { xs: 13, sm: fluid1920(14, { min: 13, max: 15 }) },
                    color: DARK,
                    mb: 2,
                    lineHeight: 1.6,
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
                    fontSize: { xs: 11, sm: fluid1920(12, { min: 11, max: 13 }) },
                    color: ACCENT,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  Try again
                </ButtonBase>
              </Box>
            ) : orders && orders.length > 0 ? (
              <Box sx={{ ...ordersGridSx, width: "100%" }}>
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
                  ...frostedCardSx,
                  bgcolor: PAGE_BG,
                  p: { xs: 2.5, sm: fluid1920(36, { min: 24, max: 42 }) },
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT_SURGENA,
                    fontWeight: 600,
                    fontSize: { xs: 17, sm: fluid1920(20, { min: 16, max: 22 }) },
                    color: DARK,
                    mb: 1,
                  }}
                >
                  No orders yet
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontSize: { xs: 12, sm: fluid1920(14, { min: 13, max: 15 }) },
                    color: HELPER_TEXT,
                    mb: 3,
                    lineHeight: 1.6,
                  }}
                >
                  When you place an order, it will show up here with live tracking.
                </Typography>
                <ButtonBase
                  component={RouterLink}
                  to="/"
                  sx={{
                    ...primaryBtnSx,
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Start shopping
                </ButtonBase>
              </Box>
            )}
          </Stack>
        )}
        </Stack>
      </Box>

      <OrderDetailModal
        open={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        contactEmail={customer?.email}
      />
    </>
  );
}
