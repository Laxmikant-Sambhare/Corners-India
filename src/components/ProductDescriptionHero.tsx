import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "@tanstack/react-router";
import type { ProductHeroConfig } from "../catalog/catalogPageTypes";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import {
  pdpHeroBadgePadX,
  pdpHeroBadgePadY,
  pdpHeroBadgeRadius,
  pdpHeroBadgeToTitleGap,
  pdpHeroBreadcrumbGap,
  pdpHeroBreadcrumbToContentGap,
  pdpHeroDescMaxW,
  pdpHeroImgLeftLeft,
  pdpHeroImgLeftTop,
  pdpHeroImgLeftW,
  pdpHeroImgRightLeft,
  pdpHeroImgRightTop,
  pdpHeroImgRightW,
  pdpHeroMinH,
  pdpHeroPadTop,
  pdpHeroPadX,
  pdpHeroTitleSize,
  pdpHeroTitleToDescGap,
  pdpHeroBadgeFontSize,
  furnitureHeroBreadcrumbFontSize,
  furnitureHeroBodyFontSize,
} from "../navDesignTokens";

const TAN = "#ccbca6";
const CREAM = "#f3ede3";
const ACCENT = "#bc7e5a";

type ProductDescriptionHeroProps = ProductHeroConfig;

/**
 * PDP hero — Figma 990:13189 (bg) + 990:13283 (text) + 990:13311/13450 (images).
 * Images are absolutely positioned across the full width and bleed below the tan area.
 */
export function ProductDescriptionHero({
  productName,
  categoryLabel,
  categoryPath,
  theme,
  description,
  heroImages,
  heroBackgroundImage,
}: ProductDescriptionHeroProps) {
  const hasBackgroundImage = Boolean(heroBackgroundImage);

  return (
    <Box
      component="section"
      aria-label={productName}
      sx={{
        position: "relative",
        width: "100%",
        minHeight: pdpHeroMinH,
        bgcolor: hasBackgroundImage ? CREAM : TAN,
        overflow: hasBackgroundImage ? "hidden" : "visible",
      }}
    >
      {/* Full-bleed lifestyle photo (rugs PDP — Figma 990:11896) */}
      {heroBackgroundImage && (
        <Box
          component="img"
          src={heroBackgroundImage}
          alt=""
          loading="eager"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center bottom",
            zIndex: 0,
            mixBlendMode: "multiply",
          }}
        />
      )}

      {/* ── Text content layer (z-index 1) ── */}
      <Stack
        sx={{
          position: "relative",
          zIndex: 1,
          px: pdpHeroPadX,
          pt: pdpHeroPadTop,
          pb: hasBackgroundImage ? { xs: 6, md: 8 } : 0,
          boxSizing: "border-box",
        }}
      >
        {/* Breadcrumb: Home → Category → Product */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{ color: CREAM, gap: pdpHeroBreadcrumbGap, flexWrap: "wrap" }}
        >
          <Typography
            component={RouterLink}
            to="/"
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: furnitureHeroBreadcrumbFontSize,
              lineHeight: 1.2,
              textTransform: "uppercase",
              color: "inherit",
              textDecoration: "none",
              "&:hover": { opacity: 0.9 },
            }}
          >
            Home
          </Typography>
          <BreadcrumbArrow />
          <Typography
            component={RouterLink}
            to={categoryPath}
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: furnitureHeroBreadcrumbFontSize,
              lineHeight: 1.2,
              textTransform: "uppercase",
              color: "inherit",
              textDecoration: "none",
              "&:hover": { opacity: 0.9 },
            }}
          >
            {categoryLabel}
          </Typography>
          <BreadcrumbArrow />
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: furnitureHeroBreadcrumbFontSize,
              lineHeight: 1.2,
              textTransform: "uppercase",
              color: "inherit",
              opacity: 0.5,
            }}
          >
            {productName}
          </Typography>
        </Stack>

        {/* Badge + title + description */}
        <Stack
          sx={{
            mt: pdpHeroBreadcrumbToContentGap,
            gap: pdpHeroBadgeToTitleGap,
            alignItems: "flex-start",
          }}
        >
          {theme && (
            <Box
              sx={{
                border: `1px solid ${CREAM}`,
                borderRadius: pdpHeroBadgeRadius,
                px: pdpHeroBadgePadX,
                py: pdpHeroBadgePadY,
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 600,
                  fontSize: pdpHeroBadgeFontSize,
                  lineHeight: 1,
                  textTransform: "uppercase",
                  color: CREAM,
                  whiteSpace: "pre",
                }}
              >
                {`Theme   |   ${theme} `}
              </Typography>
            </Box>
          )}

          <Stack sx={{ gap: pdpHeroTitleToDescGap, width: "100%" }}>
            <Typography
              component="h1"
              sx={{
                fontFamily: FONT_SURGENA,
                fontWeight: 600,
                fontSize: pdpHeroTitleSize,
                lineHeight: 1,
                textTransform: "uppercase",
                color: ACCENT,
              }}
            >
              {productName}
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 500,
                fontSize: furnitureHeroBodyFontSize,
                lineHeight: 1.4,
                color: CREAM,
                maxWidth: pdpHeroDescMaxW,
                textTransform: "capitalize",
              }}
            >
              {description}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* ── Absolutely positioned product images — furniture only ── */}
      {!hasBackgroundImage && heroImages[1] && (
        <Box
          component="img"
          src={heroImages[1]}
          alt={`${productName} view 2`}
          loading="eager"
          sx={{
            position: "absolute",
            left: pdpHeroImgRightLeft,
            top: pdpHeroImgRightTop,
            width: pdpHeroImgRightW,
            height: "auto",
            objectFit: "contain",
            zIndex: 2,
            pointerEvents: "none",
            display: { xs: "none", md: "block" },
          }}
        />
      )}
      {!hasBackgroundImage && heroImages[0] && (
        <Box
          component="img"
          src={heroImages[0]}
          alt={`${productName} view 1`}
          loading="eager"
          sx={{
            position: "absolute",
            left: pdpHeroImgLeftLeft,
            top: pdpHeroImgLeftTop,
            width: pdpHeroImgLeftW,
            height: "auto",
            objectFit: "contain",
            zIndex: 3,
            pointerEvents: "none",
            display: { xs: "none", md: "block" },
          }}
        />
      )}

      {/* Mobile fallback: images in normal flow — furniture only */}
      {!hasBackgroundImage && heroImages.length > 0 && (
        <Stack
          direction="row"
          sx={{
            display: { xs: "flex", md: "none" },
            gap: 2,
            px: pdpHeroPadX,
            pb: 4,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          {heroImages.slice(0, 2).map((src, i) => (
            <Box
              key={src}
              component="img"
              src={src}
              alt={`${productName} view ${i + 1}`}
              sx={{
                maxWidth: "48%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

function BreadcrumbArrow() {
  return (
    <Box
      component="svg"
      viewBox="0 0 29 12"
      sx={{
        width: "clamp(18px, 1.51vw, 29px)",
        height: "clamp(8px, 0.625vw, 12px)",
        flexShrink: 0,
        opacity: 0.9,
      }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0"
        y1="6"
        x2="26"
        y2="6"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M22 2L26 6L22 10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}
