import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import { Link as RouterLink } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import { fluid1920, megaRadius, navFontSize, navMegaMenuMarginTop } from "../navDesignTokens";
import { cartTotalItems, useCartStore } from "../store/cartStore";
import { formatPriceShort, parsePriceValue } from "./productDetailUtils";

const PAGE_BG = "#f3ede3";
const ACCENT = "#bc7e5a";
const TAN = "#ccbca6";
const MUTED = "#4b4a4a";
const BORDER = "rgba(204,188,166,0.45)";

const cartMaxW = fluid1920(420, { min: 300, max: 440 });
const cartPadX = fluid1920(28, { min: 18, max: 32 });
const cartPadY = fluid1920(24, { min: 16, max: 28 });
const cartItemGap = fluid1920(16, { min: 12, max: 18 });
const cartThumbSize = fluid1920(72, { min: 60, max: 80 });
const cartThumbRadius = fluid1920(10, { min: 7, max: 12 });

const easeOut = [0.32, 0.72, 0, 1] as const;

function buildVariants(reduceMotion: boolean | null) {
  const none = reduceMotion === true;
  return {
    container: {
      hidden: { opacity: 0, y: none ? 0 : -18 },
      visible: {
        opacity: 1,
        y: 0,
        transition: none
          ? { duration: 0 }
          : {
              y: { type: "spring" as const, stiffness: 420, damping: 34 },
              opacity: { duration: 0.22 },
              staggerChildren: 0.04,
              delayChildren: 0.04,
              when: "beforeChildren" as const,
            },
      },
      exit: {
        opacity: 0,
        y: none ? 0 : -10,
        transition: none ? { duration: 0 } : { duration: 0.18, ease: easeOut },
      },
    },
    item: {
      hidden: { opacity: 0, y: none ? 0 : -8 },
      visible: {
        opacity: 1,
        y: 0,
        transition: none ? { duration: 0 } : { duration: 0.2, ease: easeOut },
      },
    },
  };
}

type Props = {
  sx?: SxProps<Theme>;
  onClose: () => void;
};

