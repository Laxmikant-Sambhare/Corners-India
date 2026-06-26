import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import type {
  CatalogProduct,
  ProductPdpBodyConfig,
} from "../catalog/catalogPageTypes";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import { formatPriceShort } from "./productDetailUtils";
import { WishlistHeartButton } from "./WishlistHeartButton";
import {
  furnitureHeroBodyFontSize,
  navFontSize,
  pdpBodyAccentChipRadius,
  pdpBodyAccordionPadX,
  pdpBodyAccordionPadY,
  pdpBodyAccordionRadius,
  pdpBodyAccordionListGap,
  pdpBodyBlockGap,
  pdpBodyBtnRadius,
  pdpBodyColGap,
  pdpBodyDetailsMaxW,
  pdpBodyDimChairToLinesGap,
  pdpBodyDimColCenterW,
  pdpBodyDimColFrontMaxW,
  pdpBodyDimColGap,
  pdpBodyDimColSideMaxW,
  pdpBodyDimLineToLabelGap,
  pdpBodyDimLineVHeight,
  pdpBodyFieldLabelGap,
  pdpBodyGalleryGap,
  pdpBodyGalleryMaxW,
  pdpBodyGalleryRowMinH,
  pdpBodyImageRadius,
  pdpBodyMadeToOrderPadX,
  pdpBodyMadeToOrderPadY,
  pdpBodyPriceSize,
  pdpBodyQtyRowGap,
  pdpBodyQtyRowMinH,
  pdpBodySectionPadTop,
  pdpBodySwatchGap,
  pdpBodySwatchH,
  pdpBodySwatchW,
  pdpBodyTitleToBodyGap,
  pdpHeroPadX,
  productDetailModalCtaPadX,
  productDetailModalCtaPadY,
  productDetailModalQtyPadX,
  productDetailModalQtyPadY,
  pdpHeroImageBleedMargin,
  pdpHeroImageBleedMarginDesc,
} from "../navDesignTokens";

const PAGE_BG = "#f3ede3";
const TAN = "#ccbca6";
const ACCENT = "#bc7e5a";
const MUTED = "#4b4a4a";

type ProductPdpBodyProps = {
  config: ProductPdpBodyConfig;
  wishlistProduct?: CatalogProduct;
  /** When true, skips the top bleed margin applied for furniture hero images. */
  noHeroBleed?: boolean;
};

