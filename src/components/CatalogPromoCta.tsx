import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useId } from "react";
import { Link as RouterLink } from "@tanstack/react-router";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import type { CatalogPromoConfig } from "../catalog/catalogPageTypes";
import {
  discoverSeeMoreArrowHeight,
  discoverSeeMoreArrowWidth,
  furnitureCustomisationBandPadX,
  furnitureCustomisationBandPadY,
  furnitureCustomisationBandPadBottom,
  furnitureCustomisationBodyMaxW,
  furnitureCustomisationCardInnerPadX,
  furnitureCustomisationCardInnerPadY,
  furnitureCustomisationCtaPadX,
  furnitureCustomisationCtaPadY,
  furnitureCustomisationMediaMinH,
  furnitureCustomisationCardRadius,
  furnitureCustomisationStackGap,
  furnitureCustomisationTitleSize,
  furnitureCustomisationTopRadius,
  furnitureCategoryShellBg,
  navFontSize,
  shopRadius,
  siteFooterShellBgDefault,
  furnitureCustomisationImageObjectPosition,
} from "../navDesignTokens";

type CatalogPromoCtaProps = CatalogPromoConfig;

/**
 * Tan band + lifestyle art + CTA — shared by catalog/collection PLPs (Figma 990:6384 pattern).
 */
export function CatalogPromoCta({
  title,
  body,
  imageSrc,
  ctaLabel,
  ctaTo,
  imageObjectPosition = furnitureCustomisationImageObjectPosition,
  flipImage = false,
}: CatalogPromoCtaProps) {
  const headingId = useId();

  return (
    <Box
      component="section"
      aria-labelledby={headingId}
      sx={{
        width: "100vw",
        maxWidth: "100vw",
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
        bgcolor: furnitureCategoryShellBg,
        backdropFilter: "blur(2px)",
        borderTopLeftRadius: furnitureCustomisationTopRadius,
        borderTopRightRadius: furnitureCustomisationTopRadius,
        px: furnitureCustomisationBandPadX,
        pt: furnitureCustomisationBandPadY,
        pb: furnitureCustomisationBandPadBottom,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          position: "relative",
          borderRadius: furnitureCustomisationCardRadius,
          overflow: "hidden",
          minHeight: furnitureCustomisationMediaMinH,
        }}
      >
        <Box
          component="img"
          src={imageSrc}
          alt=""
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: imageObjectPosition,
            transform: flipImage ? "scaleX(-1)" : undefined,
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.22) 45%, rgba(0,0,0,0.08) 100%)",
          }}
        />
        <Stack
          sx={{
            position: "relative",
            zIndex: 1,
            alignItems: "flex-start",
            justifyContent: "center",
            px: furnitureCustomisationCardInnerPadX,
            py: furnitureCustomisationCardInnerPadY,
            gap: furnitureCustomisationStackGap,
            minHeight: furnitureCustomisationMediaMinH,
            boxSizing: "border-box",
          }}
        >
          <Typography
            id={headingId}
            component="h2"
            sx={{
              fontFamily: FONT_SURGENA,
              fontWeight: 600,
              fontSize: furnitureCustomisationTitleSize,
              lineHeight: 1.2,
              textTransform: "uppercase",
              color: "#ffffff",
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 500,
              fontSize: navFontSize,
              lineHeight: 1.2,
              color: "#ffffff",
              maxWidth: furnitureCustomisationBodyMaxW,
            }}
          >
            {body}
          </Typography>
          <ButtonBase
            component={RouterLink}
            to={ctaTo}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3.5,
              bgcolor: furnitureCategoryShellBg,
              color: siteFooterShellBgDefault,
              px: furnitureCustomisationCtaPadX,
              py: furnitureCustomisationCtaPadY,
              borderRadius: shopRadius,
              textTransform: "uppercase",
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: navFontSize,
              lineHeight: 1,
              "&:hover": { bgcolor: furnitureCategoryShellBg, opacity: 0.94 },
            }}
          >
            {ctaLabel}
            <Box
              component="img"
              src="/category/arrow-right.svg"
              alt=""
              sx={{
                width: discoverSeeMoreArrowWidth,
                height: discoverSeeMoreArrowHeight,
                display: "block",
              }}
            />
          </ButtonBase>
        </Stack>
      </Box>
    </Box>
  );
}
