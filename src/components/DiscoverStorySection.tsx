import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import {
  discoverPhilosophyGap,
  discoverPhilosophyRugMaxW,
  discoverPhilosophyRugPadX,
  discoverStoryContentPadTop,
  discoverStoryPadBottom,
  discoverStoryPortraitRadius,
  discoverStoryRugRadius,
  discoverStorySofaRadius,
  discoverStorySubheadingSize,
  discoverStoryTextColGap,
  discoverStoryTitleSize,
  furnitureHeroBodyFontSize,
} from "../navDesignTokens";
import { layoutPaddingX } from "../layoutConstants";

const SECTION_BG = "#ccbca6";
const BODY_TEXT = "#4b4a4a";
const LIFESTYLE_RUG_FRAME_BG = "#f3ede3";

/** Editorial canvas height from Figma content start (2491) to sofa bottom (4119) = 1628px @ 1920. */
const EDITORIAL_H = 1628;
const EDITORIAL_W = 1920;

const STORY_PORTRAIT_SRC = "/discover/discover-story-portrait.png";
const STORY_RUG_SRC = "/discover/discover-story-rug.png";
const STORY_SOFA_SRC = "/discover/discover-story-sofa.png";
const PHILOSOPHY_RUG_SRC = "/discover/dsc00082-rug.png";

/** Native asset 4096×2731 — used to pull tan band up by exactly half the rendered rug height. */
const PHILOSOPHY_RUG_HEIGHT_RATIO = 2731 / 4096;

/** `100vw` minus total horizontal padding on the rug row (MUI spacing × 8px × 2 sides). */
const philosophyRugHalfOverlap = (horizontalPadPx: number) =>
  `calc(min(calc(100vw - ${horizontalPadPx}px), ${discoverPhilosophyRugMaxW}) * ${PHILOSOPHY_RUG_HEIGHT_RATIO} / 2)`;

const philosophyRugHalfOverlapMd = `calc(min(calc(100vw - 2 * ${discoverPhilosophyRugPadX}), ${discoverPhilosophyRugMaxW}) * ${PHILOSOPHY_RUG_HEIGHT_RATIO} / 2)`;

const bodyTextSx = {
  fontFamily: FONT_NAV,
  fontWeight: 500,
  fontSize: { xs: 13, sm: 14, md: furnitureHeroBodyFontSize },
  lineHeight: { xs: 1.6, md: 1.4 },
  color: BODY_TEXT,
} as const;

const headingSx = {
  fontFamily: FONT_SURGENA,
  fontWeight: 600,
  lineHeight: 1.2,
  textTransform: "uppercase",
  color: BODY_TEXT,
} as const;

/** Map Figma px on the 1920×1628 editorial canvas to percentage strings. */
const xPct = (px: number) => `${(px / EDITORIAL_W) * 100}%`;
const yPct = (px: number) => `${(px / EDITORIAL_H) * 100}%`;
const wPct = (px: number) => `${(px / EDITORIAL_W) * 100}%`;
const hPct = (px: number) => `${(px / EDITORIAL_H) * 100}%`;

/**
 * Discover Corners origin story — Figma 1366:2746 editorial band.
 * Desktop layout uses a proportional canvas so every element scales together.
 */