export function ProductPdpBody({
  config,
  wishlistProduct,
  noHeroBleed,
}: ProductPdpBodyProps) {
  const [quantity, setQuantity] = useState(1);
  const [materialIndex, setMaterialIndex] = useState(0);

  const priceDisplay = formatPriceShort(config.price);

  return (
    <Box
      component="section"
      aria-label="Product details"
      sx={{
        width: "100%",
        bgcolor: PAGE_BG,
        px: pdpHeroPadX,
        pt: pdpBodySectionPadTop,
        pb: { xs: 4, md: 6 },
        boxSizing: "border-box",
      }}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        sx={{
          gap: pdpBodyColGap,
          alignItems: "flex-start",
          justifyContent: "space-between",
          maxWidth: "100%",
        }}
      >
        <ProductPdpGallery gallery={config.gallery} noHeroBleed={noHeroBleed} />
        <Stack
          sx={{
            width: "100%",
            maxWidth: { lg: pdpBodyDetailsMaxW },
            flexShrink: 0,
            gap: pdpBodyBlockGap,
            mt: noHeroBleed ? 0 : pdpHeroImageBleedMarginDesc,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={
              config.madeToOrder !== false ? "space-between" : "flex-end"
            }
            sx={{ width: "100%" }}
          >
            {config.madeToOrder !== false && (
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  gap: "10px",
                  bgcolor: TAN,
                  px: pdpBodyMadeToOrderPadX,
                  py: pdpBodyMadeToOrderPadY,
                  borderRadius: pdpBodyAccentChipRadius,
                  flexShrink: 0,
                }}
              >
                <PackageIcon />
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 600,
                    fontSize: furnitureHeroBodyFontSize,
                    lineHeight: 1,
                    textTransform: "uppercase",
                    color: PAGE_BG,
                    whiteSpace: "nowrap",
                  }}
                >
                  Made to Order
                </Typography>
              </Stack>
            )}
            <Stack direction="row" sx={{ gap: 2, alignItems: "center" }}>
              {wishlistProduct ? (
                <WishlistHeartButton product={wishlistProduct} size="36px" />
              ) : (
                <ButtonBase
                  type="button"
                  aria-label="Add to wishlist"
                  sx={{ p: 0.5 }}
                >
                  <HeartIcon />
                </ButtonBase>
              )}
              <ButtonBase type="button" aria-label="Share" sx={{ p: 0.5 }}>
                <ShareIcon />
              </ButtonBase>
            </Stack>
          </Stack>

          <Stack sx={{ gap: pdpBodyFieldLabelGap, width: "100%" }}>
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 500,
                fontSize: furnitureHeroBodyFontSize,
                lineHeight: 1.2,
                textTransform: "capitalize",
                color: TAN,
              }}
            >
              Price
            </Typography>
            <Stack sx={{ gap: pdpBodyTitleToBodyGap }}>
              <Typography
                sx={{
                  fontFamily: FONT_SURGENA,
                  fontWeight: 600,
                  fontSize: pdpBodyPriceSize,
                  lineHeight: 1,
                  textTransform: "uppercase",
                  color: ACCENT,
                }}
              >
                {priceDisplay}
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 500,
                  fontSize: furnitureHeroBodyFontSize,
                  lineHeight: 1.2,
                  color: MUTED,
                }}
              >
                {config.mrpNote ?? "MRP incl. of all taxes"}
              </Typography>
            </Stack>
          </Stack>

          {config.materialSwatches.length > 0 && (
            <Stack sx={{ gap: pdpBodyFieldLabelGap, width: "100%" }}>
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 500,
                  fontSize: furnitureHeroBodyFontSize,
                  lineHeight: 1.2,
                  textTransform: "capitalize",
                  color: TAN,
                }}
              >
                Material
              </Typography>
              <Stack
                direction="row"
                sx={{
                  flexWrap: { xs: "wrap", md: "nowrap" },
                  gap: pdpBodySwatchGap,
                  width: "100%",
                  overflowX: { xs: "auto", md: "visible" },
                  pb: { xs: 0.5, md: 0 },
                }}
              >
                {config.materialSwatches.map((label, i) => (
                  <ButtonBase
                    key={`${label}-${i}`}
                    type="button"
                    onClick={() => setMaterialIndex(i)}
                    sx={{
                      width: pdpBodySwatchW,
                      height: pdpBodySwatchH,
                      minWidth: pdpBodySwatchW,
                      borderRadius: pdpBodyBtnRadius,
                      flexShrink: 0,
                      border:
                        materialIndex === i
                          ? `2px solid ${ACCENT}`
                          : `1px solid rgba(75, 74, 74, 0.15)`,
                      boxSizing: "border-box",
                      bgcolor: materialIndex === i ? ACCENT : PAGE_BG,
                      px: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_NAV,
                        fontWeight: 500,
                        fontSize: furnitureHeroBodyFontSize,
                        lineHeight: 1.2,
                        textTransform: "capitalize",
                        color: materialIndex === i ? PAGE_BG : MUTED,
                        textAlign: "center",
                      }}
                    >
                      {label}
                    </Typography>
                  </ButtonBase>
                ))}
              </Stack>
            </Stack>
          )}

          <Stack sx={{ gap: pdpBodyFieldLabelGap, width: "100%" }}>
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 500,
                fontSize: furnitureHeroBodyFontSize,
                lineHeight: 1.2,
                textTransform: "capitalize",
                color: TAN,
              }}
            >
              Quantity
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              sx={{
                gap: pdpBodyQtyRowGap,
                width: "100%",
                alignItems: "stretch",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  flex: { sm: "1 1 0" },
                  minWidth: 0,
                  minHeight: pdpBodyQtyRowMinH,
                  border: "1px solid rgba(75, 74, 74, 0.2)",
                  borderRadius: pdpBodyBtnRadius,
                  bgcolor: "rgba(255, 255, 255, 0.72)",
                  px: productDetailModalQtyPadX,
                  py: productDetailModalQtyPadY,
                  boxSizing: "border-box",
                }}
              >
                <ButtonBase
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 500,
                    fontSize: navFontSize,
                    color: MUTED,
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
                  }}
                >
                  {quantity}
                </Typography>
                <ButtonBase
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 500,
                    fontSize: navFontSize,
                    color: MUTED,
                  }}
                >
                  +
                </ButtonBase>
              </Stack>
              <ButtonBase
                type="button"
                sx={{
                  flex: { sm: "1 1 0" },
                  minWidth: 0,
                  minHeight: pdpBodyQtyRowMinH,
                  bgcolor: ACCENT,
                  color: PAGE_BG,
                  px: productDetailModalCtaPadX,
                  py: productDetailModalCtaPadY,
                  borderRadius: pdpBodyBtnRadius,
                  fontFamily: FONT_NAV,
                  fontWeight: 600,
                  fontSize: navFontSize,
                  textTransform: "uppercase",
                  "&:hover": { bgcolor: ACCENT, opacity: 0.94 },
                }}
              >
                Add to cart
              </ButtonBase>
            </Stack>
            <ButtonBase
              component={RouterLink}
              to="/customizations"
              sx={{
                width: "100%",
                minHeight: pdpBodyQtyRowMinH,
                bgcolor: ACCENT,
                color: PAGE_BG,
                py: productDetailModalCtaPadY,
                borderRadius: pdpBodyBtnRadius,
                fontFamily: FONT_NAV,
                fontWeight: 600,
                fontSize: navFontSize,
                textTransform: "uppercase",
                "&:hover": { bgcolor: ACCENT, opacity: 0.94 },
              }}
            >
              Get it Customized
            </ButtonBase>
            {config.expectedDelivery && (
              <Stack
                direction="row"
                sx={{ gap: "2px", flexWrap: "wrap", alignItems: "baseline" }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 500,
                    fontSize: furnitureHeroBodyFontSize,
                    lineHeight: 1.4,
                    color: MUTED,
                  }}
                >
                  Expected Delivery by{" "}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 700,
                    fontSize: furnitureHeroBodyFontSize,
                    lineHeight: 1.4,
                    color: ACCENT,
                  }}
                >
                  {config.expectedDelivery}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Stack sx={{ gap: pdpBodyAccordionListGap, width: "100%" }}>
            <PdpAccordion title="Product Description" defaultExpanded>
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 500,
                  fontSize: furnitureHeroBodyFontSize,
                  lineHeight: 1.4,
                  color: MUTED,
                }}
              >
                {config.productDescription}
              </Typography>
            </PdpAccordion>

            <PdpAccordion title="Material" defaultExpanded>
              <Box
                component="ul"
                sx={{
                  m: 0,
                  pl: 2.5,
                  fontFamily: FONT_NAV,
                  fontWeight: 500,
                  fontSize: furnitureHeroBodyFontSize,
                  lineHeight: 1.4,
                  color: MUTED,
                }}
              >
                {config.materialBullets.map((line) => (
                  <Box component="li" key={line} sx={{ mb: 0 }}>
                    {line}
                  </Box>
                ))}
              </Box>
            </PdpAccordion>

            {config.showDimensions !== false && (
              <PdpAccordion title="Dimensions and Size" defaultExpanded>
                <ProductPdpDimensions dims={config.dimensions} />
              </PdpAccordion>
            )}

            <PdpAccordion title="Shipping / Delivery Timeline" defaultExpanded>
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 500,
                  fontSize: furnitureHeroBodyFontSize,
                  lineHeight: 1.4,
                  color: MUTED,
                }}
              >
                {config.shippingBody}
              </Typography>
              {config.deliveryLeadTime && (
                <Typography
                  sx={{
                    mt: 1.5,
                    fontFamily: FONT_NAV,
                    fontWeight: 600,
                    fontSize: furnitureHeroBodyFontSize,
                    lineHeight: 1.4,
                    color: MUTED,
                  }}
                >
                  Delivery Time: {config.deliveryLeadTime}
                </Typography>
              )}
            </PdpAccordion>

            <PdpAccordion title="Return & Exchange" defaultExpanded>
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 500,
                  fontSize: furnitureHeroBodyFontSize,
                  lineHeight: 1.4,
                  color: MUTED,
                }}
              >
                {config.returnBody}
              </Typography>
            </PdpAccordion>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

