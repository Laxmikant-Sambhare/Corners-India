import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import { Link as RouterLink } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { toProductSlug } from "../catalog/catalogPageConfig";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import {
  fluid1920,
  megaRadius,
  navFontSize,
  navMegaMenuMarginTop,
} from "../navDesignTokens";
import { useWishlistStore, wishlistTotalItems } from "../store/wishlistStore";
import { formatPriceShort } from "./productDetailUtils";

const PAGE_BG = "#f3ede3";
const ACCENT = "#bc7e5a";
const TAN = "#ccbca6";
const MUTED = "#4b4a4a";
const BORDER = "rgba(204,188,166,0.45)";

const panelMaxW = fluid1920(420, { min: 300, max: 440 });
const panelPadX = fluid1920(28, { min: 18, max: 32 });
const panelPadY = fluid1920(24, { min: 16, max: 28 });
const itemGap = fluid1920(16, { min: 12, max: 18 });
const thumbSize = fluid1920(72, { min: 60, max: 80 });
const thumbRadius = fluid1920(10, { min: 7, max: 12 });

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

export function WishlistDropdown({ sx, onClose }: Props) {
  const items = useWishlistStore((s) => s.items);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const reduceMotion = useReducedMotion();
  const { container, item } = buildVariants(reduceMotion);
  const totalItems = wishlistTotalItems(items);

  return (
    <Box
      id="wishlist-dropdown"
      role="dialog"
      aria-label="Saved products"
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
          width: panelMaxW,
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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: panelPadX, pt: panelPadY, pb: itemGap }}
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
            Saved
          </Typography>
          {totalItems > 0 && (
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 500,
                fontSize: navFontSize,
                color: TAN,
              }}
            >
              ({totalItems})
            </Typography>
          )}
        </Stack>

        {items.length > 0 && (
          <ButtonBase
            type="button"
            onClick={clearWishlist}
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

      <Divider sx={{ borderColor: BORDER, mx: panelPadX }} />

      {items.length === 0 ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ px: panelPadX, py: fluid1920(48, { min: 32, max: 56 }) }}
          component={motion.div}
          variants={item}
        >
          <EmptyHeartIcon />
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
            No saved products yet
          </Typography>
        </Stack>
      ) : (
        <Stack
          component="ul"
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
            px: panelPadX,
            pt: itemGap,
            pb: panelPadY,
            maxHeight: "min(60vh, 380px)",
            overflowY: "auto",
            gap: itemGap,
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: TAN,
              borderRadius: "4px",
            },
          }}
        >
          {items.map((wishlistItem) => (
            <Box
              key={wishlistItem.id}
              component={motion.li}
              variants={item}
              sx={{
                display: "flex",
                gap: fluid1920(14, { min: 10, max: 16 }),
                alignItems: "flex-start",
                pb: itemGap,
                borderBottom: `1px solid ${BORDER}`,
                "&:last-child": { borderBottom: "none", pb: 0 },
              }}
            >
              <ButtonBase
                component={RouterLink}
                to={`/product/${toProductSlug(wishlistItem.product.name)}`}
                onClick={onClose}
                sx={{
                  width: thumbSize,
                  height: thumbSize,
                  flexShrink: 0,
                  borderRadius: thumbRadius,
                  overflow: "hidden",
                  bgcolor: "#e8dfd4",
                }}
              >
                <Box
                  component="img"
                  src={wishlistItem.product.image}
                  alt={wishlistItem.product.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </ButtonBase>

              <Stack sx={{ flex: 1, minWidth: 0, gap: "4px" }}>
                <ButtonBase
                  component={RouterLink}
                  to={`/product/${toProductSlug(wishlistItem.product.name)}`}
                  onClick={onClose}
                  sx={{
                    textAlign: "left",
                    alignSelf: "flex-start",
                    maxWidth: "100%",
                  }}
                >
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
                      "&:hover": { color: ACCENT },
                    }}
                  >
                    {wishlistItem.product.name}
                  </Typography>
                </ButtonBase>
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 500,
                    fontSize: fluid1920(12, { min: 11, max: 13 }),
                    color: TAN,
                    lineHeight: 1.3,
                    textTransform: "uppercase",
                  }}
                >
                  {wishlistItem.product.badge}
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
                  {formatPriceShort(wishlistItem.product.price)}
                </Typography>
              </Stack>

              <IconButton
                size="small"
                aria-label={`Remove ${wishlistItem.product.name} from saved`}
                onClick={() => removeFromWishlist(wishlistItem.id)}
                sx={{
                  color: TAN,
                  p: "4px",
                  flexShrink: 0,
                  "&:hover": { color: ACCENT },
                }}
              >
                <HeartRemoveIcon />
              </IconButton>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}

function EmptyHeartIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 22.3996 19.5999"
      aria-hidden
      sx={{ width: 40, height: "auto", display: "block", color: TAN }}
    >
      <path
        d="M22.203 5.00551C21.4625 1.89282 19.1737 0.0300426 16.0101 0.00191468C14.4978 -0.011555 13.1652 0.547438 11.9045 1.33066C11.6595 1.48319 11.4223 1.64878 11.1914 1.8017C10.9085 1.61313 10.6591 1.43802 10.4016 1.27678C8.66857 0.194056 6.82477 -0.292042 4.78997 0.180586C1.36655 0.975695 0.035458 4.02381 0.00101632 6.4333C-0.041253 9.37683 1.23779 11.8125 3.31329 13.7909C5.68546 16.0519 8.41144 17.8433 11.1934 19.5999C13.5049 18.1591 15.7205 16.6326 17.8128 14.9236C19.1979 13.7921 20.4331 12.5339 21.2527 10.912C22.194 9.0488 22.7051 7.11629 22.203 5.00551ZM19.4218 10.6774C18.6617 11.9583 17.5725 12.919 16.4367 13.8381C15.3049 14.7536 14.1303 15.6093 12.9296 16.429C12.3691 16.8117 11.8 17.1821 11.2047 17.5779C10.9202 17.3929 10.6368 17.2118 10.3566 17.0264C8.39148 15.7246 6.46783 14.3646 4.71561 12.7752C3.15595 11.36 2.13562 9.6276 1.75558 7.52237C1.37125 5.39415 2.4405 3.03577 4.2299 2.19114C5.60522 1.54182 7.00324 1.55846 8.40009 2.15826C9.31279 2.55007 10.1206 3.10272 10.8666 3.756C10.9633 3.84078 11.0619 3.92358 11.182 4.02619C11.6184 3.68073 12.0172 3.33527 12.4454 3.03181C13.4838 2.29731 14.6094 1.71772 15.8978 1.71613C18.6707 1.71217 20.2566 3.3119 20.6519 5.98444C20.9059 7.70183 20.2793 9.23302 19.4222 10.6778L19.4218 10.6774Z"
        fill="currentColor"
      />
    </Box>
  );
}

function HeartRemoveIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 22.3996 19.5999"
      aria-hidden
      sx={{ width: 18, height: "auto", display: "block" }}
    >
      <path
        d="M22.203 5.00551C21.4625 1.89282 19.1737 0.0300426 16.0101 0.00191468C14.4978 -0.011555 13.1652 0.547438 11.9045 1.33066C11.6595 1.48319 11.4223 1.64878 11.1914 1.8017C10.9085 1.61313 10.6591 1.43802 10.4016 1.27678C8.66857 0.194056 6.82477 -0.292042 4.78997 0.180586C1.36655 0.975695 0.035458 4.02381 0.00101632 6.4333C-0.041253 9.37683 1.23779 11.8125 3.31329 13.7909C5.68546 16.0519 8.41144 17.8433 11.1934 19.5999C13.5049 18.1591 15.7205 16.6326 17.8128 14.9236C19.1979 13.7921 20.4331 12.5339 21.2527 10.912C22.194 9.0488 22.7051 7.11629 22.203 5.00551ZM19.4218 10.6774C18.6617 11.9583 17.5725 12.919 16.4367 13.8381C15.3049 14.7536 14.1303 15.6093 12.9296 16.429C12.3691 16.8117 11.8 17.1821 11.2047 17.5779C10.9202 17.3929 10.6368 17.2118 10.3566 17.0264C8.39148 15.7246 6.46783 14.3646 4.71561 12.7752C3.15595 11.36 2.13562 9.6276 1.75558 7.52237C1.37125 5.39415 2.4405 3.03577 4.2299 2.19114C5.60522 1.54182 7.00324 1.55846 8.40009 2.15826C9.31279 2.55007 10.1206 3.10272 10.8666 3.756C10.9633 3.84078 11.0619 3.92358 11.182 4.02619C11.6184 3.68073 12.0172 3.33527 12.4454 3.03181C13.4838 2.29731 14.6094 1.71772 15.8978 1.71613C18.6707 1.71217 20.2566 3.3119 20.6519 5.98444C20.9059 7.70183 20.2793 9.23302 19.4222 10.6778L19.4218 10.6774Z"
        fill="currentColor"
      />
    </Box>
  );
}
