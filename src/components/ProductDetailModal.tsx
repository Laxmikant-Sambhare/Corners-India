import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "@tanstack/react-router";
import { forwardRef, useEffect, useMemo, useState, type ComponentProps, type Dispatch, type ReactNode, type Ref, type SetStateAction } from "react";
import { useCartStore } from "../store/cartStore";
import type { CatalogProduct } from "../catalog/catalogPageTypes";
import { toProductSlug } from "../catalog/catalogPageConfig";
import { ProductVariantPickers } from "./ProductVariantPickers";
import {
  formatPriceShort,
  resolveGalleryForProduct,
} from "./productDetailUtils";
import { useProductVariantSelection } from "./useProductVariantSelection";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import { layoutPaddingX } from "../layoutConstants";
import {
  furnitureCustomisationTitleSize,
  navFontSize,
  productDetailModalBlockGap,
  productDetailModalChipRadius,
  productDetailModalCloseIconSize,
  productDetailModalCloseOffset,
  productDetailModalColGap,
  productDetailModalCopyColMaxW,
  productDetailModalCtaPadX,
  productDetailModalCtaPadY,
  productDetailModalLabelGap,
  productDetailModalMainImageMaxH,
  productDetailModalMainImageMinH,
  productDetailModalMaxW,
  productDetailModalMediaColMaxW,
  productDetailModalMrpFontSize,
  productDetailModalPad,
  productDetailModalPadTop,
  productDetailModalPriceRowGap,
  productDetailModalQtyInnerGap,
  productDetailModalQtyPadX,
  productDetailModalQtyPadY,
  productDetailModalQtyRowGap,
  productDetailModalRadius,
  productDetailModalSectionGap,
  productDetailModalThumbGap,
  productDetailModalThumbH,
  productDetailModalThumbMt,
  productDetailModalThumbRowGap,
  productDetailModalThumbW,
} from "../navDesignTokens";

const PAGE_BG = "#f3ede3";
const ACCENT = "#bc7e5a";
const TAN = "#ccbca6";
const MUTED = "#4b4a4a";
const STORY_LINE_CLAMP = 3;

const MOBILE_CTA_MIN_H = 48;
const MOBILE_TOUCH_MIN = 44;

type ProductDetailModalProps = {
  open: boolean;
  onClose: () => void;
  product: CatalogProduct | null;
};