function ProductPdpGallery({
  gallery,
  noHeroBleed,
}: {
  gallery: ProductPdpBodyConfig["gallery"];
  noHeroBleed?: boolean;
}) {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { lg: pdpBodyGalleryMaxW },
        flex: { lg: "1 1 0" },
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: pdpBodyGalleryGap,
        mt: noHeroBleed ? 0 : pdpHeroImageBleedMargin,
      }}
    >
      <Stack
        direction="row"
        sx={{
          gap: pdpBodyGalleryGap,
          alignItems: "stretch",
          minHeight: { md: pdpBodyGalleryRowMinH },
        }}
      >
        <Stack
          sx={{
            flex: "0 1 46%",
            minWidth: 0,
            gap: pdpBodyGalleryGap,
          }}
        >
          <GalleryTile src={gallery.topLeft} aspectRatio={382 / 358} />
          <GalleryTile src={gallery.bottomLeft} aspectRatio={382 / 225} />
        </Stack>
        <Box
          sx={{
            flex: "1 1 50%",
            minWidth: 0,
            borderRadius: pdpBodyImageRadius,
            overflow: "hidden",
            position: "relative",
            minHeight: { xs: 280, md: "auto" },
          }}
        >
          <Box
            component="img"
            src={gallery.rightTall}
            alt=""
            sx={{
              width: "100%",
              height: "100%",
              minHeight: { md: pdpBodyGalleryRowMinH },
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
      </Stack>
      <Box
        sx={{
          borderRadius: pdpBodyImageRadius,
          overflow: "hidden",
          width: "100%",
          aspectRatio: { xs: "16/9", md: 833 / 442 },
        }}
      >
        <Box
          component="img"
          src={gallery.bottomWide}
          alt=""
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Box>
    </Box>
  );
}