export function DiscoverStorySection() {
  const rugPadX = {
    xs: layoutPaddingX.xs,
    sm: layoutPaddingX.sm,
    md: discoverPhilosophyRugPadX,
  };

  return (
    <Box
      component="section"
      aria-labelledby="discover-story-heading"
      sx={{ position: "relative", overflow: "visible", m: 0 }}
    >
      {/* Philosophy rug (2745) — in flow; tan band covers bottom ~41% */}
      <Box
        sx={{
          position: "relative",
          zIndex: 0,
          mt: { xs: 2, sm: 3, md: discoverPhilosophyGap },
          display: "flex",
          justifyContent: "center",
          px: rugPadX,
        }}
      >
        <Box
          component="img"
          src={PHILOSOPHY_RUG_SRC}
          alt="Handcrafted Corners rug with organic cellular pattern"
          loading="eager"
          decoding="async"
          sx={{
            width: "100%",
            maxWidth: discoverPhilosophyRugMaxW,
            height: "auto",
            display: "block",
          }}
        />
      </Box>

      {/* Tan story band (2746) — bottom 50% of philosophy rug sits behind this band */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          mt: {
            xs: `calc(-1 * ${philosophyRugHalfOverlap(layoutPaddingX.xs * 16)})`,
            sm: `calc(-1 * ${philosophyRugHalfOverlap(layoutPaddingX.sm * 16)})`,
            md: `calc(-1 * ${philosophyRugHalfOverlapMd})`,
          },
          bgcolor: SECTION_BG,
          pt: { xs: 2, sm: 2.5, md: discoverStoryContentPadTop },
          pb: discoverStoryPadBottom,
          overflow: "hidden",
        }}
      >
        {/* ── Desktop editorial canvas — Figma positions @ 1920, height 1628 ── */}
        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            position: "relative",
            mx: "auto",
            width: "100%",
            maxWidth: EDITORIAL_W,
            aspectRatio: `${EDITORIAL_W} / ${EDITORIAL_H}`,
          }}
        >
          {/* Portrait (2763) — 127,0 520×567 */}
          <Box
            component="img"
            src={STORY_PORTRAIT_SRC}
            alt="Tanya and Subroto, founders of Corners"
            loading="eager"
            decoding="async"
            sx={{
              position: "absolute",
              top: 0,
              left: xPct(127),
              width: wPct(520),
              height: hPct(567),
              objectFit: "cover",
              borderRadius: discoverStoryPortraitRadius,
              display: "block",
            }}
          />

          {/* Headline (2750) — 770,0 862×210 */}
          <Typography
            id="discover-story-heading"
            component="h2"
            sx={{
              ...headingSx,
              position: "absolute",
              top: 0,
              left: xPct(770),
              width: wPct(862),
              fontSize: discoverStoryTitleSize,
            }}
          >
            It Started With Conversations About Home
          </Typography>

          {/* Lifestyle rug (2766) — 961,303 831×584 straight frame */}
          <Box
            sx={{
              position: "absolute",
              top: yPct(303),
              right: xPct(128),
              width: wPct(831),
              height: hPct(584),
              borderRadius: discoverStoryRugRadius,
              bgcolor: LIFESTYLE_RUG_FRAME_BG,
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={STORY_RUG_SRC}
              alt="Person relaxing on a textured Corners rug"
              loading="eager"
              decoding="async"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>

          {/* Intro copy (2747) — 258,674 542 wide */}
          <Typography
            sx={{
              ...bodyTextSx,
              position: "absolute",
              top: yPct(674),
              left: xPct(258),
              width: wPct(542),
            }}
          >
            Every now and then, Tanya and Subroto would find themselves deep in conversations
            about interior spaces — their impact, their emotions, and how creativity breathes life
            into them.
            <br />
            <br />
            Tanya, coming from the interior design industry, and Subroto, a creatively driven
            traveller who loves exploring and celebrating ideas, often discussed what could be done
            differently in the design world. One day, during one of those long brainstorming
            sessions, they began talking about how small changes in a space could completely
            transform its identity — how a story, an emotion, or a personal touch could elevate it.
          </Typography>

          {/* Sofa lifestyle (2785/2786) — masked frame 521,1044 440×584 */}
          <Box
            sx={{
              position: "absolute",
              top: yPct(1044),
              left: xPct(521),
              width: wPct(440),
              height: hPct(584),
              borderRadius: discoverStorySofaRadius,
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={STORY_SOFA_SRC}
              alt="Corners furniture in a styled living space"
              loading="eager"
              decoding="async"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "10% 24%",
                display: "block",
              }}
            />
          </Box>

          {/* Finding meaning (2752) — 1148,1044 514 wide */}
          <Stack
            sx={{
              position: "absolute",
              top: yPct(1044),
              left: xPct(1148),
              width: wPct(514),
              gap: discoverStoryTextColGap,
            }}
          >
            <Typography
              component="h3"
              sx={{ ...headingSx, fontSize: discoverStorySubheadingSize }}
            >
              Finding Meaning in the Little Spaces
            </Typography>

            <Stack sx={{ gap: 2 }}>
              <Typography sx={bodyTextSx}>
                They realized that many spaces lacked a story — a sense of belonging. What if we
                could add meaning to even an unused corner? That thought grew into endless
                discussions — about textiles that change the game, furniture that feels personal
                and invites emotion, and how a simple corner could reflect one&apos;s personality.
              </Typography>
              <Typography sx={bodyTextSx}>
                Soon, they began envisioning cozy setups — a lounge chair with a soft rug underneath,
                a lamp that glows warmly, artwork that speaks to you, textiles that tell a story.
                Every idea somehow circled back to corners — those little places in our homes where
                we sit, reflect, laugh, and simply be. That&apos;s when it clicked — why not call it
                Corners?
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* ── Mobile / tablet — stacked ── */}
        <Stack
          sx={{
            display: { xs: "flex", lg: "none" },
            gap: { xs: 2.5, sm: 3.5 },
            px: { xs: layoutPaddingX.xs, sm: layoutPaddingX.sm },
            pb: { xs: 4, sm: 5 },
          }}
        >
          <Typography
            id="discover-story-heading-mobile"
            component="h2"
            sx={{
              ...headingSx,
              fontSize: { xs: "clamp(20px, 5.5vw, 28px)", sm: discoverStoryTitleSize },
            }}
          >
            It Started With Conversations About Home
          </Typography>

          <Box
            component="img"
            src={STORY_PORTRAIT_SRC}
            alt="Tanya and Subroto, founders of Corners"
            loading="eager"
            sx={{
              width: "100%",
              borderRadius: discoverStoryPortraitRadius,
              display: "block",
            }}
          />

          <Box
            sx={{
              borderRadius: discoverStoryRugRadius,
              bgcolor: LIFESTYLE_RUG_FRAME_BG,
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={STORY_RUG_SRC}
              alt="Person relaxing on a textured Corners rug"
              loading="lazy"
              sx={{ width: "100%", height: "auto", display: "block" }}
            />
          </Box>

          <Typography sx={bodyTextSx}>
            Every now and then, Tanya and Subroto would find themselves deep in conversations about
            interior spaces — their impact, their emotions, and how creativity breathes life into
            them.
            <br />
            <br />
            Tanya, coming from the interior design industry, and Subroto, a creatively driven
            traveller who loves exploring and celebrating ideas, often discussed what could be done
            differently in the design world. One day, during one of those long brainstorming sessions,
            they began talking about how small changes in a space could completely transform its
            identity — how a story, an emotion, or a personal touch could elevate it.
          </Typography>

          <Box
            sx={{
              width: "100%",
              maxWidth: 440,
              aspectRatio: "440 / 584",
              borderRadius: discoverStorySofaRadius,
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={STORY_SOFA_SRC}
              alt="Corners furniture in a styled living space"
              loading="lazy"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "10% 24%",
                display: "block",
              }}
            />
          </Box>

          <Stack sx={{ gap: discoverStoryTextColGap }}>
            <Typography component="h3" sx={{ ...headingSx, fontSize: { xs: 18, sm: discoverStorySubheadingSize } }}>
              Finding Meaning in the Little Spaces
            </Typography>
            <Typography sx={bodyTextSx}>
              They realized that many spaces lacked a story — a sense of belonging. What if we could
              add meaning to even an unused corner? That thought grew into endless discussions —
              about textiles that change the game, furniture that feels personal and invites emotion,
              and how a simple corner could reflect one&apos;s personality.
            </Typography>
            <Typography sx={bodyTextSx}>
              Soon, they began envisioning cozy setups — a lounge chair with a soft rug underneath, a
              lamp that glows warmly, artwork that speaks to you, textiles that tell a story. Every
              idea somehow circled back to corners — those little places in our homes where we sit,
              reflect, laugh, and simply be. That&apos;s when it clicked — why not call it Corners?
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
