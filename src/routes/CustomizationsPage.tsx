import type React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "@tanstack/react-router";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import {
  customHeroDescMaxW,
  customHeroDescToNoteGap,
  customHeroMinH,
  customHeroTitleSize,
  customHowItWorksCardGap,
  customHowItWorksCardInnerGap,
  customHowItWorksCardMaxW,
  customHowItWorksCardPadX,
  customHowItWorksCardPadY,
  customHowItWorksCardRadius,
  customHowItWorksCardTitleSize,
  customHowItWorksColGap,
  customHowItWorksPhotoMaxW,
  customHowItWorksSectionPadX,
  customHowItWorksSectionPadY,
  customHowItWorksStepFontSize,
  customHowItWorksTitleSize,
  customHowItWorksTitleToCardsGap,
  furnitureHeroBodyFontSize,
  furnitureHeroBreadcrumbFontSize,
  furnitureHeroBreadcrumbToTitleGap,
  furnitureHeroTitleToBodyGap,
  layoutMarginX,
} from "../navDesignTokens";
import { layoutPaddingX } from "../layoutConstants";
import { CDN_HEROES, CDN_LIFESTYLE } from "../shopify/cdnImages";

const PAGE_BG = "#f3ede3";
const BODY_TEXT = "#4b4a4a";
const CARD_BORDER = "#ccbca6";

const HERO_TEXT = "#f3ede3";

const fluid1920Gap28 = "clamp(12px, 1.458vw, 28px)";
const fluidChevronW = "clamp(18px, 1.51vw, 29px)";
const fluidChevronH = "clamp(8px, 0.625vw, 12px)";

/**
 * Customizations landing page — Figma 1162:7 hero + 1162:8 how-it-works.
 */
export function CustomizationsPage() {
  return (
    <>
    <Box
      component="section"
      aria-label="Customizations"
      sx={{
        position: "relative",
        width: "100%",
        minHeight: customHeroMinH,
        overflow: "hidden",
        bgcolor: "#1a1410",
      }}
    >
      {/* Full-bleed background photo */}
      <Box
        component="img"
        src={CDN_HEROES["customizations-hero"]}
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

      {/* Scrim — matches CatalogHero gradient */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.38) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Text content — same structure as CatalogHero */}
      <Stack
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: customHeroMinH,
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
        {/* Breadcrumb: Home → Customizations */}
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
            Customizations
          </Typography>
        </Stack>

        {/* Title + description */}
        <Stack sx={{ width: "100%", gap: furnitureHeroTitleToBodyGap }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: FONT_SURGENA,
              fontWeight: 600,
              fontSize: customHeroTitleSize,
              lineHeight: 1.2,
              textTransform: "uppercase",
              color: HERO_TEXT,
              letterSpacing: "0.02em",
            }}
          >
            Customizations
          </Typography>

          <Stack sx={{ gap: customHeroDescToNoteGap, maxWidth: customHeroDescMaxW }}>
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 500,
                fontSize: furnitureHeroBodyFontSize,
                lineHeight: 1.4,
                color: HERO_TEXT,
              }}
            >
              Every home is personal. Your furniture and rugs should feel the same.
              <br />
              At Corners, we offer thoughtful, limited-scope customization to maintain design integrity and craftsmanship.
            </Typography>

            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 600,
                fontSize: furnitureHeroBodyFontSize,
                lineHeight: 1.4,
                color: HERO_TEXT,
              }}
            >
              Furniture upholstery can be customized. Rugs are fully custom-made to your space and palette.
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>

    {/* ── How It Works — Figma 1162:8 ── */}
    <Box
      component="section"
      aria-label="How It Works"
      sx={{ bgcolor: PAGE_BG, px: customHowItWorksSectionPadX, py: customHowItWorksSectionPadY }}
    >
      {/* Section title */}
      <Typography
        component="h2"
        sx={{
          fontFamily: FONT_SURGENA,
          fontWeight: 600,
          fontSize: customHowItWorksTitleSize,
          lineHeight: 1.2,
          textTransform: "uppercase",
          color: BODY_TEXT,
          mb: customHowItWorksTitleToCardsGap,
        }}
      >
        How It Works
      </Typography>

      {/* Two-column: steps (left) + photo (right) */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "flex-start" }}
        sx={{ gap: customHowItWorksColGap }}
      >
        {/* Step cards */}
        <Stack sx={{ gap: customHowItWorksCardGap, flex: "1 1 0", maxWidth: customHowItWorksCardMaxW }}>
          {HOW_IT_WORKS_STEPS.map((step) => (
            <Box
              key={step.number}
              sx={{
                border: `1px solid ${CARD_BORDER}`,
                borderRadius: customHowItWorksCardRadius,
                px: customHowItWorksCardPadX,
                py: customHowItWorksCardPadY,
                display: "flex",
                flexDirection: "column",
                gap: customHowItWorksCardInnerGap,
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 600,
                  fontSize: customHowItWorksStepFontSize,
                  lineHeight: 1.4,
                  color: BODY_TEXT,
                }}
              >
                Step - {step.number}
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_SURGENA,
                  fontWeight: 600,
                  fontSize: customHowItWorksCardTitleSize,
                  lineHeight: 1.4,
                  color: BODY_TEXT,
                }}
              >
                {step.title}
              </Typography>
              <Box sx={{ color: BODY_TEXT, opacity: 0.5 }}>
                {step.body}
              </Box>
            </Box>
          ))}
        </Stack>

        {/* Lifestyle photo */}
        <Box
          component="img"
          src={CDN_LIFESTYLE["how-it-works-photo"]}
          alt="Woman touching soft fluffy carpet"
          sx={{
            flex: "1 1 0",
            maxWidth: { xs: "100%", md: customHowItWorksPhotoMaxW },
            width: "100%",
            height: "auto",
            borderRadius: customHowItWorksCardRadius,
            objectFit: "cover",
            display: "block",
            alignSelf: { md: "stretch" },
          }}
        />
      </Stack>
    </Box>
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