/** Cart slide-down dropdown — mirrors ShopMegaMenu animation style. */
export function CartDropdown({ sx, onClose }: Props) {
  const items = useCartStore((s) => s.items);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const reduceMotion = useReducedMotion();
  const { container, item } = buildVariants(reduceMotion);

  const totalUnits = cartTotalItems(items);
  const subtotal = items.reduce(
    (sum, i) => sum + parsePriceValue(i.product.price) * i.quantity,
    0,
  );

  return (
    <Box
      id="cart-dropdown"
      role="dialog"
      aria-label="Shopping cart"
      component={motion.div}
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
      sx={[
        {
          position: "absolute",
          right: 0,
          top: "100%",
          mt: navMegaMenuMarginTop,
          width: cartMaxW,
          maxWidth: "calc(100vw - 32px)",
          bgcolor: PAGE_BG,
          borderRadius: megaRadius,
          boxShadow: "0 24px 56px rgba(0,0,0,0.1)",
          zIndex: 20,
          overflow: "hidden",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: cartPadX, pt: cartPadY, pb: cartItemGap }}
      >
        <Stack direction="row" alignItems="baseline" gap="6px">
          <Typography
            sx={{
              fontFamily: FONT_SURGENA,
              fontWeight: 600,
              fontSize: fluid1920(20, { min: 16, max: 22 }),
              lineHeight: 1.2,
              color: MUTED,
              textTransform: "uppercase",
            }}
          >
            Cart
          </Typography>
          {totalUnits > 0 && (
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 500,
                fontSize: navFontSize,
                color: TAN,
              }}
            >
              ({totalUnits})
            </Typography>
          )}
        </Stack>

        {items.length > 0 && (
          <ButtonBase
            type="button"
            onClick={clearCart}
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 500,
              fontSize: navFontSize,
              color: TAN,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              "&:hover": { color: ACCENT },
            }}
          >
            Clear all
          </ButtonBase>
        )}
      </Stack>

      <Divider sx={{ borderColor: BORDER, mx: cartPadX }} />

      {/* Item list */}
      {items.length === 0 ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ px: cartPadX, py: fluid1920(48, { min: 32, max: 56 }) }}
          component={motion.div}
          variants={item}
        >
          <EmptyBagIcon />
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 500,
              fontSize: navFontSize,
              color: TAN,
              mt: 1.5,
              textAlign: "center",
            }}
          >
            Your cart is empty
          </Typography>
        </Stack>
      ) : (
        <Stack
          component="ul"
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
            px: cartPadX,
            pt: cartItemGap,
            maxHeight: "min(60vh, 380px)",
            overflowY: "auto",
            gap: cartItemGap,
            /* thin scrollbar */
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
              component={motion.li}
              variants={item}
              sx={{
                display: "flex",
                gap: fluid1920(14, { min: 10, max: 16 }),
                alignItems: "flex-start",
                pb: cartItemGap,
                borderBottom: `1px solid ${BORDER}`,
                "&:last-child": { borderBottom: "none" },
              }}
            >
              {/* Thumbnail */}
              <Box
                component="img"
                src={cartItem.product.image}
                alt={cartItem.product.name}
                sx={{
                  width: cartThumbSize,
                  height: cartThumbSize,
                  flexShrink: 0,
                  objectFit: "cover",
                  borderRadius: cartThumbRadius,
                  bgcolor: "#e8dfd4",
                  display: "block",
                }}
              />

              {/* Details */}
              <Stack sx={{ flex: 1, minWidth: 0, gap: "4px" }}>
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 600,
                    fontSize: navFontSize,
                    color: MUTED,
                    lineHeight: 1.3,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {cartItem.product.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 500,
                    fontSize: fluid1920(12, { min: 11, max: 13 }),
                    color: TAN,
                    lineHeight: 1.3,
                  }}
                >
                  {cartItem.size}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 600,
                    fontSize: navFontSize,
                    color: ACCENT,
                    lineHeight: 1.3,
                    mt: "2px",
                  }}
                >
                  {formatPriceShort(cartItem.product.price)}
                </Typography>

                {/* Qty row */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: "4px" }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                      border: `1px solid ${BORDER}`,
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <QtyBtn
                      label="−"
                      aria="Decrease quantity"
                      disabled={cartItem.quantity <= 1}
                      onClick={() => updateQuantity(cartItem.id, -1)}
                    />
                    <Typography
                      sx={{
                        fontFamily: FONT_NAV,
                        fontWeight: 500,
                        fontSize: navFontSize,
                        color: MUTED,
                        minWidth: "28px",
                        textAlign: "center",
                        lineHeight: 1,
                      }}
                    >
                      {cartItem.quantity}
                    </Typography>
                    <QtyBtn
                      label="+"
                      aria="Increase quantity"
                      onClick={() => updateQuantity(cartItem.id, 1)}
                    />
                  </Stack>

                  <IconButton
                    size="small"
                    aria-label={`Remove ${cartItem.product.name}`}
                    onClick={() => removeFromCart(cartItem.id)}
                    sx={{
                      color: TAN,
                      p: "4px",
                      "&:hover": { color: MUTED },
                    }}
                  >
                    <TrashIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      {/* Footer — subtotal + CTA */}
      {items.length > 0 && (
        <Stack
          component={motion.div}
          variants={item}
          sx={{
            px: cartPadX,
            pt: cartItemGap,
            pb: cartPadY,
            gap: cartItemGap,
          }}
        >
          <Divider sx={{ borderColor: BORDER }} />

          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 600,
                fontSize: navFontSize,
                color: MUTED,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Subtotal
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_SURGENA,
                fontWeight: 600,
                fontSize: fluid1920(18, { min: 15, max: 20 }),
                color: MUTED,
              }}
            >
              RS {Math.round(subtotal).toLocaleString("en-IN")}
            </Typography>
          </Stack>

          <ButtonBase
            type="button"
            component={RouterLink}
            to="/checkout"
            onClick={onClose}
            sx={{
              display: "block",
              width: "100%",
              bgcolor: ACCENT,
              color: PAGE_BG,
              py: fluid1920(14, { min: 11, max: 16 }),
              borderRadius: fluid1920(12, { min: 8, max: 14 }),
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: navFontSize,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              textAlign: "center",
              "&:hover": { opacity: 0.92 },
            }}
          >
            Checkout
          </ButtonBase>
        </Stack>
      )}
    </Box>
  );
}

/* ── Small sub-components ── */

function QtyBtn({
  label,
  aria,
  disabled,
  onClick,
}: {
  label: string;
  aria: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <ButtonBase
      type="button"
      aria-label={aria}
      disabled={disabled}
      onClick={onClick}
      sx={{
        fontFamily: FONT_NAV,
        fontWeight: 500,
        fontSize: navFontSize,
        color: disabled ? TAN : MUTED,
        px: "10px",
        py: "5px",
        lineHeight: 1,
        "&:hover:not(:disabled)": { color: ACCENT },
      }}
    >
      {label}
    </ButtonBase>
  );
}

function TrashIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      sx={{ width: 15, height: 15, display: "block" }}
    >
      <path
        d="M2 4h12M5 4V2.5A.5.5 0 0 1 5.5 2h5a.5.5 0 0 1 .5.5V4M6 7v4M10 7v4M3 4l.8 9.2A.8.8 0 0 0 3.8 14h8.4a.8.8 0 0 0 .8-.8L13 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}

function EmptyBagIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      sx={{ width: 48, height: 48, display: "block", color: TAN }}
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
  );
}
