import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "@tanstack/react-router";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import type { CatalogHeroConfig } from "../catalog/catalogPageTypes";
import {
  furnitureHeroBodyFontSize,
  furnitureHeroBodyMaxW,
  furnitureHeroBreadcrumbFontSize,
  furnitureHeroBreadcrumbToTitleGap,
  furnitureHeroMinHeight,
  furnitureHeroTitleSize,
  furnitureHeroTitleToBodyGap,
  layoutMarginX,
} from "../navDesignTokens";
import { layoutPaddingX } from "../layoutConstants";

const HERO_TEXT = "#f3ede3";

const fluid1920Gap28 = "clamp(12px, 1.458vw, 28px)";
const fluidChevronW = "clamp(18px, 1.51vw, 29px)";
const fluidChevronH = "clamp(8px, 0.625vw, 12px)";

type CatalogHeroProps = CatalogHeroConfig;

/**
 * Category / collection hero — Figma 990:4811 (photo), 990:4905 (breadcrumb + title + body).
 */
export function CatalogHero({
  sectionAriaLabel,
  title,
  breadcrumbCurrent,
  description,
  heroImageSrc,
  heroImageObjectPosition = "50% 42%",
}: CatalogHeroProps) {
  return (
    <Box
      component="section"
      aria-label={sectionAriaLabel}
      sx={{
        position: "relative",
        width: "100%",
        minHeight: furnitureHeroMinHeight,
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src={heroImageSrc}
        alt=""
        fetchPriority="high"
        loading="eager"
        decoding="async"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: heroImageObjectPosition,
          display: "block",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.28) 100%)",
          pointerEvents: "none",
        }}
      />

      <Stack
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: furnitureHeroMinHeight,
          px: {
            xs: layoutPaddingX.xs,
            sm: layoutPaddingX.sm,
            md: layoutMarginX,
          },
          pt: { xs: 10, sm: 12, md: 14 },
          pb: { xs: 6, md: 8 },
          boxSizing: "border-box",
          gap: furnitureHeroBreadcrumbToTitleGap,
          alignItems: "flex-start",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{ color: HERO_TEXT, gap: fluid1920Gap28 }}
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
          <BreadcrumbChevron />
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
            {breadcrumbCurrent}
          </Typography>
        </Stack>

        <Stack
          sx={{
            width: "100%",
            gap: furnitureHeroTitleToBodyGap,
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontFamily: FONT_SURGENA,
              fontWeight: 600,
              fontSize: furnitureHeroTitleSize,
              lineHeight: 1.2,
              textTransform: "uppercase",
              color: HERO_TEXT,
              letterSpacing: "0.02em",
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 500,
              fontSize: furnitureHeroBodyFontSize,
              lineHeight: 1.4,
              color: HERO_TEXT,
              maxWidth: furnitureHeroBodyMaxW,
            }}
          >
            {description}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

function BreadcrumbChevron() {
  return (
    <Box
      component="svg"
      viewBox="0 0 18 12"
      sx={{
        width: fluidChevronW,
        height: fluidChevronH,
        flexShrink: 0,
        opacity: 0.9,
      }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 2L12 6L6 10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}
