import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useCartStore } from "../store/cartStore";
import type { CatalogProduct } from "../catalog/catalogPageTypes";
import { toProductSlug } from "../catalog/catalogPageConfig";
import { formatPriceShort, inferGalleryOptionValueFromImage, resolveProductDetail, resolveGalleryForProduct } from "./productDetailUtils";
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
  productDetailModalSizeChipGap,
  productDetailModalSizeChipPadX,
  productDetailModalSizeChipPadY,
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
  const detail = useMemo(
    () => (product ? resolveProductDetail(product) : null),
    [product],
  );

  const [imageIndex, setImageIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedSize = detail?.sizes[sizeIndex] ?? detail?.sizes[0] ?? "";
  const selectedColor =
    detail?.colors?.[colorIndex] ?? detail?.colors?.[0] ?? "";

  const gallery = useMemo(() => {
    if (!product || !detail) return [];
    return resolveGalleryForProduct(
      product,
      detail,
      selectedSize,
      selectedColor || undefined,
    );
  }, [product, detail, selectedSize, selectedColor]);

  // Reset form state when the modal opens or the product changes.
  const productKey = open ? (product?.name ?? null) : null;
  const galleryKey = gallery.join("|");
  const [prevProductKey, setPrevProductKey] = useState<string | null>(null);
  const [prevGalleryKey, setPrevGalleryKey] = useState("");
  if (productKey !== prevProductKey) {
    setPrevProductKey(productKey);
    if (productKey !== null && product && detail) {
      setImageIndex(0);
      setQuantity(1);
      const firstAvailableIdx = detail.sizes.findIndex((s) =>
        detail.availableSizes ? detail.availableSizes.includes(s) : true,
      );
      setSizeIndex(firstAvailableIdx >= 0 ? firstAvailableIdx : 0);

      if (detail.colors?.length) {
        const inferredColor = inferGalleryOptionValueFromImage(
          product.image,
          detail,
        );
        const colorIdx = inferredColor
          ? detail.colors.indexOf(inferredColor)
          : 0;
        setColorIndex(colorIdx >= 0 ? colorIdx : 0);
      } else {
        setColorIndex(0);
      }
    }
  }
  if (galleryKey !== prevGalleryKey) {
    setPrevGalleryKey(galleryKey);
    setImageIndex(0);
  }

  if (!product || !detail) {
    return null;
  }

  const mainSrc = gallery[imageIndex] ?? gallery[0] ?? product.image;
  const thumbSlots = gallery.length ? gallery : [product.image];

  const selectedSizeInStock = detail.availableSizes
    ? detail.availableSizes.includes(selectedSize)
    : (product.availableForSale ?? true);

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

              {(detail.colors?.length ?? 0) > 1 ? (
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
                    Color
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: productDetailModalSizeChipGap,
                      alignItems: "center",
                    }}
                  >
                    {detail.colors!.map((label, i) => {
                      const isColorAvailable = detail.availableColors
                        ? detail.availableColors.includes(label)
                        : true;
                      const isSelected = colorIndex === i;
                      return (
                        <ButtonBase
                          key={label}
                          type="button"
                          disabled={!isColorAvailable}
                          onClick={() => isColorAvailable && setColorIndex(i)}
                          sx={{
                            px: productDetailModalSizeChipPadX,
                            py: productDetailModalSizeChipPadY,
                            borderRadius: productDetailModalChipRadius,
                            border: isColorAvailable
                              ? isSelected
                                ? `2px solid ${ACCENT}`
                                : `1px solid ${ACCENT}`
                              : "1px solid rgba(75,74,74,0.2)",
                            bgcolor: isColorAvailable
                              ? isSelected
                                ? "rgba(188, 126, 90, 0.08)"
                                : "transparent"
                              : "rgba(75,74,74,0.04)",
                            fontFamily: FONT_NAV,
                            fontWeight: 500,
                            fontSize: navFontSize,
                            lineHeight: 1,
                            textTransform: "uppercase",
                            color: isColorAvailable
                              ? ACCENT
                              : "rgba(75,74,74,0.3)",
                            minWidth: { xs: "auto", sm: 77 },
                            cursor: isColorAvailable ? "pointer" : "not-allowed",
                          }}
                        >
                          {label}
                        </ButtonBase>
                      );
                    })}
                  </Box>
                </Stack>
              ) : null}

              {detail.sizes.length > 0 &&
              !(detail.sizes.length === 1 && detail.sizes[0] === "Standard") ? (
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
                  Size
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: productDetailModalSizeChipGap,
                    alignItems: "center",
                  }}
                >
                  {detail.sizes.map((label, i) => {
                    const isSizeAvailable = detail.availableSizes
                      ? detail.availableSizes.includes(label)
                      : true;
                    const isSelected = sizeIndex === i;
                    return (
                      <ButtonBase
                        key={label}
                        type="button"
                        disabled={!isSizeAvailable}
                        onClick={() => isSizeAvailable && setSizeIndex(i)}
                        sx={{
                          px: productDetailModalSizeChipPadX,
                          py: productDetailModalSizeChipPadY,
                          borderRadius: productDetailModalChipRadius,
                          border: isSizeAvailable
                            ? isSelected
                              ? `2px solid ${ACCENT}`
                              : `1px solid ${ACCENT}`
                            : "1px solid rgba(75,74,74,0.2)",
                          bgcolor: isSizeAvailable
                            ? isSelected
                              ? "rgba(188, 126, 90, 0.08)"
                              : "transparent"
                            : "rgba(75,74,74,0.04)",
                          fontFamily: FONT_NAV,
                          fontWeight: 500,
                          fontSize: navFontSize,
                          lineHeight: 1,
                          textTransform: "uppercase",
                          color: isSizeAvailable ? ACCENT : "rgba(75,74,74,0.3)",
                          minWidth: { xs: "auto", sm: 77 },
                          position: "relative",
                          cursor: isSizeAvailable ? "pointer" : "not-allowed",
                          "&::after": isSizeAvailable
                            ? {}
                            : {
                                content: '""',
                                position: "absolute",
                                left: "10%",
                                right: "10%",
                                top: "50%",
                                height: "1px",
                                bgcolor: "rgba(75,74,74,0.25)",
                              },
                        }}
                      >
                        {label}
                      </ButtonBase>
                    );
                  })}
                </Box>
              </Stack>
              ) : null}

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
                      onClick={() => {
                        addToCart(
                          product,
                          detail.sizes[sizeIndex] ?? detail.sizes[0] ?? "",
                          quantity,
                        );
                        onClose();
                      }}
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
