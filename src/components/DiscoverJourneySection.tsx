import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import {
  discoverJourneyBodyMaxW,
  discoverJourneyClosingMaxW,
  discoverJourneyClosingSize,
  discoverJourneyImageRadius,
  discoverJourneyLabelSize,
  discoverJourneyPadBottom,
  discoverJourneyPadTop,
  discoverJourneySparkleH,
  discoverJourneySparkleW,
  furnitureHeroBodyFontSize,
} from "../navDesignTokens";
import { layoutPaddingX } from "../layoutConstants";

const SECTION_BG = "#f3ede3";
const BODY_TEXT = "#4b4a4a";

/** Figma content band y=4434 → headline bottom y=6198 = 1764px tall @ 1920. */
const CANVAS_W = 1920;
const CANVAS_H = 1764;
const CANVAS_ORIGIN_Y = 4434;

const SKETCH_SRC = "/discover/discover-journey-sketch.png";
const YARN_MAN_SRC = "/discover/discover-journey-yarn-man.png";
const WORKSHOP_SRC = "/discover/discover-journey-workshop.png";
const LABEL_SRC = "/discover/discover-journey-label.png";
const DESK_SRC = "/discover/discover-journey-desk.png";
const SPARKLE_SRC = "/discover/discover-journey-sparkle.svg";

const bodyTextSx = {
  fontFamily: FONT_NAV,
  fontWeight: 500,
  fontSize: furnitureHeroBodyFontSize,
  lineHeight: 1.4,
  color: BODY_TEXT,
} as const;

const xPct = (px: number) => `${(px / CANVAS_W) * 100}%`;
const yPct = (py: number) => `${((py - CANVAS_ORIGIN_Y) / CANVAS_H) * 100}%`;
const wPct = (px: number) => `${(px / CANVAS_W) * 100}%`;
const hPct = (px: number) => `${(px / CANVAS_H) * 100}%`;

const framedImageSx = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  display: "block",
};

/**
 * Discover Corners journey band — Figma 1366:2652 cream editorial section.
 * Sits below the origin story and above the footer.
 */