const MobileSlideUp = forwardRef(function MobileSlideUp(
  props: ComponentProps<typeof Slide>,
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function ProductDetailModal({
  open,
  onClose,
  product,
}: ProductDetailModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const addToCart = useCartStore((s) => s.addToCart);
  const clearCart = useCartStore((s) => s.clearCart);
  const {
    detail,
    sizeIndex,
    setSizeIndex,
    colorIndex,
    setColorIndex,
    quantity,
    setQuantity,
    selectedSize,
    selectedColor,
    selectedSizeInStock,
    sizeForCart,
    showSizePicker,
  } = useProductVariantSelection(open ? product : null);

  const [imageIndex, setImageIndex] = useState(0);

  const gallery = useMemo(() => {
    if (!product || !detail) return [];
    return resolveGalleryForProduct(
      product,
      detail,
      selectedSize,
      selectedColor || undefined,
    );
  }, [product, detail, selectedSize, selectedColor]);

  const productKey = open ? (product?.name ?? null) : null;
  const galleryKey = gallery.join("|");
  useEffect(() => {
    setImageIndex(0);
  }, [productKey, galleryKey]);

  if (!product || !detail) {
    return null;
  }

  const cartProduct = product;
  const productSlug = toProductSlug(product.name);

  function handleAddToCart() {
    addToCart(cartProduct, sizeForCart, quantity);
    onClose();
  }

  function handleBuyNow() {
    clearCart();
    addToCart(cartProduct, sizeForCart, quantity);
    onClose();
    void navigate({ to: "/checkout" });
  }

  function handleViewDetails() {
    onClose();
    void navigate({
      to: "/product/$slug",
      params: { slug: productSlug },
    });
  }

  const mainSrc = gallery[imageIndex] ?? gallery[0] ?? product.image;
  const thumbSlots = gallery.length ? gallery : [product.image];

  const titleFontSize = {
    xs: "clamp(22px, 6vw, 28px)",
    md: furnitureCustomisationTitleSize,
  };

  const purchaseActions = (
    <PurchaseActions
      quantity={quantity}
      setQuantity={setQuantity}
      selectedSizeInStock={selectedSizeInStock}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
      onViewDetails={handleViewDetails}
      showViewDetails={!isMobile}
      layout={isMobile ? "stacked" : "inline"}
    />
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth={false}
      fullWidth
      scroll="paper"
      TransitionComponent={isMobile ? MobileSlideUp : undefined}
      PaperProps={{
        sx: {
          bgcolor: PAGE_BG,
          borderRadius: { xs: 0, md: productDetailModalRadius },
          width: "100%",
          maxWidth: { xs: "100%", md: productDetailModalMaxW },
          m: { xs: 0, md: 2 },
          maxHeight: { xs: "100%", md: "92dvh" },
          height: { xs: "100%", md: "auto" },
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {/* Mobile sticky header */}
      {isMobile ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            px: layoutPaddingX.xs,
            py: 1.25,
            pt: "max(12px, env(safe-area-inset-top))",
            borderBottom: `1px solid rgba(204, 188, 166, 0.45)`,
            flexShrink: 0,
            bgcolor: PAGE_BG,
            zIndex: 3,
          }}
        >
          <Typography
            sx={{
              flex: 1,
              minWidth: 0,
              fontFamily: FONT_SURGENA,
              fontWeight: 600,
              fontSize: 14,
              lineHeight: 1.2,
              textTransform: "uppercase",
              color: MUTED,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {product.name}
          </Typography>
          <IconButton
            type="button"
            onClick={onClose}
            aria-label="Close"
            sx={{
              flexShrink: 0,
              width: MOBILE_TOUCH_MIN,
              height: MOBILE_TOUCH_MIN,
              bgcolor: "rgba(204, 188, 166, 0.35)",
              color: MUTED,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      ) : (
        <IconButton
          type="button"
          onClick={onClose}
          aria-label="Close"
          sx={{
            position: "absolute",
            right: productDetailModalCloseOffset,
            top: productDetailModalCloseOffset,
            zIndex: 2,
            color: MUTED,
            width: MOBILE_TOUCH_MIN,
            height: MOBILE_TOUCH_MIN,
          }}
        >
          <CloseIcon />
        </IconButton>
      )}

      {/* Scrollable body */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
      >
        <Box
          sx={{
            p: {
              xs: layoutPaddingX.xs,
              sm: layoutPaddingX.sm,
              md: productDetailModalPad,
            },
            pt: {
              xs: 2,
              md: productDetailModalPadTop,
            },
            pb: {
              xs: isMobile ? 2 : layoutPaddingX.xs,
              md: productDetailModalPad,
            },
            boxSizing: "border-box",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{
              gap: { xs: 2.5, md: productDetailModalColGap },
              alignItems: { md: "flex-start" },
            }}
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
                  bgcolor: "rgba(204, 188, 166, 0.12)",
                  minHeight: {
                    xs: "min(52vw, 280px)",
                    md: productDetailModalMainImageMinH,
                  },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="img"
                  src={mainSrc}
                  alt={product.name}
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: {
                      xs: "min(56vw, 320px)",
                      md: productDetailModalMainImageMaxH,
                    },
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: { xs: "nowrap", sm: "wrap" },
                  overflowX: { xs: "auto", sm: "visible" },
                  scrollSnapType: { xs: "x mandatory", sm: "none" },
                  WebkitOverflowScrolling: "touch",
                  gap: productDetailModalThumbGap,
                  rowGap: productDetailModalThumbRowGap,
                  mt: { xs: 1.5, md: productDetailModalThumbMt },
                  justifyContent: "flex-start",
                  pb: { xs: 0.5, sm: 0 },
                  mx: { xs: -0.5, sm: 0 },
                  px: { xs: 0.5, sm: 0 },
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {thumbSlots.map((src, i) => (
                  <ButtonBase
                    key={`${src}-${i}`}
                    type="button"
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={imageIndex === i}
                    onClick={() => setImageIndex(i)}
                    sx={{
                      width: {
                        xs: "clamp(64px, 18vw, 88px)",
                        md: productDetailModalThumbW,
                      },
                      height: {
                        xs: "clamp(64px, 18vw, 88px)",
                        md: productDetailModalThumbH,
                      },
                      minWidth: {
                        xs: "clamp(64px, 18vw, 88px)",
                        md: productDetailModalThumbW,
                      },
                      borderRadius: productDetailModalRadius,
                      overflow: "hidden",
                      flexShrink: 0,
                      scrollSnapAlign: { xs: "start", sm: "none" },
                      border:
                        imageIndex === i
                          ? `2px solid ${ACCENT}`
                          : `1px solid rgba(75, 74, 74, 0.12)`,
                      boxSizing: "border-box",
                    }}
                  >
                    <Box
                      component="img"
                      src={src}
                      alt=""
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </ButtonBase>
                ))}
              </Box>
            </Box>

            <Stack
              sx={{
                flex: 1,
                minWidth: 0,
                width: "100%",
                maxWidth: { md: productDetailModalCopyColMaxW },
                gap: { xs: 2.5, md: productDetailModalSectionGap },
                alignItems: "flex-start",
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT_SURGENA,
                  fontWeight: 600,
                  fontSize: titleFontSize,
                  lineHeight: 1.2,
                  textTransform: "uppercase",
                  color: ACCENT,
                  wordBreak: "break-word",
                  display: { xs: "none", md: "block" },
                }}
              >
                {product.name}
              </Typography>

              <Stack sx={{ gap: { xs: 2, md: productDetailModalBlockGap }, width: "100%" }}>
                <Stack sx={{ gap: productDetailModalLabelGap }}>
                  <Typography
                    sx={{
                      fontFamily: FONT_NAV,
                      fontWeight: 500,
                      fontSize: navFontSize,
                      lineHeight: 1.2,
                      textTransform: "capitalize",
                      color: TAN,
                    }}
                  >
                    Price
                  </Typography>
                  <Stack
                    direction="row"
                    sx={{
                      gap: productDetailModalPriceRowGap,
                      alignItems: "flex-end",
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_SURGENA,
                        fontWeight: 600,
                        fontSize: titleFontSize,
                        lineHeight: 1,
                        textTransform: "uppercase",
                        color: ACCENT,
                      }}
                    >
                      {formatPriceShort(product.price)}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONT_NAV,
                        fontWeight: 500,
                        fontSize: productDetailModalMrpFontSize,
                        lineHeight: 1.2,
                        color: MUTED,
                      }}
                    >
                      {detail.mrpNote ?? "MRP incl. of all taxes"}
                    </Typography>
                  </Stack>
                </Stack>

                <ProductVariantPickers
                  detail={detail}
                  sizeIndex={sizeIndex}
                  colorIndex={colorIndex}
                  onSizeIndexChange={setSizeIndex}
                  onColorIndexChange={setColorIndex}
                  showSizePicker={showSizePicker}
                />

                {/* Desktop / tablet: inline purchase actions */}
                {!isMobile ? purchaseActions : null}

                <ProductStory
                  title={detail.storyTitle}
                  body={detail.storyBody}
                  expanded={isMobile}
                />
              </Stack>

              {!isMobile ? (
                <ButtonBase
                  type="button"
                  onClick={handleViewDetails}
                  sx={viewDetailsBtnSx}
                >
                  View details
                </ButtonBase>
              ) : null}
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Mobile sticky purchase bar */}
      {isMobile ? (
        <Box
          sx={{
            flexShrink: 0,
            px: layoutPaddingX.xs,
            pt: 1.5,
            pb: "max(16px, env(safe-area-inset-bottom))",
            borderTop: `1px solid rgba(204, 188, 166, 0.45)`,
            bgcolor: PAGE_BG,
            boxShadow: "0 -10px 28px rgba(75, 74, 74, 0.1)",
            zIndex: 3,
          }}
        >
          {purchaseActions}
        </Box>
      ) : null}
    </Dialog>
  );
}

function ProductStory({
  title,
  body,
  expanded,
}: {
  title: string;
  body: string;
  expanded: boolean;
}) {
  if (expanded) {
    return (
      <Stack sx={{ gap: productDetailModalLabelGap }}>
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 500,
            fontSize: navFontSize,
            lineHeight: 1.2,
            color: TAN,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 500,
            fontSize: navFontSize,
            lineHeight: 1.5,
            color: MUTED,
          }}
        >
          {body}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack sx={{ gap: productDetailModalLabelGap }}>
      <Typography
        sx={{
          fontFamily: FONT_NAV,
          fontWeight: 500,
          fontSize: navFontSize,
          lineHeight: 1.2,
          color: TAN,
        }}
      >
        {title}
      </Typography>
      <Tooltip
        title={body}
        placement="top-start"
        enterDelay={400}
        slotProps={{
          tooltip: {
            sx: {
              maxWidth: 320,
              bgcolor: MUTED,
              color: PAGE_BG,
              fontFamily: FONT_NAV,
              fontSize: navFontSize,
              lineHeight: 1.45,
              p: 1.25,
            },
          },
        }}
      >
        <Typography
          component="span"
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 500,
            fontSize: navFontSize,
            lineHeight: 1.4,
            color: MUTED,
            display: "-webkit-box",
            WebkitLineClamp: STORY_LINE_CLAMP,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            cursor: "help",
          }}
        >
          {body}
        </Typography>
      </Tooltip>
    </Stack>
  );
}

function PurchaseActions({
  quantity,
  setQuantity,
  selectedSizeInStock,
  onAddToCart,
  onBuyNow,
  onViewDetails,
  showViewDetails,
  layout,
}: {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  selectedSizeInStock: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onViewDetails: () => void;
  showViewDetails: boolean;
  layout: "inline" | "stacked";
}) {
  const isStacked = layout === "stacked";

  const qtyControl = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        flex: isStacked ? "0 0 auto" : undefined,
        width: isStacked ? 132 : undefined,
        minWidth: isStacked ? 132 : undefined,
        flexShrink: 0,
        gap: isStacked ? 0.5 : productDetailModalQtyInnerGap,
        px: isStacked ? 1 : productDetailModalQtyPadX,
        py: isStacked ? 0.5 : productDetailModalQtyPadY,
        borderRadius: productDetailModalChipRadius,
        border: "1px solid rgba(75,74,74,0.18)",
        bgcolor: isStacked ? "rgba(255, 255, 255, 0.72)" : "transparent",
        boxSizing: "border-box",
        minHeight: MOBILE_CTA_MIN_H,
      }}
    >
      <QtyButton
        label="Decrease quantity"
        disabled={quantity <= 1}
        compact={isStacked}
        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
      >
        −
      </QtyButton>
      <Typography
        sx={{
          fontFamily: FONT_NAV,
          fontWeight: 600,
          fontSize: navFontSize,
          color: MUTED,
          minWidth: isStacked ? 24 : 28,
          flex: isStacked ? 1 : undefined,
          textAlign: "center",
        }}
      >
        {quantity}
      </Typography>
      <QtyButton
        label="Increase quantity"
        compact={isStacked}
        onClick={() => setQuantity((q) => q + 1)}
      >
        +
      </QtyButton>
    </Stack>
  );

  const addToCartBtn = selectedSizeInStock ? (
    <ButtonBase
      type="button"
      onClick={onAddToCart}
      sx={{
        flex: isStacked ? 1 : 1,
        width: isStacked ? "100%" : undefined,
        alignSelf: isStacked ? "stretch" : undefined,
        bgcolor: ACCENT,
        color: PAGE_BG,
        px: productDetailModalCtaPadX,
        py: productDetailModalCtaPadY,
        minHeight: MOBILE_CTA_MIN_H,
        borderRadius: productDetailModalChipRadius,
        fontFamily: FONT_NAV,
        fontWeight: 600,
        fontSize: navFontSize,
        lineHeight: 1,
        textTransform: "uppercase",
        "&:hover": { bgcolor: ACCENT, opacity: 0.94 },
        "&:active": { transform: "scale(0.99)" },
      }}
    >
      Add to cart
    </ButtonBase>
  ) : (
    <Box
      sx={{
        flex: isStacked ? 1 : 1,
        width: isStacked ? "100%" : undefined,
        alignSelf: isStacked ? "stretch" : undefined,
        bgcolor: "rgba(75,74,74,0.08)",
        color: "rgba(75,74,74,0.45)",
        px: productDetailModalCtaPadX,
        py: productDetailModalCtaPadY,
        minHeight: MOBILE_CTA_MIN_H,
        borderRadius: productDetailModalChipRadius,
        fontFamily: FONT_NAV,
        fontWeight: 600,
        fontSize: navFontSize,
        lineHeight: 1,
        textTransform: "uppercase",
        textAlign: "center",
        userSelect: "none",
        cursor: "default",
        border: "1px solid rgba(75,74,74,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Out of stock
    </Box>
  );

  const buyNowBtn = selectedSizeInStock ? (
    <ButtonBase
      type="button"
      onClick={onBuyNow}
      sx={{
        width: "100%",
        bgcolor: "transparent",
        color: ACCENT,
        px: productDetailModalCtaPadX,
        py: productDetailModalCtaPadY,
        minHeight: MOBILE_CTA_MIN_H,
        borderRadius: productDetailModalChipRadius,
        border: `2px solid ${ACCENT}`,
        fontFamily: FONT_NAV,
        fontWeight: 600,
        fontSize: navFontSize,
        lineHeight: 1,
        textTransform: "uppercase",
        "&:hover": { bgcolor: "rgba(188, 126, 90, 0.08)" },
        "&:active": { transform: "scale(0.99)" },
      }}
    >
      Buy now
    </ButtonBase>
  ) : null;

  const viewDetailsBtn = (
    <ButtonBase
      type="button"
      onClick={onViewDetails}
      sx={
        showViewDetails
          ? viewDetailsBtnSx
          : {
              width: "100%",
              minHeight: MOBILE_CTA_MIN_H,
              borderRadius: productDetailModalChipRadius,
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: navFontSize,
              lineHeight: 1,
              textTransform: "uppercase",
              bgcolor: "transparent",
              color: MUTED,
              border: `1px solid rgba(75, 74, 74, 0.22)`,
              "&:hover": { bgcolor: "rgba(204, 188, 166, 0.14)" },
            }
      }
    >
      {showViewDetails ? "View details" : "View full details"}
    </ButtonBase>
  );

  if (isStacked) {
    return (
      <Stack sx={{ gap: 1.25, width: "100%" }}>
        {selectedSizeInStock ? (
          <Stack
            direction="row"
            sx={{ gap: 1.25, alignItems: "stretch", width: "100%" }}
          >
            {qtyControl}
            <Box sx={{ flex: 1, minWidth: 0, display: "flex" }}>{addToCartBtn}</Box>
          </Stack>
        ) : (
          addToCartBtn
        )}
        {buyNowBtn}
        {viewDetailsBtn}
      </Stack>
    );
  }

  return (
    <Stack sx={{ gap: productDetailModalLabelGap, width: "100%" }}>
      <Typography
        sx={{
          fontFamily: FONT_NAV,
          fontWeight: 500,
          fontSize: navFontSize,
          lineHeight: 1.2,
          textTransform: "capitalize",
          color: TAN,
        }}
      >
        Quantity
      </Typography>
      <Stack
        direction="row"
        sx={{
          gap: productDetailModalQtyRowGap,
          alignItems: "center",
          flexWrap: "nowrap",
          width: "100%",
        }}
      >
        {qtyControl}
        {addToCartBtn}
      </Stack>
      {buyNowBtn}
    </Stack>
  );
}

function QtyButton({
  children,
  label,
  disabled,
  compact = false,
  onClick,
}: {
  children: ReactNode;
  label: string;
  disabled?: boolean;
  compact?: boolean;
  onClick: () => void;
}) {
  const size = compact ? 36 : MOBILE_TOUCH_MIN;
  return (
    <ButtonBase
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      sx={{
        fontFamily: FONT_NAV,
        fontWeight: 600,
        fontSize: navFontSize,
        color: MUTED,
        width: size,
        minWidth: size,
        height: size,
        minHeight: size,
        borderRadius: 1,
        flexShrink: 0,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </ButtonBase>
  );
}

const viewDetailsBtnSx = {
  width: "100%",
  bgcolor: ACCENT,
  color: PAGE_BG,
  py: productDetailModalCtaPadY,
  minHeight: MOBILE_CTA_MIN_H,
  borderRadius: productDetailModalChipRadius,
  fontFamily: FONT_NAV,
  fontWeight: 600,
  fontSize: navFontSize,
  lineHeight: 1,
  textTransform: "uppercase" as const,
  "&:hover": { bgcolor: ACCENT, opacity: 0.94 },
};

function CloseIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      sx={{
        width: productDetailModalCloseIconSize,
        height: productDetailModalCloseIconSize,
        display: "block",
      }}
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Box>
  );
}