function GalleryTile({
  src,
  aspectRatio,
}: {
  src: string;
  aspectRatio: number;
}) {
  return (
    <Box
      sx={{
        borderRadius: pdpBodyImageRadius,
        overflow: "hidden",
        width: "100%",
        aspectRatio: `${aspectRatio}`,
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
    </Box>
  );
}

/** Thin horizontal dimension line — avoids stretched SVG “pillars” from rasterized assets. Figma 990:14586. */
function PdpDimensionLineHorizontal() {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ width: "100%", height: 3, flexShrink: 0 }}
    >
      <Box
        sx={{
          width: 3,
          height: 3,
          borderRadius: "50%",
          bgcolor: MUTED,
          flexShrink: 0,
        }}
      />
      <Box sx={{ flex: 1, height: "1px", bgcolor: MUTED }} />
      <Box
        sx={{
          width: 3,
          height: 3,
          borderRadius: "50%",
          bgcolor: MUTED,
          flexShrink: 0,
        }}
      />
    </Stack>
  );
}

/** Thin vertical dimension line — fixed 1px stroke; height from token. Figma 990:14593. */
function PdpDimensionLineVertical({ height }: { height: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 3,
        height,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: 3,
          height: 3,
          borderRadius: "50%",
          bgcolor: MUTED,
          flexShrink: 0,
        }}
      />
      <Box sx={{ width: "1px", flex: 1, minHeight: 4, bgcolor: MUTED }} />
      <Box
        sx={{
          width: 3,
          height: 3,
          borderRadius: "50%",
          bgcolor: MUTED,
          flexShrink: 0,
        }}
      />
    </Box>
  );
}

