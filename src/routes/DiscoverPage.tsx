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
  furnitureHeroBreadcrumbToTitleGap,
  furnitureHeroTitleToBodyGap,
  layoutMarginX,
  shopRadius,
} from "../navDesignTokens";
import { layoutPaddingX } from "../layoutConstants";
import { CDN_HEROES } from "../shopify/cdnImages";
import { DiscoverStorySection } from "../components/DiscoverStorySection";
import { DiscoverJourneySection } from "../components/DiscoverJourneySection";

const PAGE_BG = "#f3ede3";
const BODY_TEXT = "#4b4a4a";
const HELPER_TEXT = "rgba(75, 74, 74, 0.72)";
const BADGE_BG = "#ccbca6";
const BADGE_TEXT = "#f3ede3";
const HERO_TEXT = "#f3ede3";
const ACCENT = "#bc7e5a";
const BORDER = "rgba(204,188,166,0.45)";

const MANIFESTO =
  "Corners is about emotional connection with personal spaces—especially the overlooked corners of a home. It's rooted in the belief that every corner holds a story—the places where life slows down and presence is felt.";

const frostedCardSx = {
  bgcolor: "rgba(255,255,255,0.42)",
  border: `1px solid ${BORDER}`,
  borderRadius: shopRadius,
  backdropFilter: "blur(6px)",
} as const;

const heroMinH = {
  xs: "min(72vh, 520px)",
  sm: "min(78vh, 580px)",
  md: discoverHeroMinH,
} as const;

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
          minHeight: heroMinH,
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
            objectPosition: { xs: "62% center", md: "center center" },
            display: "block",
          }}
        />

        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            background: {
              xs: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.68) 100%)",
              md: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.38) 100%)",
            },
            pointerEvents: "none",
          }}
        />

        <Stack
          sx={{
            position: "relative",
            zIndex: 1,
            minHeight: heroMinH,
            px: {
              xs: layoutPaddingX.xs,
              sm: layoutPaddingX.sm,
              md: layoutMarginX,
            },
            pt: { xs: 10, sm: 12, md: 14 },
            pb: { xs: 4, sm: 5, md: "clamp(48px, 6.25vw, 120px)" },
            boxSizing: "border-box",
            gap: {
              xs: 1.5,
              sm: 2.5,
              md: furnitureHeroBreadcrumbToTitleGap,
            },
            alignItems: "flex-start",
            justifyContent: { xs: "flex-end", md: "space-between" },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              color: HERO_TEXT,
              gap: { xs: 0.5, sm: 0.75, md: "clamp(12px, 1.458vw, 28px)" },
            }}
          >
            <Typography
              component={RouterLink}
              to="/"
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 600,
                fontSize: {
                  xs: 11,
                  sm: 12,
                  md: furnitureHeroBreadcrumbFontSize,
                },
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
            <Box sx={{ display: { xs: "none", sm: "contents" } }}>
              <BreadcrumbChevron />
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 600,
                  fontSize: { sm: 12, md: furnitureHeroBreadcrumbFontSize },
                  lineHeight: 1.2,
                  textTransform: "uppercase",
                  color: "inherit",
                  opacity: 0.5,
                  letterSpacing: "0.04em",
                }}
              >
                Discover Corners
              </Typography>
            </Box>
          </Stack>

          <Stack
            sx={{
              width: "100%",
              gap: { xs: 1.25, sm: 2, md: furnitureHeroTitleToBodyGap },
              maxWidth: { xs: "100%", md: discoverHeroDescMaxW },
              alignSelf: { xs: "stretch", md: "center" },
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontFamily: FONT_SURGENA,
                fontWeight: 600,
                fontSize: {
                  xs: "clamp(28px, 8vw, 40px)",
                  sm: "clamp(36px, 6vw, 52px)",
                  md: "clamp(40px, 4vw, 56px)",
                },
                lineHeight: { xs: 1.08, md: 1.15 },
                textTransform: "uppercase",
                color: HERO_TEXT,
                letterSpacing: "0.02em",
                textAlign: { xs: "left", md: "center" },
                alignSelf: { md: "center" },
              }}
            >
              Discover Corners
            </Typography>

            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 500,
                fontSize: { xs: 13, sm: 14, md: furnitureHeroBreadcrumbFontSize },
                lineHeight: { xs: 1.55, md: 1.4 },
                color: HERO_TEXT,
                opacity: 0.96,
                textAlign: { xs: "left", md: "center" },
                maxWidth: { md: discoverHeroDescMaxW },
                alignSelf: { md: "center" },
              }}
            >
              {MANIFESTO}
            </Typography>
          </Stack>
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
          pt: { xs: 4, sm: 5, md: discoverPhilosophyPadTop },
          pb: { xs: 1, md: 0 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: discoverPhilosophyBodyMaxW,
            mx: "auto",
            ...frostedCardSx,
            px: { xs: 2.5, sm: 3, md: 0 },
            py: { xs: 2.5, sm: 3, md: 0 },
            bgcolor: {
              xs: frostedCardSx.bgcolor,
              md: "transparent",
            },
            border: { xs: frostedCardSx.border, md: "none" },
            backdropFilter: { xs: frostedCardSx.backdropFilter, md: "none" },
          }}
        >
          <Stack
            alignItems="center"
            sx={{
              width: "100%",
              gap: { xs: 1.5, sm: 2, md: discoverPhilosophyGap },
            }}
          >
            <Box
              sx={{
                width: { xs: 28, sm: 32 },
                height: "2px",
                bgcolor: ACCENT,
                borderRadius: "1px",
                alignSelf: { xs: "flex-start", md: "center" },
              }}
            />

            <Box
              sx={{
                bgcolor: BADGE_BG,
                borderRadius: { xs: shopRadius, md: discoverPhilosophyBadgeRadius },
                px: {
                  xs: 1.5,
                  sm: discoverPhilosophyBadgePadX,
                },
                py: {
                  xs: 0.75,
                  sm: discoverPhilosophyBadgePadY,
                },
                minWidth: { xs: "auto", md: discoverPhilosophyBadgeMinW },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: { xs: "flex-start", md: "center" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 600,
                  fontSize: { xs: 10, sm: 11, md: furnitureHeroBodyFontSize },
                  lineHeight: 1,
                  textTransform: "uppercase",
                  color: BADGE_TEXT,
                  textAlign: "center",
                  letterSpacing: "0.06em",
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
                fontSize: {
                  xs: "clamp(22px, 6.5vw, 32px)",
                  sm: "clamp(28px, 5vw, 44px)",
                  md: discoverPhilosophyTitleSize,
                },
                lineHeight: 1.15,
                textTransform: "uppercase",
                color: BODY_TEXT,
                textAlign: { xs: "left", md: "center" },
                width: "100%",
                letterSpacing: "0.01em",
              }}
            >
              Every Corner Holds a Story
            </Typography>

            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 500,
                fontSize: { xs: 13, sm: 14, md: furnitureHeroBodyFontSize },
                lineHeight: { xs: 1.6, md: 1.4 },
                color: { xs: HELPER_TEXT, md: BODY_TEXT },
                textAlign: { xs: "left", md: "center" },
                width: "100%",
              }}
            >
              At Corners, we celebrate the emotional bond people share with their personal spaces.
              We design bespoke products that honour these intimate moments, because we believe
              every corner holds a story—a place where life slows down and presence is felt.
            </Typography>
          </Stack>
        </Box>
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
        width: { xs: 14, sm: 16, md: "clamp(18px, 1.51vw, 29px)" },
        height: { xs: 6, sm: 7, md: "clamp(8px, 0.625vw, 12px)" },
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