export function DiscoverJourneySection() {
  return (
    <Box
      component="section"
      aria-labelledby="discover-journey-heading"
      sx={{
        position: "relative",
        bgcolor: SECTION_BG,
        pt: { lg: discoverJourneyPadTop, xs: 4 },
        pb: discoverJourneyPadBottom,
        overflow: "visible",
      }}
    >
      {/* ── Desktop editorial canvas @ 1920 ── */}
      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          position: "relative",
          mx: "auto",
          width: "100%",
          maxWidth: CANVAS_W,
          aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
        }}
      >
        {/* /corners journey (2756) + sparkle (2755) */}
        <Typography
          id="discover-journey-heading"
          sx={{
            position: "absolute",
            top: yPct(4434),
            left: xPct(258),
            fontFamily: FONT_SURGENA,
            fontWeight: 600,
            fontSize: discoverJourneyLabelSize,
            lineHeight: 1.2,
            textTransform: "uppercase",
            color: BODY_TEXT,
          }}
        >
          /corners journey
        </Typography>

        <Box
          component="img"
          src={SPARKLE_SRC}
          alt=""
          aria-hidden
          sx={{
            position: "absolute",
            top: yPct(4434),
            left: xPct(1118),
            width: discoverJourneySparkleW,
            height: discoverJourneySparkleH,
            display: "block",
          }}
        />

        {/* Design sketch (2773) — 547×436, bleeds left */}
        <Box
          sx={{
            position: "absolute",
            top: yPct(4563),
            left: xPct(-173),
            width: wPct(547),
            height: hPct(436),
            borderRadius: discoverJourneyImageRadius,
            overflow: "hidden",
          }}
        >
          <Box component="img" src={SKETCH_SRC} alt="Rug design sketch with yarn color samples" loading="eager" sx={framedImageSx} />
        </Box>

        {/* Intro body (2748) */}
        <Typography
          sx={{
            ...bodyTextSx,
            position: "absolute",
            top: yPct(4563),
            left: xPct(1118),
            width: wPct(387),
            maxWidth: discoverJourneyBodyMaxW,
          }}
        >
          Because these corners aren&apos;t just physical spaces — they&apos;re emotional ones.
          <br />
          <br />
          They hold memories, moments, and meanings. It&apos;s where we return — in joy, in thought,
          in celebration, or in comfort. It could be your reading nook, your chai spot, your music
          corner, or just that one cozy space that feels like you.
          <br />
          <br />
          And that&apos;s how Corners India was born — a brand that curates corner furniture, rugs,
          and décor that help people create their own meaningful spaces.
        </Typography>

        {/* Yarn samples (2779) — 356×477 */}
        <Box
          sx={{
            position: "absolute",
            top: yPct(4671),
            left: xPct(605),
            width: wPct(356),
            height: hPct(477),
            borderRadius: discoverJourneyImageRadius,
            overflow: "hidden",
          }}
        >
          <Box component="img" src={YARN_MAN_SRC} alt="Selecting yarn colors for a Corners rug" loading="eager" sx={framedImageSx} />
        </Box>

        {/* Workshop (2782) — 461×619 */}
        <Box
          sx={{
            position: "absolute",
            top: yPct(4973),
            left: xPct(887),
            width: wPct(461),
            height: hPct(619),
            borderRadius: discoverJourneyImageRadius,
            overflow: "hidden",
          }}
        >
          <Box component="img" src={WORKSHOP_SRC} alt="Corners furniture being crafted in the workshop" loading="eager" sx={framedImageSx} />
        </Box>

        {/* Woven label (2776) — 356×477, bleeds right */}
        <Box
          sx={{
            position: "absolute",
            top: yPct(4927),
            left: xPct(1662),
            width: wPct(356),
            height: hPct(477),
            borderRadius: discoverJourneyImageRadius,
            overflow: "hidden",
          }}
        >
          <Box component="img" src={LABEL_SRC} alt="Corners woven brand label detail" loading="eager" sx={framedImageSx} />
        </Box>

        {/* Color selection (2770) — 603×477 */}
        <Box
          sx={{
            position: "absolute",
            top: yPct(5426),
            left: xPct(127),
            width: wPct(603),
            height: hPct(477),
            borderRadius: discoverJourneyImageRadius,
            overflow: "hidden",
          }}
        >
          <Box component="img" src={DESK_SRC} alt="Reviewing rug color samples at the design studio" loading="eager" sx={framedImageSx} />
        </Box>

        {/* Closing lead-in (2749) */}
        <Typography
          sx={{
            ...bodyTextSx,
            position: "absolute",
            top: yPct(5749),
            left: xPct(1118),
            width: wPct(387),
            maxWidth: discoverJourneyBodyMaxW,
          }}
        >
          At Corners, we believe every home has that one favorite spot — not just a literal corner,
          but
        </Typography>

        {/* Closing headline (2751) */}
        <Typography
          component="p"
          sx={{
            position: "absolute",
            top: yPct(6050),
            left: xPct(334),
            width: wPct(1251),
            maxWidth: discoverJourneyClosingMaxW,
            fontFamily: FONT_SURGENA,
            fontWeight: 600,
            fontSize: discoverJourneyClosingSize,
            lineHeight: 1.2,
            textTransform: "uppercase",
            textAlign: "center",
            color: BODY_TEXT,
          }}
        >
          a place that feels like home within home. Our aim is to help you find yours.
        </Typography>
      </Box>

      {/* ── Mobile / tablet — stacked ── */}
      <Stack
        sx={{
          display: { xs: "flex", lg: "none" },
          gap: 4,
          px: { xs: layoutPaddingX.xs, sm: layoutPaddingX.sm },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography
            id="discover-journey-heading-mobile"
            sx={{
              fontFamily: FONT_SURGENA,
              fontWeight: 600,
              fontSize: discoverJourneyLabelSize,
              lineHeight: 1.2,
              textTransform: "uppercase",
              color: BODY_TEXT,
            }}
          >
            /corners journey
          </Typography>
          <Box
            component="img"
            src={SPARKLE_SRC}
            alt=""
            aria-hidden
            sx={{ width: discoverJourneySparkleW, height: discoverJourneySparkleH }}
          />
        </Stack>

        <Box sx={{ borderRadius: discoverJourneyImageRadius, overflow: "hidden" }}>
          <Box component="img" src={SKETCH_SRC} alt="Rug design sketch with yarn color samples" loading="eager" sx={{ width: "100%", height: "auto", display: "block" }} />
        </Box>

        <Typography sx={bodyTextSx}>
          Because these corners aren&apos;t just physical spaces — they&apos;re emotional ones.
          <br />
          <br />
          They hold memories, moments, and meanings. It&apos;s where we return — in joy, in thought,
          in celebration, or in comfort. It could be your reading nook, your chai spot, your music
          corner, or just that one cozy space that feels like you.
          <br />
          <br />
          And that&apos;s how Corners India was born — a brand that curates corner furniture, rugs,
          and décor that help people create their own meaningful spaces.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} sx={{ gap: 2 }}>
          <Box sx={{ flex: 1, borderRadius: discoverJourneyImageRadius, overflow: "hidden", aspectRatio: "356 / 477" }}>
            <Box component="img" src={YARN_MAN_SRC} alt="Selecting yarn colors for a Corners rug" loading="lazy" sx={framedImageSx} />
          </Box>
          <Box sx={{ flex: 1, borderRadius: discoverJourneyImageRadius, overflow: "hidden", aspectRatio: "461 / 619" }}>
            <Box component="img" src={WORKSHOP_SRC} alt="Corners furniture being crafted in the workshop" loading="lazy" sx={framedImageSx} />
          </Box>
          <Box sx={{ flex: 1, borderRadius: discoverJourneyImageRadius, overflow: "hidden", aspectRatio: "356 / 477" }}>
            <Box component="img" src={LABEL_SRC} alt="Corners woven brand label detail" loading="lazy" sx={framedImageSx} />
          </Box>
        </Stack>

        <Box sx={{ borderRadius: discoverJourneyImageRadius, overflow: "hidden", aspectRatio: "603 / 477" }}>
          <Box component="img" src={DESK_SRC} alt="Reviewing rug color samples at the design studio" loading="lazy" sx={framedImageSx} />
        </Box>

        <Typography sx={bodyTextSx}>
          At Corners, we believe every home has that one favorite spot — not just a literal corner,
          but
        </Typography>

        <Typography
          sx={{
            fontFamily: FONT_SURGENA,
            fontWeight: 600,
            fontSize: discoverJourneyClosingSize,
            lineHeight: 1.2,
            textTransform: "uppercase",
            textAlign: "center",
            color: BODY_TEXT,
          }}
        >
          a place that feels like home within home. Our aim is to help you find yours.
        </Typography>
      </Stack>
    </Box>
  );
}
