import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "@tanstack/react-router";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import { fluid1920 } from "../navDesignTokens";
import type { OrderDetail } from "../shopify/customerAccountAuth";
import { useCustomerOrders } from "../shopify/hooks";
import { useAuthStore } from "../store/authStore";

const ACCENT = "#bc7e5a";
const PAGE_BG = "#f3ede3";
const DARK = "#1a1814";
const MUTED = "#4b4a4a";
const BORDER = "rgba(204,188,166,0.45)";
const CARD_BG = "rgba(204,188,166,0.13)";

function formatOrderMoney(amount: string, currencyCode: string): string {
  const n = parseFloat(amount);
  if (!Number.isFinite(n)) return amount;
  if (currencyCode === "INR") {
    return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${currencyCode} ${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fulfillmentLabel(status: string): string {
  const labels: Record<string, string> = {
    UNFULFILLED: "Processing",
    FULFILLED: "Shipped",
    IN_TRANSIT: "In transit",
    DELIVERED: "Delivered",
    OUT_FOR_DELIVERY: "Out for delivery",
    ATTEMPTED_DELIVERY: "Delivery attempted",
  };
  return labels[status] ?? status.replace(/_/g, " ").toLowerCase();
}

function financialLabel(status: string): string {
  const labels: Record<string, string> = {
    PAID: "Paid",
    PENDING: "Payment pending",
    REFUNDED: "Refunded",
    PARTIALLY_REFUNDED: "Partially refunded",
    VOIDED: "Canceled",
  };
  return labels[status] ?? status.replace(/_/g, " ").toLowerCase();
}

function StatusBadge({ label, tone }: { label: string; tone: "accent" | "muted" }) {
  return (
    <Typography
      component="span"
      sx={{
        display: "inline-block",
        fontFamily: FONT_NAV,
        fontWeight: 600,
        fontSize: fluid1920(10, { min: 9, max: 11 }),
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        px: "10px",
        py: "4px",
        borderRadius: "999px",
        bgcolor: tone === "accent" ? "rgba(188,126,90,0.14)" : "rgba(75,74,74,0.08)",
        color: tone === "accent" ? ACCENT : MUTED,
        border: `1px solid ${tone === "accent" ? "rgba(188,126,90,0.28)" : "rgba(75,74,74,0.12)"}`,
      }}
    >
      {label}
    </Typography>
  );
}

function OrderCard({ order }: { order: OrderDetail }) {
  const primaryFulfillment = order.fulfillments[0];
  const trackingEntries = order.fulfillments.flatMap((f) => f.tracking).filter(
    (t) => t.number || t.url,
  );

  return (
    <Box
      sx={{
        bgcolor: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: "20px",
        p: fluid1920(28, { min: 20, max: 32 }),
        display: "flex",
        flexDirection: "column",
        gap: fluid1920(18, { min: 14, max: 22 }),
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={1.5}
      >
        <Stack gap="4px">
          <Typography
            sx={{
              fontFamily: FONT_SURGENA,
              fontWeight: 600,
              fontSize: fluid1920(20, { min: 16, max: 22 }),
              color: DARK,
            }}
          >
            Order #{order.orderNumber}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 400,
              fontSize: fluid1920(13, { min: 12, max: 14 }),
              color: MUTED,
            }}
          >
            Placed {formatOrderDate(order.processedAt)}
          </Typography>
        </Stack>
        <Stack direction="row" gap={1} flexWrap="wrap">
          <StatusBadge label={financialLabel(order.financialStatus)} tone="accent" />
          {primaryFulfillment ? (
            <StatusBadge
              label={fulfillmentLabel(primaryFulfillment.status)}
              tone="muted"
            />
          ) : (
            <StatusBadge label="Processing" tone="muted" />
          )}
        </Stack>
      </Stack>

      <Stack gap={fluid1920(12, { min: 10, max: 14 })}>
        {order.lineItems.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            gap={fluid1920(14, { min: 10, max: 16 })}
            alignItems="center"
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "10px",
                overflow: "hidden",
                bgcolor: "rgba(255,255,255,0.5)",
                border: `1px solid ${BORDER}`,
                flexShrink: 0,
              }}
            >
              {item.imageUrl ? (
                <Box
                  component="img"
                  src={item.imageUrl}
                  alt={item.imageAlt ?? item.title}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : null}
            </Box>
            <Stack gap="2px" sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 600,
                  fontSize: fluid1920(14, { min: 13, max: 15 }),
                  color: DARK,
                }}
              >
                {item.title}
                {item.variantTitle ? ` · ${item.variantTitle}` : ""}
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 400,
                  fontSize: fluid1920(12, { min: 11, max: 13 }),
                  color: MUTED,
                }}
              >
                Qty {item.quantity} ·{" "}
                {formatOrderMoney(item.price.amount, item.price.currencyCode)}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>

      {trackingEntries.length > 0 ? (
        <Stack
          gap={fluid1920(8, { min: 6, max: 10 })}
          sx={{
            pt: fluid1920(4, { min: 2, max: 6 }),
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: fluid1920(11, { min: 10, max: 12 }),
              color: MUTED,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            Tracking
          </Typography>
          {trackingEntries.map((track, i) => (
            <Stack key={`${track.number ?? "track"}-${i}`} direction="row" gap={1} flexWrap="wrap">
              {track.company ? (
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontSize: fluid1920(13, { min: 12, max: 14 }),
                    color: MUTED,
                  }}
                >
                  {track.company}
                </Typography>
              ) : null}
              {track.url ? (
                <Box
                  component="a"
                  href={track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 600,
                    fontSize: fluid1920(13, { min: 12, max: 14 }),
                    color: ACCENT,
                    textDecoration: "none",
                    "&:hover": { opacity: 0.8 },
                  }}
                >
                  {track.number ?? "Track shipment"} ↗
                </Box>
              ) : track.number ? (
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontSize: fluid1920(13, { min: 12, max: 14 }),
                    color: DARK,
                  }}
                >
                  {track.number}
                </Typography>
              ) : null}
            </Stack>
          ))}
        </Stack>
      ) : null}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={1.5}
        sx={{ borderTop: `1px solid ${BORDER}`, pt: fluid1920(14, { min: 10, max: 16 }) }}
      >
        <Typography
          sx={{
            fontFamily: FONT_SURGENA,
            fontWeight: 600,
            fontSize: fluid1920(18, { min: 15, max: 20 }),
            color: DARK,
          }}
        >
          Total{" "}
          {formatOrderMoney(order.totalPrice.amount, order.totalPrice.currencyCode)}
        </Typography>
        <Box
          component="a"
          href={order.statusUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
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
          Full order details ↗
        </Box>
      </Stack>
    </Box>
  );
}

export function OrdersPage() {
  const customer = useAuthStore((s) => s.customer);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const loggedIn = isLoggedIn();
  const { data: orders, isLoading, isError, error, refetch, isFetching } =
    useCustomerOrders();

  return (
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
            ? "Your order history and live tracking, updated from Shopify."
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

      {loggedIn && (
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
            orders.map((order) => <OrderCard key={order.id} order={order} />)
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
  );
}
