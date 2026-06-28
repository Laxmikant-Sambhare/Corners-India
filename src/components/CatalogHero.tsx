import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "@tanstack/react-router";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import type { CatalogHeroConfig } from "../catalog/catalogPageTypes";
import { layoutPaddingX } from "../layoutConstants";
import {
  furnitureHeroBodyFontSize,
  furnitureHeroBodyMaxW,
  furnitureHeroBreadcrumbFontSize,
  furnitureHeroBreadcrumbToTitleGap,
  furnitureHeroTitleSize,
  furnitureHeroTitleToBodyGap,
  layoutMarginX,
} from "../navDesignTokens";

const HERO_TEXT = "#f3ede3";

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
}: CatalogHeroProps) {
  return (
    <Box
      component="section"
      aria-label={sectionAriaLabel}
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          lineHeight: 0,
          minHeight: { xs: "min(52vh, 380px)", sm: "min(58vh, 440px)", md: 0 },
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
            width: "100%",
            height: { xs: "100%", md: "auto" },
            minHeight: { xs: "min(52vh, 380px)", sm: "min(58vh, 440px)", md: 0 },
            objectFit: { xs: "cover", md: "fill" },
            objectPosition: { xs: "center 35%", md: "center center" },
            display: "block",
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            background: {
              xs: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.58) 100%)",
              md: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.28) 100%)",
            },
            pointerEvents: "none",
          }}
        />

        <Stack
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            px: {
              xs: layoutPaddingX.xs,
              sm: layoutPaddingX.sm,
              md: layoutMarginX,
            },
            pt: { xs: 10, sm: 12, md: 14 },
            pb: { xs: 3.5, sm: 5, md: 8 },
            boxSizing: "border-box",
            gap: {
              xs: 1.25,
              sm: 2,
              md: furnitureHeroBreadcrumbToTitleGap,
            },
            alignItems: "flex-start",
            justifyContent: { xs: "flex-end", md: "flex-start" },
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
                {breadcrumbCurrent}
              </Typography>
            </Box>
          </Stack>

          <Stack
            sx={{
              width: "100%",
              gap: { xs: 1, sm: 1.5, md: furnitureHeroTitleToBodyGap },
              maxWidth: { xs: "92%", sm: "85%", md: furnitureHeroBodyMaxW },
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
                  md: furnitureHeroTitleSize,
                },
                lineHeight: { xs: 1.08, md: 1.2 },
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
                fontSize: { xs: 13, sm: 14, md: furnitureHeroBodyFontSize },
                lineHeight: { xs: 1.55, md: 1.4 },
                color: HERO_TEXT,
                maxWidth: "100%",
                opacity: 0.96,
              }}
            >
              {description}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
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
        opacity: 0.75,
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
