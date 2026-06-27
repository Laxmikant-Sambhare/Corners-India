import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import {
  productDetailModalCloseIconSize,
  productDetailModalCloseOffset,
  productDetailModalColGap,
  productDetailModalCopyColMaxW,
  productDetailModalMaxW,
  productDetailModalMediaColMaxW,
  productDetailModalPad,
  productDetailModalPadTop,
  productDetailModalRadius,
  productDetailModalSectionGap,
} from "../navDesignTokens";
import type { OrderDetail } from "../shopify/customerAccountAuth";

const PAGE_BG = "#f3ede3";
const ACCENT = "#bc7e5a";
const TAN = "#ccbca6";
const DARK = "#1a1814";
const MUTED = "#4b4a4a";
const BORDER = "rgba(204,188,166,0.45)";

export function formatOrderMoney(amount: string, currencyCode: string): string {
  const n = parseFloat(amount);
  if (!Number.isFinite(n)) return amount;
  if (currencyCode === "INR") {
    return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${currencyCode} ${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function fulfillmentLabel(status: string): string {
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

export function financialLabel(status: string): string {
  const labels: Record<string, string> = {
    PAID: "Paid",
    PENDING: "Payment pending",
    REFUNDED: "Refunded",
    PARTIALLY_REFUNDED: "Partially refunded",
    VOIDED: "Canceled",
  };
  return labels[status] ?? status.replace(/_/g, " ").toLowerCase();
}

function fulfillmentStatusMessage(status: string): string {
  const messages: Record<string, string> = {
    UNFULFILLED: "Confirmed — we're preparing your items for shipping.",
    IN_PROGRESS: "Confirmed — we're preparing your items for shipping.",
    PARTIALLY_FULFILLED: "Part of your order has shipped.",
    FULFILLED: "Your order has shipped.",
    RESTOCKED: "This order was restocked.",
    SCHEDULED: "Your order is scheduled.",
    ON_HOLD: "Your order is on hold.",
  };
  return messages[status] ?? "Your order is being processed.";
}

function formatAddress(
  address: NonNullable<OrderDetail["shippingAddress"]>,
): string {
  const lines = [
    `${address.firstName} ${address.lastName}`.trim(),
    address.address1,
    address.address2,
    [address.city, address.province, address.zip].filter(Boolean).join(", "),
    address.country,
  ].filter(Boolean);
  return lines.join("\n");
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography
      sx={{
        fontFamily: FONT_NAV,
        fontWeight: 600,
        fontSize: 11,
        color: MUTED,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      {children}
    </Typography>
  );
}

function PriceRow({
  label,
  amount,
  currencyCode,
  bold,
}: {
  label: string;
  amount: string;
  currencyCode: string;
  bold?: boolean;
}) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography
        sx={{
          fontFamily: FONT_NAV,
          fontWeight: bold ? 600 : 400,
          fontSize: bold ? 15 : 14,
          color: bold ? DARK : MUTED,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: FONT_NAV,
          fontWeight: bold ? 600 : 400,
          fontSize: bold ? 15 : 14,
          color: DARK,
        }}
      >
        {formatOrderMoney(amount, currencyCode)}
      </Typography>
    </Stack>
  );
}

function CloseIcon() {
  return (
    <Box component="svg" viewBox="0 0 24 24" fill="none" aria-hidden sx={{ width: productDetailModalCloseIconSize, height: productDetailModalCloseIconSize }}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Box>
  );
}

type OrderDetailModalProps = {
  open: boolean;
  onClose: () => void;
  order: OrderDetail | null;
  contactEmail?: string;
};

export function OrderDetailModal({
  open,
  onClose,
  order,
  contactEmail,
}: OrderDetailModalProps) {
  if (!order) return null;

  const heroItem = order.lineItems[0];
  const trackingEntries = order.fulfillments
    .flatMap((f) => f.tracking)
    .filter((t) => t.number || t.url);
  const itemCount = order.lineItems.reduce((sum, li) => sum + li.quantity, 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          bgcolor: PAGE_BG,
          borderRadius: productDetailModalRadius,
          width: "100%",
          maxWidth: productDetailModalMaxW,
          m: { xs: 1, sm: 2 },
          position: "relative",
          overflow: "hidden",
          overflowY: "auto",
        },
      }}
    >
      <IconButton
        type="button"
        onClick={onClose}
        aria-label="Close order details"
        sx={{
          position: "absolute",
          right: productDetailModalCloseOffset,
          top: productDetailModalCloseOffset,
          zIndex: 2,
          color: MUTED,
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box
        sx={{
          p: productDetailModalPad,
          pt: productDetailModalPadTop,
          pb: { xs: productDetailModalPad, md: productDetailModalPad },
          boxSizing: "border-box",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{ gap: productDetailModalColGap, alignItems: { md: "flex-start" } }}
        >
          <Box
            sx={{
              flexShrink: 0,
              width: "100%",
              maxWidth: { md: productDetailModalMediaColMaxW },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                borderRadius: productDetailModalRadius,
                overflow: "hidden",
                bgcolor: "rgba(255,255,255,0.45)",
                border: `1px solid ${BORDER}`,
                minHeight: 280,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
              }}
            >
              {heroItem?.imageUrl ? (
                <Box
                  component="img"
                  src={heroItem.imageUrl}
                  alt={heroItem.imageAlt ?? heroItem.title}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: 360,
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              ) : (
                <Typography sx={{ fontFamily: FONT_NAV, color: MUTED }}>
                  No image
                </Typography>
              )}
            </Box>

            {order.lineItems.length > 1 ? (
              <Stack
                direction="row"
                gap={1.5}
                sx={{ mt: 2, flexWrap: "wrap" }}
              >
                {order.lineItems.slice(0, 4).map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: `1px solid ${BORDER}`,
                      bgcolor: "rgba(255,255,255,0.45)",
                      flexShrink: 0,
                    }}
                  >
                    {item.imageUrl ? (
                      <Box
                        component="img"
                        src={item.imageUrl}
                        alt=""
                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : null}
                  </Box>
                ))}
                {order.lineItems.length > 4 ? (
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "10px",
                      border: `1px solid ${BORDER}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: FONT_NAV,
                      fontSize: 13,
                      color: MUTED,
                    }}
                  >
                    +{order.lineItems.length - 4}
                  </Box>
                ) : null}
              </Stack>
            ) : null}
          </Box>

          <Stack
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: { md: productDetailModalCopyColMaxW },
              gap: productDetailModalSectionGap,
            }}
          >
            <Stack gap={1}>
              <Typography
                sx={{
                  fontFamily: FONT_SURGENA,
                  fontWeight: 600,
                  fontSize: { xs: 28, md: 34 },
                  color: DARK,
                  lineHeight: 1.05,
                }}
              >
                Order #{order.orderNumber}
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 400,
                  fontSize: 14,
                  color: MUTED,
                }}
              >
                Placed {formatOrderDate(order.processedAt)} · {itemCount}{" "}
                {itemCount === 1 ? "item" : "items"}
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                <Box
                  sx={{
                    bgcolor: TAN,
                    color: PAGE_BG,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: "999px",
                    fontFamily: FONT_NAV,
                    fontWeight: 600,
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  {financialLabel(order.financialStatus)}
                </Box>
                <Box
                  sx={{
                    bgcolor: "rgba(75,74,74,0.08)",
                    color: MUTED,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: "999px",
                    fontFamily: FONT_NAV,
                    fontWeight: 600,
                    fontSize: 12,
                    textTransform: "uppercase",
                    border: `1px solid rgba(75,74,74,0.12)`,
                  }}
                >
                  {fulfillmentLabel(order.fulfillmentStatus)}
                </Box>
              </Stack>
            </Stack>

            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                alignItems: "flex-start",
                bgcolor: "rgba(255,255,255,0.45)",
                border: `1px solid ${BORDER}`,
                borderRadius: "12px",
                p: 2,
              }}
            >
              <Box
                component="span"
                aria-hidden
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  bgcolor: "rgba(188,126,90,0.16)",
                  color: ACCENT,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                ✓
              </Box>
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 500,
                  fontSize: 14,
                  color: DARK,
                  lineHeight: 1.55,
                }}
              >
                {fulfillmentStatusMessage(order.fulfillmentStatus)}
              </Typography>
            </Box>

            <Stack gap={1.25}>
              <SectionLabel>Items</SectionLabel>
              {order.lineItems.map((item) => (
                <Stack
                  key={item.id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  gap={2}
                  sx={{
                    py: 1.25,
                    borderBottom: `1px solid ${BORDER}`,
                    "&:last-child": { borderBottom: "none", pb: 0 },
                  }}
                >
                  <Stack gap={0.25} sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: FONT_NAV,
                        fontWeight: 600,
                        fontSize: 14,
                        color: DARK,
                      }}
                    >
                      {item.title}
                      {item.variantTitle ? ` · ${item.variantTitle}` : ""}
                    </Typography>
                    <Typography
                      sx={{ fontFamily: FONT_NAV, fontSize: 13, color: MUTED }}
                    >
                      Qty {item.quantity}
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{
                      fontFamily: FONT_NAV,
                      fontWeight: 500,
                      fontSize: 14,
                      color: ACCENT,
                      flexShrink: 0,
                    }}
                  >
                    {formatOrderMoney(item.price.amount, item.price.currencyCode)}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Stack gap={1}>
              <SectionLabel>Order summary</SectionLabel>
              {order.subtotalPrice ? (
                <PriceRow
                  label="Subtotal"
                  amount={order.subtotalPrice.amount}
                  currencyCode={order.subtotalPrice.currencyCode}
                />
              ) : null}
              {order.totalShippingPrice ? (
                <PriceRow
                  label="Shipping"
                  amount={order.totalShippingPrice.amount}
                  currencyCode={order.totalShippingPrice.currencyCode}
                />
              ) : null}
              {order.totalTaxPrice ? (
                <PriceRow
                  label="Taxes"
                  amount={order.totalTaxPrice.amount}
                  currencyCode={order.totalTaxPrice.currencyCode}
                />
              ) : null}
              <PriceRow
                label="Total"
                amount={order.totalPrice.amount}
                currencyCode={order.totalPrice.currencyCode}
                bold
              />
            </Stack>

            <Stack gap={1}>
              <SectionLabel>Tracking</SectionLabel>
              {trackingEntries.length > 0 ? (
                trackingEntries.map((track, i) => (
                  <Stack
                    key={`${track.number ?? "track"}-${i}`}
                    direction="row"
                    gap={1}
                    flexWrap="wrap"
                    alignItems="center"
                  >
                    {track.company ? (
                      <Typography sx={{ fontFamily: FONT_NAV, fontSize: 14, color: MUTED }}>
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
                          fontSize: 14,
                          color: ACCENT,
                          textDecoration: "none",
                          "&:hover": { opacity: 0.8 },
                        }}
                      >
                        {track.number ?? "Track shipment"} ↗
                      </Box>
                    ) : track.number ? (
                      <Typography sx={{ fontFamily: FONT_NAV, fontSize: 14, color: DARK }}>
                        {track.number}
                      </Typography>
                    ) : null}
                  </Stack>
                ))
              ) : (
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontSize: 14,
                    color: MUTED,
                    lineHeight: 1.55,
                  }}
                >
                  Tracking will appear here once your order ships.
                </Typography>
              )}
            </Stack>

            {(contactEmail || order.shippingAddress) && (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                gap={2.5}
                sx={{ pt: 0.5 }}
              >
                {contactEmail ? (
                  <Stack gap={0.75} sx={{ flex: 1 }}>
                    <SectionLabel>Contact</SectionLabel>
                    <Typography sx={{ fontFamily: FONT_NAV, fontSize: 14, color: DARK }}>
                      {contactEmail}
                    </Typography>
                  </Stack>
                ) : null}
                {order.shippingAddress ? (
                  <Stack gap={0.75} sx={{ flex: 1 }}>
                    <SectionLabel>Ship to</SectionLabel>
                    <Typography
                      sx={{
                        fontFamily: FONT_NAV,
                        fontSize: 14,
                        color: DARK,
                        lineHeight: 1.6,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {formatAddress(order.shippingAddress)}
                    </Typography>
                  </Stack>
                ) : null}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
}