function ProductPdpDimensions({
  dims,
}: {
  dims: ProductPdpBodyConfig["dimensions"];
}) {
  if (dims.diagramUrl) {
    return (
      <Box
        component="img"
        src={dims.diagramUrl}
        alt="Product dimensions"
        sx={{
          width: "100%",
          height: "auto",
          display: "block",
          objectFit: "contain",
        }}
      />
    );
  }

  const dimLabelSx = {
    fontFamily: FONT_NAV,
    fontWeight: 500,
    fontSize: furnitureHeroBodyFontSize,
    lineHeight: 1.4,
    textTransform: "uppercase" as const,
    color: MUTED,
    textAlign: "center" as const,
  };

  return (
    <Stack sx={{ gap: pdpBodyTitleToBodyGap, width: "100%" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{
          gap: pdpBodyDimColGap,
          justifyContent: "center",
          alignItems: { xs: "stretch", md: "flex-start" },
          width: "100%",
        }}
      >
        <Stack
          sx={{
            alignItems: "center",
            gap: pdpBodyDimChairToLinesGap,
            width: "100%",
            maxWidth: { md: pdpBodyDimColFrontMaxW },
            mx: { xs: "auto", md: 0 },
          }}
        >
          <Box
            component="img"
            src="/pdp-gallery/dim-chair-front.svg"
            alt=""
            sx={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "contain",
            }}
          />
          <Stack
            sx={{
              alignItems: "center",
              gap: pdpBodyDimLineToLabelGap,
              width: "100%",
            }}
          >
            <PdpDimensionLineHorizontal />
            <Typography sx={dimLabelSx}>{dims.frontFt}</Typography>
          </Stack>
          <Typography sx={dimLabelSx}>Front elevation</Typography>
        </Stack>

        <Stack
          sx={{
            alignItems: "center",
            gap: 2,
            width: "100%",
            maxWidth: { md: pdpBodyDimColCenterW },
            flexShrink: 0,
            mx: { xs: "auto", md: 0 },
            alignSelf: { md: "stretch" },
          }}
        >
          <PdpDimensionLineVertical height={pdpBodyDimLineVHeight} />
          <Typography sx={dimLabelSx}>{dims.sideFt}</Typography>
        </Stack>

        <Stack
          sx={{
            alignItems: "center",
            gap: pdpBodyDimChairToLinesGap,
            width: "100%",
            maxWidth: { md: pdpBodyDimColSideMaxW },
            mx: { xs: "auto", md: 0 },
          }}
        >
          <Box
            component="img"
            src="/pdp-gallery/dim-chair-side.svg"
            alt=""
            sx={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "contain",
            }}
          />
          <Stack
            sx={{
              alignItems: "center",
              gap: pdpBodyDimLineToLabelGap,
              width: "100%",
            }}
          >
            <PdpDimensionLineHorizontal />
            <Typography sx={dimLabelSx}>{dims.depthFt}</Typography>
          </Stack>
          <Typography sx={dimLabelSx}>Side elevation</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

function PdpAccordion({
  title,
  children,
  defaultExpanded = false,
}: {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      elevation={0}
      sx={{
        bgcolor: PAGE_BG,
        border: `1px solid ${ACCENT}`,
        borderRadius: `${pdpBodyAccordionRadius} !important`,
        overflow: "hidden",
        "&:before": { display: "none" },
        "&.Mui-expanded": { margin: 0 },
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown />}
        sx={{
          px: pdpBodyAccordionPadX,
          py: pdpBodyAccordionPadY,
          bgcolor: PAGE_BG,
          "& .MuiAccordionSummary-content": {
            my: 0,
            alignItems: "flex-start",
            justifyContent: "space-between",
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: furnitureHeroBodyFontSize,
            lineHeight: 1,
            textTransform: "uppercase",
            color: MUTED,
            pr: 2,
          }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          px: pdpBodyAccordionPadX,
          pt: 0,
          pb: pdpBodyAccordionPadY,
          mt: -1,
          bgcolor: PAGE_BG,
        }}
      >
        <Box sx={{ pt: pdpBodyTitleToBodyGap }}>{children}</Box>
      </AccordionDetails>
    </Accordion>
  );
}

function ChevronDown() {
  return (
    <Box
      component="svg"
      width={12}
      height={6}
      viewBox="0 0 12 6"
      sx={{ color: ACCENT }}
    >
      <path
        d="M1 1L6 5L11 1"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </Box>
  );
}

function PackageIcon() {
  return (
    <Box
      component="svg"
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      sx={{ flexShrink: 0, color: PAGE_BG }}
    >
      <path
        d="M9 1L16 5V13L9 17L2 13V5L9 1Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M2 5L9 9L16 5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9 9V17" stroke="currentColor" strokeWidth="1.2" />
    </Box>
  );
}

function HeartIcon() {
  return (
    <Box
      component="svg"
      width={36}
      height={30}
      viewBox="0 0 36 30"
      fill="none"
      sx={{ display: "block" }}
    >
      <path
        d="M35.684 7.66152C34.4939 2.89719 30.8154 0.0459837 25.731 0.00293066C23.3005 -0.0176863 21.1587 0.837917 19.1326 2.03673C18.7389 2.27019 18.3577 2.52366 17.9866 2.75772C17.5318 2.46908 17.1311 2.20106 16.7172 1.95427C13.9319 0.297025 10.9686 -0.447004 7.69831 0.276409C2.19628 1.49342 0.0569871 6.15891 0.0016334 9.84692C-0.0663007 14.3523 1.98933 18.0804 5.32502 21.1086C9.13751 24.5692 13.5186 27.3113 17.9897 30C21.7047 27.7946 25.2656 25.4582 28.6283 22.8423C30.8544 21.1105 32.8396 19.1846 34.1568 16.7021C35.6695 13.8502 36.491 10.8923 35.684 7.66152ZM31.2142 16.3431C29.9926 18.3035 28.2421 19.774 26.4167 21.1808C24.5975 22.5821 22.7099 23.8919 20.78 25.1465C19.8793 25.7323 18.9647 26.2993 18.0079 26.905C17.5506 26.6219 17.0952 26.3447 16.6449 26.0609C13.4865 24.0684 10.3949 21.9867 7.5788 19.5539C5.07216 17.3879 3.4323 14.7362 2.82153 11.5139C2.20383 8.25639 3.92231 4.6466 6.79819 3.35379C9.00856 2.35993 11.2554 2.3854 13.5004 3.30346C14.9673 3.90317 16.2656 4.74908 17.4645 5.749C17.6198 5.87876 17.7783 6.0055 17.9715 6.16255C18.6728 5.63379 19.3138 5.10502 20.0019 4.64053C21.6707 3.5163 23.4798 2.62917 25.5505 2.62674C30.0071 2.62068 32.5559 5.06925 33.1912 9.15989C33.5994 11.7886 32.5917 14.1316 31.2142 16.3431Z"
        fill={TAN}
      />
    </Box>
  );
}

function ShareIcon() {
  return (
    <Box
      component="svg"
      width={34}
      height={30}
      viewBox="0 0 34 30"
      fill="none"
      sx={{ display: "block" }}
    >
      <path
        d="M16.9867 1.75912L16.9867 18.5M9.5 8.57336L16.9991 1.5L24.5 8.57336"
        stroke={TAN}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.5 15.5V23.5C1.5 26.2614 3.73858 28.5 6.5 28.5H27.5C30.2614 28.5 32.5 26.2614 32.5 23.5V15.5"
        stroke={TAN}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Box>
  );
}
