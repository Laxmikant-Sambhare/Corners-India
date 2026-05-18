import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "@tanstack/react-router";
import { FONT_NAV } from "../fonts";
import {
  discoverHeroDescMaxW,
  discoverHeroMinH,
  furnitureHeroBreadcrumbFontSize,
  layoutMarginX,
} from "../navDesignTokens";
import { layoutPaddingX } from "../layoutConstants";

const HERO_TEXT = "#ffffff";

const fluidChevronW = "clamp(18px, 1.51vw, 29px)";
const fluidChevronH = "clamp(8px, 0.625vw, 12px)";
const fluidBreadcrumbGap = "clamp(12px, 1.458vw, 28px)";

/**
 * Discover Corners landing page — Figma 1165:401.
 * Full-bleed hero photo with breadcrumb overlay and bottom description.
 */
export function DiscoverPage() {
  return (
    <Box
      component="section"
      aria-label="Discover Corners"
      sx={{
        position: "relative",
        width: "100%",
        minHeight: discoverHeroMinH,
        overflow: "hidden",
        bgcolor: "#1a1814",
      }}
    >
      {/* Full-bleed background photo */}
      <Box
        component="img"
        src="https://cdn.shopify.com/s/files/1/0990/0464/5681/files/discover_hero.webp"
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
          objectPosition: "center center",
          display: "block",
        }}
      />

      {/* Content layer — breadcrumb top, description bottom */}
      <Stack
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: discoverHeroMinH,
          px: { xs: layoutPaddingX.xs, sm: layoutPaddingX.sm, md: layoutMarginX },
          pt: { xs: 10, sm: 12, md: 14 },
          pb: { xs: 6, md: "clamp(48px, 6.25vw, 120px)" },
          boxSizing: "border-box",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {/* Breadcrumb: Home → Discover Corners */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{ color: HERO_TEXT, gap: fluidBreadcrumbGap }}
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
              "&:hover": { opacity: 0.85 },
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
            Discover Corners
          </Typography>
        </Stack>

        {/* Description — centered at bottom */}
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 500,
            fontSize: furnitureHeroBreadcrumbFontSize,
            lineHeight: 1.4,
            color: HERO_TEXT,
            textAlign: "center",
            maxWidth: discoverHeroDescMaxW,
            alignSelf: "center",
          }}
        >
          Corners is about emotional connection with personal spaces. Especially the overlooked
          corners of a home. It's rooted in the belief that every corner holds a story, the places
          where life slows down and presence is felt.
        </Typography>
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
