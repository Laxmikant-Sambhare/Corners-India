import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import { layoutPaddingX } from "../layoutConstants";
import {
  discoverCollectionBodyFontSize,
  discoverCollectionBodyMaxW,
  discoverCollectionGap,
  discoverCollectionInnerMaxW,
  discoverCollectionPadX,
  discoverCollectionPadY,
  exploreHeadingFontSize,
  featureSpaceBg,
  fluid1920,
} from "../navDesignTokens";

const CREAM = "#F3EDE3";

const BODY_COPY =
  "Corners is about emotional connection with personal spaces—especially the overlooked corners of a home. It's rooted in the belief that every corner holds a story—the places where life slows down and presence is felt.";

/**
 * Figma `Frame 165` (990:4732) — full-width tan band, headline + manifesto.
 */
export function DiscoverCollectionSection() {
  return (
    <Box
      component="section"
      aria-labelledby="discover-collection-heading"
      sx={{
        width: "100%",
        maxWidth: "100%",
        bgcolor: featureSpaceBg,
        px: {
          xs: layoutPaddingX.xs,
          sm: layoutPaddingX.sm,
          md: discoverCollectionPadX,
        },
        py: { xs: 5, sm: 7, md: discoverCollectionPadY },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          mx: "auto",
          width: "100%",
          maxWidth: discoverCollectionInnerMaxW,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: { xs: "center", lg: "center" },
          justifyContent: "space-between",
          gap: { xs: 2, sm: 3, lg: discoverCollectionGap },
          textAlign: { xs: "center", lg: "left" },
        }}
      >
        <Typography
          id="discover-collection-heading"
          className="discover-collection-heading"
          component="h2"
          sx={{
            fontFamily: FONT_SURGENA,
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: {
              xs: "clamp(24px, 6.5vw, 32px)",
              sm: 36,
              md: 44,
              lg: exploreHeadingFontSize,
            },
            lineHeight: { xs: 1.15, md: 1.2 },
            letterSpacing: { xs: "0.02em", lg: "0.04em" },
            textTransform: "uppercase",
            color: CREAM,
            whiteSpace: { xs: "normal", md: "nowrap" },
            flexShrink: 0,
            flex: { lg: "0 0 auto" },
            width: { xs: "100%", lg: "auto" },
            maxWidth: "100%",
            wordBreak: "break-word",
          }}
        >
          Discover Collection
        </Typography>
        <Typography
          className="discover-collection-body"
          sx={{
            fontFamily: FONT_NAV,
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: {
              xs: fluid1920(14, { min: 14, max: 15 }),
              md: discoverCollectionBodyFontSize,
            },
            lineHeight: { xs: 1.55, md: 1.4 },
            color: CREAM,
            width: { xs: "100%", lg: "auto" },
            maxWidth: { xs: 480, lg: discoverCollectionBodyMaxW },
            flex: { lg: "0 1 auto" },
            opacity: { xs: 0.96, lg: 1 },
          }}
        >
          {BODY_COPY}
        </Typography>
      </Box>
    </Box>
  );
}
