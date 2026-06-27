import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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

type ProductDetailModalProps = {
  open: boolean;
  onClose: () => void;
  product: CatalogProduct | null;
};

export function ProductDetailModal({
  open,
  onClose,
  product,
}: ProductDetailModalProps) {
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

  // Reset hero image when the modal opens or the product changes.
  const productKey = open ? (product?.name ?? null) : null;
  const galleryKey = gallery.join("|");
  useEffect(() => {
    setImageIndex(0);
  }, [productKey, galleryKey]);

  if (!product || !detail) {
    return null;
  }

  const cartProduct = product;

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

  const mainSrc = gallery[imageIndex] ?? gallery[0] ?? product.image;
  const thumbSlots = gallery.length ? gallery : [product.image];

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
        aria-label="Close"
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
          sx={{
            gap: productDetailModalColGap,
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
                bgcolor: "transparent",
                minHeight: productDetailModalMainImageMinH,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={mainSrc}
                alt=""
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: productDetailModalMainImageMaxH,
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
                WebkitOverflowScrolling: "touch",
                gap: productDetailModalThumbGap,
                rowGap: productDetailModalThumbRowGap,
                mt: productDetailModalThumbMt,
                justifyContent: "flex-start",
                pb: { xs: 0.5, sm: 0 },
              }}
            >
              {thumbSlots.map((src, i) => (
                <ButtonBase
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setImageIndex(i)}
                  sx={{
                    width: productDetailModalThumbW,
                    height: productDetailModalThumbH,
                    minWidth: productDetailModalThumbW,
                    borderRadius: productDetailModalRadius,
                    overflow: "hidden",
                    flexShrink: 0,
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
              gap: productDetailModalSectionGap,
              alignItems: "flex-start",
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT_SURGENA,
                fontWeight: 600,
                fontSize: furnitureCustomisationTitleSize,
                lineHeight: 1.2,
                textTransform: "uppercase",
                color: ACCENT,
              }}
            >
              {product.name}
            </Typography>

            <Stack sx={{ gap: productDetailModalBlockGap, width: "100%" }}>
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
                      fontSize: furnitureCustomisationTitleSize,
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
                  }}
                >
                  {selectedSizeInStock && (
                    <Stack
                      direction="row"
                      sx={{
                        alignItems: "center",
                        gap: productDetailModalQtyInnerGap,
                        px: productDetailModalQtyPadX,
                        py: productDetailModalQtyPadY,
                        borderRadius: productDetailModalChipRadius,
                        border: "1px solid rgba(75,74,74,0.18)",
                        flexShrink: 0,
                      }}
                    >
                      <ButtonBase
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={quantity <= 1}
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        sx={{
                          fontFamily: FONT_NAV,
                          fontWeight: 500,
                          fontSize: navFontSize,
                          color: MUTED,
                          minWidth: 24,
                        }}
                      >
                        −
                      </ButtonBase>
                      <Typography
                        sx={{
                          fontFamily: FONT_NAV,
                          fontWeight: 500,
                          fontSize: navFontSize,
                          color: MUTED,
                          minWidth: 24,
                          textAlign: "center",
                        }}
                      >
                        {quantity}
                      </Typography>
                      <ButtonBase
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQuantity((q) => q + 1)}
                        sx={{
                          fontFamily: FONT_NAV,
                          fontWeight: 500,
                          fontSize: navFontSize,
                          color: MUTED,
                          minWidth: 24,
                        }}
                      >
                        +
                      </ButtonBase>
                    </Stack>
                  )}

                  {selectedSizeInStock ? (
                    <ButtonBase
                      type="button"
                      onClick={handleAddToCart}
                      sx={{
                        flex: 1,
                        bgcolor: ACCENT,
                        color: PAGE_BG,
                        px: productDetailModalCtaPadX,
                        py: productDetailModalCtaPadY,
                        borderRadius: productDetailModalChipRadius,
                        fontFamily: FONT_NAV,
                        fontWeight: 600,
                        fontSize: navFontSize,
                        lineHeight: 1,
                        textTransform: "uppercase",
                        "&:hover": { bgcolor: ACCENT, opacity: 0.94 },
                      }}
                    >
                      Add to cart
                    </ButtonBase>
                  ) : (
                    <Box
                      sx={{
                        flex: 1,
                        bgcolor: "rgba(75,74,74,0.08)",
                        color: "rgba(75,74,74,0.45)",
                        px: productDetailModalCtaPadX,
                        py: productDetailModalCtaPadY,
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
                      }}
                    >
                      Out of stock
                    </Box>
                  )}
                </Stack>
                {selectedSizeInStock ? (
                  <ButtonBase
                    type="button"
                    onClick={handleBuyNow}
                    sx={{
                      width: "100%",
                      bgcolor: "transparent",
                      color: ACCENT,
                      px: productDetailModalCtaPadX,
                      py: productDetailModalCtaPadY,
                      borderRadius: productDetailModalChipRadius,
                      border: `2px solid ${ACCENT}`,
                      fontFamily: FONT_NAV,
                      fontWeight: 600,
                      fontSize: navFontSize,
                      lineHeight: 1,
                      textTransform: "uppercase",
                      "&:hover": { bgcolor: "rgba(188, 126, 90, 0.08)" },
                    }}
                  >
                    Buy now
                  </ButtonBase>
                ) : null}
              </Stack>

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
                  {detail.storyTitle}
                </Typography>
                <Tooltip
                  title={detail.storyBody}
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
                    {detail.storyBody}
                  </Typography>
                </Tooltip>
              </Stack>
            </Stack>

            <ButtonBase
              type="button"
              onClick={() => {
                onClose();
                navigate({
                  to: "/product/$slug",
                  params: { slug: toProductSlug(product.name) },
                });
              }}
              sx={{
                width: "100%",
                bgcolor: ACCENT,
                color: PAGE_BG,
                py: productDetailModalCtaPadY,
                borderRadius: productDetailModalChipRadius,
                fontFamily: FONT_NAV,
                fontWeight: 600,
                fontSize: navFontSize,
                lineHeight: 1,
                textTransform: "uppercase",
                "&:hover": { bgcolor: ACCENT, opacity: 0.94 },
              }}
            >
              View details
            </ButtonBase>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
}

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
