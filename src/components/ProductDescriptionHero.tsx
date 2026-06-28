import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "@tanstack/react-router";
import type { ProductHeroConfig } from "../catalog/catalogPageTypes";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import { layoutPaddingX } from "../layoutConstants";
import {
  pdpHeroBadgePadX,
  pdpHeroBadgePadY,
  pdpHeroBadgeRadius,
  pdpHeroBadgeToTitleGap,
  pdpHeroBreadcrumbGap,
  pdpHeroBreadcrumbToContentGap,
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
  pdpHeroBadgeFontSize,
  furnitureHeroBreadcrumbFontSize,
} from "../navDesignTokens";

const TAN = "#ccbca6";
const CREAM = "#f3ede3";
const ACCENT = "#bc7e5a";
const MUTED = "#4b4a4a";

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
        minHeight: {
          xs: hasBackgroundImage ? "min(72vh, 520px)" : "auto",
          md: pdpHeroMinH,
        },
        bgcolor: hasBackgroundImage ? CREAM : TAN,
        overflow: hasBackgroundImage ? "hidden" : "visible",
        pb: { xs: hasBackgroundImage ? 0 : 2, md: 0 },
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
          px: { xs: layoutPaddingX.xs, sm: layoutPaddingX.sm, md: pdpHeroPadX },
          pt: { xs: 10, sm: 12, md: pdpHeroPadTop },
          pb: hasBackgroundImage ? { xs: 3, md: 8 } : { xs: 2, md: 0 },
          boxSizing: "border-box",
          maxWidth: hasBackgroundImage
            ? { xs: "62%", sm: "56%", md: "none" }
            : "100%",
        }}
      >
        {/* Breadcrumb: Home → Category → Product */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            color: hasBackgroundImage ? MUTED : CREAM,
            gap: { xs: 0.5, sm: 0.75, md: pdpHeroBreadcrumbGap },
            flexWrap: "wrap",
            rowGap: 0.25,
          }}
        >
          <Typography
            component={RouterLink}
            to="/"
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: { xs: 11, sm: 12, md: furnitureHeroBreadcrumbFontSize },
              lineHeight: 1.2,
              textTransform: "uppercase",
              color: "inherit",
              textDecoration: "none",
              letterSpacing: "0.04em",
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
              fontSize: { xs: 11, sm: 12, md: furnitureHeroBreadcrumbFontSize },
              lineHeight: 1.2,
              textTransform: "uppercase",
              color: "inherit",
              textDecoration: "none",
              letterSpacing: "0.04em",
              "&:hover": { opacity: 0.9 },
            }}
          >
            {categoryLabel}
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "contents" } }}>
            <BreadcrumbArrow />
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 600,
                fontSize: { sm: 12, md: furnitureHeroBreadcrumbFontSize },
                lineHeight: 1.2,
                textTransform: "uppercase",
                color: "inherit",
                opacity: 0.5,
                maxWidth: { sm: 280, md: "none" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                letterSpacing: "0.04em",
              }}
            >
              {productName}
            </Typography>
          </Box>
        </Stack>

        {/* Badge + title */}
        <Stack
          sx={{
            mt: { xs: 1.25, sm: 1.75, md: pdpHeroBreadcrumbToContentGap },
            gap: { xs: 0.75, sm: 1.25, md: pdpHeroBadgeToTitleGap },
            alignItems: "flex-start",
          }}
        >
          {theme && (
            <Box
              sx={{
                border: `1px solid ${hasBackgroundImage ? TAN : CREAM}`,
                borderRadius: { xs: 6, md: pdpHeroBadgeRadius },
                px: { xs: 1.25, sm: 1.75, md: pdpHeroBadgePadX },
                py: { xs: 0.5, sm: 0.75, md: pdpHeroBadgePadY },
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 600,
                  fontSize: { xs: 10, sm: 11, md: pdpHeroBadgeFontSize },
                  lineHeight: 1.2,
                  textTransform: "uppercase",
                  color: hasBackgroundImage ? MUTED : CREAM,
                  whiteSpace: "nowrap",
                  letterSpacing: "0.06em",
                }}
              >
                {`Theme | ${theme}`}
              </Typography>
            </Box>
          )}

          <Typography
            component="h1"
            sx={{
              fontFamily: FONT_SURGENA,
              fontWeight: 600,
              fontSize: {
                xs: "clamp(26px, 7.5vw, 36px)",
                sm: "clamp(34px, 6.5vw, 56px)",
                md: pdpHeroTitleSize,
              },
              lineHeight: { xs: 1.08, sm: 1.05, md: 1 },
              textTransform: "uppercase",
              color: ACCENT,
              wordBreak: "break-word",
              maxWidth: "100%",
            }}
          >
            {productName}
          </Typography>
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

      {/* Mobile: side-by-side overlapping hero images — furniture only */}
      {!hasBackgroundImage && heroImages.length > 0 && (
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
            px: { xs: layoutPaddingX.xs, sm: layoutPaddingX.sm },
            pb: 3,
            pt: 0,
            mx: "auto",
            width: "100%",
            maxWidth: 520,
            overflow: "visible",
          }}
        >
          {heroImages[0] && (
            <Box
              component="img"
              src={heroImages[0]}
              alt={`${productName} primary view`}
              sx={{
                width: heroImages[1] ? "58%" : "100%",
                maxWidth: heroImages[1] ? 280 : 420,
                height: "auto",
                maxHeight: "min(48vw, 260px)",
                objectFit: "contain",
                position: "relative",
                zIndex: 2,
                flexShrink: 0,
              }}
            />
          )}
          {heroImages[1] && (
            <Box
              component="img"
              src={heroImages[1]}
              alt={`${productName} alternate view`}
              sx={{
                width: "52%",
                maxWidth: 240,
                height: "auto",
                maxHeight: "min(40vw, 220px)",
                objectFit: "contain",
                position: "relative",
                zIndex: 1,
                flexShrink: 0,
                ml: heroImages[0] ? "-12%" : 0,
                alignSelf: "flex-start",
              }}
            />
          )}
        </Box>
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
        width: { xs: 14, sm: 16, md: "clamp(18px, 1.51vw, 29px)" },
        height: { xs: 6, sm: 7, md: "clamp(8px, 0.625vw, 12px)" },
        flexShrink: 0,
        opacity: 0.75,
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
