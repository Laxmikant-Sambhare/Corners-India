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
const ACCENT = "#bc7e5a";

const HERO_TEXT = "#f3ede3";

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
          minHeight: {
            xs: "min(72vh, 520px)",
            sm: "min(78vh, 580px)",
            md: customHeroMinH,
          },
          overflow: "hidden",
          bgcolor: "#1a1410",
        }}
      >
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
            objectPosition: { xs: "58% center", md: "center center" },
            display: "block",
          }}
        />

        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            background: {
              xs: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.32) 50%, rgba(0,0,0,0.62) 100%)",
              md: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.38) 100%)",
            },
            pointerEvents: "none",
          }}
        />

        <Stack
          sx={{
            position: "relative",
            zIndex: 1,
            minHeight: {
              xs: "min(72vh, 520px)",
              sm: "min(78vh, 580px)",
              md: customHeroMinH,
            },
            px: {
              xs: layoutPaddingX.xs,
              sm: layoutPaddingX.sm,
              md: layoutMarginX,
            },
            pt: { xs: 10, sm: 12, md: 14 },
            pb: { xs: 4, sm: 5, md: 8 },
            boxSizing: "border-box",
            gap: {
              xs: 1.5,
              sm: 2.5,
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
                Customizations
              </Typography>
            </Box>
          </Stack>

          <Stack
            sx={{
              width: "100%",
              gap: { xs: 1.25, sm: 2, md: furnitureHeroTitleToBodyGap },
              maxWidth: { xs: "100%", md: customHeroDescMaxW },
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
                  md: customHeroTitleSize,
                },
                lineHeight: { xs: 1.08, md: 1.2 },
                textTransform: "uppercase",
                color: HERO_TEXT,
                letterSpacing: "0.02em",
              }}
            >
              Customizations
            </Typography>

            <Stack sx={{ gap: { xs: 1.25, sm: 1.5, md: customHeroDescToNoteGap } }}>
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 500,
                  fontSize: { xs: 13, sm: 14, md: furnitureHeroBodyFontSize },
                  lineHeight: { xs: 1.55, md: 1.4 },
                  color: HERO_TEXT,
                  opacity: 0.96,
                }}
              >
                Every home is personal. Your furniture and rugs should feel the same.
                At Corners, we offer thoughtful, limited-scope customization to maintain
                design integrity and craftsmanship.
              </Typography>

              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 600,
                  fontSize: { xs: 13, sm: 14, md: furnitureHeroBodyFontSize },
                  lineHeight: { xs: 1.55, md: 1.4 },
                  color: HERO_TEXT,
                  borderLeft: { xs: `2px solid ${ACCENT}`, md: "none" },
                  pl: { xs: 1.5, md: 0 },
                  opacity: 0.98,
                }}
              >
                Furniture upholstery can be customized. Rugs are fully custom-made to
                your space and palette.
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Box
        component="section"
        aria-label="How It Works"
        sx={{
          bgcolor: PAGE_BG,
          px: {
            xs: layoutPaddingX.xs,
            sm: layoutPaddingX.sm,
            md: customHowItWorksSectionPadX,
          },
          py: { xs: 5, sm: 6, md: customHowItWorksSectionPadY },
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontFamily: FONT_SURGENA,
            fontWeight: 600,
            fontSize: {
              xs: "clamp(26px, 7vw, 32px)",
              sm: 40,
              md: customHowItWorksTitleSize,
            },
            lineHeight: 1.2,
            textTransform: "uppercase",
            color: BODY_TEXT,
            textAlign: { xs: "center", md: "left" },
            mb: { xs: 2.5, sm: 3.5, md: customHowItWorksTitleToCardsGap },
          }}
        >
          How It Works
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "stretch", md: "flex-start" }}
          sx={{ gap: { xs: 3, sm: 4, md: customHowItWorksColGap } }}
        >
          <Box
            component="img"
            src={CDN_LIFESTYLE["how-it-works-photo"]}
            alt="Woman touching soft fluffy carpet"
            sx={{
              order: { xs: -1, md: 0 },
              flex: { md: "1 1 0" },
              width: "100%",
              maxWidth: { xs: "100%", md: customHowItWorksPhotoMaxW },
              aspectRatio: { xs: "4 / 3", sm: "16 / 10", md: "auto" },
              maxHeight: { xs: 260, sm: 340, md: "none" },
              height: { md: "auto" },
              borderRadius: customHowItWorksCardRadius,
              objectFit: "cover",
              display: "block",
              alignSelf: { md: "stretch" },
            }}
          />

          <Stack
            sx={{
              order: { xs: 0, md: 0 },
              gap: { xs: 1.5, sm: 2, md: customHowItWorksCardGap },
              flex: "1 1 0",
              maxWidth: { xs: "100%", md: customHowItWorksCardMaxW },
            }}
          >
            {HOW_IT_WORKS_STEPS.map((step) => (
              <Box
                key={step.number}
                sx={{
                  border: `1px solid ${CARD_BORDER}`,
                  borderRadius: customHowItWorksCardRadius,
                  px: { xs: 2, sm: 2.5, md: customHowItWorksCardPadX },
                  py: { xs: 2, sm: 2.5, md: customHowItWorksCardPadY },
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 1, sm: 1.25, md: customHowItWorksCardInnerGap },
                  bgcolor: "rgba(255,255,255,0.35)",
                }}
              >
                <Typography
                  sx={{
                    alignSelf: "flex-start",
                    fontFamily: FONT_NAV,
                    fontWeight: 600,
                    fontSize: { xs: 10, sm: 11, md: customHowItWorksStepFontSize },
                    lineHeight: 1.2,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: ACCENT,
                    px: { xs: 1, sm: 1.25 },
                    py: 0.375,
                    borderRadius: 999,
                    border: `1px solid rgba(188, 126, 90, 0.35)`,
                    bgcolor: "rgba(255,255,255, 0.55)",
                  }}
                >
                  Step {step.number}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_SURGENA,
                    fontWeight: 600,
                    fontSize: {
                      xs: 18,
                      sm: 20,
                      md: customHowItWorksCardTitleSize,
                    },
                    lineHeight: 1.35,
                    color: BODY_TEXT,
                  }}
                >
                  {step.title}
                </Typography>
                <Box sx={{ color: BODY_TEXT, opacity: 0.72 }}>{step.body}</Box>
              </Box>
            ))}
          </Stack>
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

const stepBodySx = {
  fontFamily: FONT_NAV,
  fontWeight: 500,
  fontSize: { xs: 13, sm: 14, md: customHowItWorksStepFontSize },
  lineHeight: 1.5,
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
        <Box component="ul" sx={{ m: 0, pl: { xs: "18px", md: "24px" } }}>
          <li>
            <Typography sx={stepBodySx}>Final specification sheet</Typography>
          </li>
          <li>
            <Typography sx={stepBodySx}>Fabric / swatch suggestions</Typography>
          </li>
          <li>
            <Typography sx={stepBodySx}>Timeline &amp; pricing</Typography>
          </li>
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
        <Box component="span" sx={{ display: "block", mt: 1 }}>
          <Box component="span" sx={{ fontWeight: 600 }}>
            Timeline:{" "}
          </Box>
          <Box component="span" sx={{ fontStyle: "italic" }}>
            4–8 weeks based on complexity.
          </Box>
        </Box>
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
