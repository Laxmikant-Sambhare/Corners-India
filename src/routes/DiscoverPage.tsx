import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "@tanstack/react-router";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import {
  discoverHeroDescMaxW,
  discoverHeroMinH,
  discoverPhilosophyBadgeMinW,
  discoverPhilosophyBadgePadX,
  discoverPhilosophyBadgePadY,
  discoverPhilosophyBadgeRadius,
  discoverPhilosophyBodyMaxW,
  discoverPhilosophyGap,
  discoverPhilosophyPadTop,
  discoverPhilosophyPadX,
  discoverPhilosophyTitleSize,
  furnitureHeroBodyFontSize,
  furnitureHeroBreadcrumbFontSize,
  layoutMarginX,
} from "../navDesignTokens";
import { layoutPaddingX } from "../layoutConstants";
import { CDN_HEROES } from "../shopify/cdnImages";
import { DiscoverStorySection } from "../components/DiscoverStorySection";
import { DiscoverJourneySection } from "../components/DiscoverJourneySection";

const PAGE_BG = "#f3ede3";
const BODY_TEXT = "#4b4a4a";
const BADGE_BG = "#ccbca6";
const BADGE_TEXT = "#f3ede3";
const HERO_TEXT = "#ffffff";

const fluidChevronW = "clamp(18px, 1.51vw, 29px)";
const fluidChevronH = "clamp(8px, 0.625vw, 12px)";
const fluidBreadcrumbGap = "clamp(12px, 1.458vw, 28px)";

/**
 * Discover Corners landing page — Figma 1165:401 hero + 1366:2758 philosophy band.
 */
export function DiscoverPage() {
  return (
    <>
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
        <Box
          component="img"
          src={CDN_HEROES["discover-hero"]}
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
            Corners is about emotional connection with personal spaces—especially the overlooked
            corners of a home. It's rooted in the belief that every corner holds a story—the places
            where life slows down and presence is felt.
          </Typography>
        </Stack>
      </Box>

      {/* ── Our Philosophy — Figma 1366:2758 (rug + story in DiscoverStorySection) ── */}
      <Box
        component="section"
        aria-labelledby="discover-philosophy-heading"
        sx={{
          bgcolor: PAGE_BG,
          overflow: "visible",
          px: {
            xs: layoutPaddingX.xs,
            sm: layoutPaddingX.sm,
            md: discoverPhilosophyPadX,
          },
          pt: discoverPhilosophyPadTop,
          pb: 0,
        }}
      >
        <Stack
          alignItems="center"
          sx={{
            width: "100%",
            maxWidth: discoverPhilosophyBodyMaxW,
            mx: "auto",
            gap: discoverPhilosophyGap,
          }}
        >
          <Box
            sx={{
              bgcolor: BADGE_BG,
              borderRadius: discoverPhilosophyBadgeRadius,
              px: discoverPhilosophyBadgePadX,
              py: discoverPhilosophyBadgePadY,
              minWidth: discoverPhilosophyBadgeMinW,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 600,
                fontSize: furnitureHeroBodyFontSize,
                lineHeight: 1,
                textTransform: "uppercase",
                color: BADGE_TEXT,
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              Our Philosophy
            </Typography>
          </Box>

          <Typography
            id="discover-philosophy-heading"
            component="h2"
            sx={{
              fontFamily: FONT_SURGENA,
              fontWeight: 600,
              fontSize: discoverPhilosophyTitleSize,
              lineHeight: 1.2,
              textTransform: "uppercase",
              color: BODY_TEXT,
              textAlign: "center",
              width: "100%",
            }}
          >
            Every Corner Holds a Story
          </Typography>

          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 500,
              fontSize: furnitureHeroBodyFontSize,
              lineHeight: 1.4,
              color: BODY_TEXT,
              textAlign: "center",
              width: "100%",
            }}
          >
            At Corners, we celebrate the emotional bond people share with their personal spaces. We
            design bespoke products that honour these intimate moments, because we believe every
            corner holds a story, a place where life slows down and presence is felt.
          </Typography>
        </Stack>
      </Box>

      <DiscoverStorySection />
      <DiscoverJourneySection />
    </>
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
