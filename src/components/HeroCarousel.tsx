import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { FeatureSpace } from "./FeatureSpace";

const HERO_VIDEO_SRC = "/discover/hero_section_video.mp4";

/**
 * Before the Explore block is measured, approximate pull-up (then replaced by measured height).
 */
const OVERLAP_MT_FALLBACK = { xs: -13, sm: -15, md: -18, lg: -21 } as const;

/** Fraction of Explore block height that overlaps the hero (remainder extends below). Desktop only. */
const EXPLORE_OVERLAP_ON_HERO_DESKTOP = 0.7;

type Props = {
  /** Overlapping content (e.g. Explore category); renders above the hero video, below controls. */
  children?: ReactNode;
};

export function HeroCarousel({ children }: Props) {
  const theme = useTheme();
  const isStackedHeroLayout = useMediaQuery(theme.breakpoints.down("md"));

  const mediaRef = useRef<HTMLDivElement>(null);
  const exploreWrapRef = useRef<HTMLDivElement>(null);
  const [exploreHeight, setExploreHeight] = useState(0);

  useLayoutEffect(() => {
    if (children == null) return;
    const el = exploreWrapRef.current;
    if (!el) return;

    const measure = () => {
      setExploreHeight(el.getBoundingClientRect().height);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  return (
    <Box
      role="region"
      aria-label="Featured home imagery"
      sx={{
        position: "relative",
        width: "100%",
        minWidth: "100%",
        maxWidth: "100%",
        bgcolor: "background.default",
        overflow: "visible",
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 0,
          width: "100%",
        }}
      >
        <Box
          ref={mediaRef}
          sx={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            lineHeight: 0,
            bgcolor: "#F3EDE3",
          }}
        >
          <Box
            component="video"
            src={HERO_VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            aria-label="Interior home styling from Corners India"
            sx={{
              width: "100%",
              minWidth: "100%",
              maxWidth: "100%",
              height: "auto",
              display: "block",
              border: 0,
              outline: 0,
              verticalAlign: "bottom",
              objectFit: "cover",
            }}
          />
        </Box>
        <FeatureSpace
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "100%",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      </Box>

      {children != null && (
        <Box
          ref={exploreWrapRef}
          sx={(t) => ({
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            mt: isStackedHeroLayout
              ? { xs: 2, sm: 2.5 }
              : exploreHeight > 0
                ? `${-exploreHeight * EXPLORE_OVERLAP_ON_HERO_DESKTOP}px`
                : {
                    xs: t.spacing(OVERLAP_MT_FALLBACK.xs),
                    sm: t.spacing(OVERLAP_MT_FALLBACK.sm),
                    md: t.spacing(OVERLAP_MT_FALLBACK.md),
                    lg: t.spacing(OVERLAP_MT_FALLBACK.lg),
                  },
          })}
        >
          {children}
        </Box>
      )}
    </Box>
  );
}
