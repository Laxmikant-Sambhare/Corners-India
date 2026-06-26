import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import {
  discoverCollectionBodyFontSize,
  discoverCollectionBodyMaxW,
  discoverCollectionGap,
  discoverCollectionInnerMaxW,
  discoverCollectionPadX,
  discoverCollectionPadY,
  exploreHeadingFontSize,
  featureSpaceBg,
} from "../navDesignTokens";

const BODY_COPY =
  "Corners is about emotional connection with personal spaces. Especially the overlooked corners of a home. It's rooted in the belief that every corner holds a story, the places where life slows down and presence is felt.";

/** Full-width tan band below the home hero video — headline + manifesto. */
export function HomeIntroSection() {
  return (
    <Box
      component="section"
      aria-labelledby="home-intro-heading"
      sx={{
        width: "100%",
        maxWidth: "100%",
        bgcolor: featureSpaceBg,
        px: discoverCollectionPadX,
        py: discoverCollectionPadY,
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
          alignItems: { xs: "flex-start", lg: "center" },
          justifyContent: "space-between",
          gap: { xs: 3, sm: 4, lg: discoverCollectionGap },
        }}
      >
        <Typography
          id="home-intro-heading"
          component="h2"
          sx={{
            fontFamily: FONT_SURGENA,
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: {
              xs: 28,
              sm: 36,
              md: 44,
              lg: exploreHeadingFontSize,
            },
            lineHeight: "120%",
            textTransform: "uppercase",
            color: "#F3EDE3",
            whiteSpace: { xs: "normal", md: "nowrap" },
            flexShrink: 0,
            flex: { lg: "0 0 auto" },
            maxWidth: "100%",
            wordBreak: "break-word",
          }}
        >
          Corners
        </Typography>
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: discoverCollectionBodyFontSize,
            lineHeight: "140%",
            color: "#F3EDE3",
            maxWidth: { xs: "none", lg: discoverCollectionBodyMaxW },
            flex: { lg: "0 1 auto" },
          }}
        >
          {BODY_COPY}
        </Typography>
      </Box>
    </Box>
  );
}