const stepBodySx = {
  fontFamily: FONT_NAV,
  fontWeight: 500,
  fontSize: customHowItWorksStepFontSize,
  lineHeight: 1.4,
} as const;

const HOW_IT_WORKS_STEPS: {
  number: number;
  title: string;
  body: React.ReactNode;
}[] = [
  {
    number: 1,
    title: "Share Your Requirement",
    body: (
      <Typography sx={stepBodySx}>
        Tell us your requirements and our team guides you from there.
      </Typography>
    ),
  },
  {
    number: 2,
    title: "Quotation & Confirmation",
    body: (
      <Box sx={stepBodySx} component="div">
        <Typography sx={stepBodySx}>You receive:</Typography>
        <Box component="ul" sx={{ m: 0, pl: "24px" }}>
          <li><Typography sx={stepBodySx}>Final specification sheet</Typography></li>
          <li><Typography sx={stepBodySx}>Fabric / swatch suggestions</Typography></li>
          <li><Typography sx={stepBodySx}>Timeline &amp; pricing</Typography></li>
        </Box>
        <Typography sx={{ ...stepBodySx, mt: "0.6em" }}>
          Your order moves to production once confirmed.
        </Typography>
      </Box>
    ),
  },
  {
    number: 3,
    title: "Handcrafted Production",
    body: (
      <Typography sx={stepBodySx}>
        Your product is handcrafted by expert ateliers.
        <br /><br />
        <Box component="span" sx={{ fontWeight: 600 }}>Timeline: </Box>
        <Box component="span" sx={{ fontStyle: "italic" }}>4–8 weeks based on complexity.</Box>
      </Typography>
    ),
  },
  {
    number: 4,
    title: "Delivery & After-Care",
    body: (
      <Typography sx={stepBodySx}>
        We deliver your customised piece and guide you on placement and maintenance.
      </Typography>
    ),
  },
];
