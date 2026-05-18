import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  carouselArrowPadding,
  carouselChevronSize,
  carouselDotActiveWidth,
  carouselDotInactiveSize,
  carouselDotPillRadius,
  carouselDotTrackHeight,
  carouselDotsGap,
  navbarMarginX,
} from "../navDesignTokens";
import { FeatureSpace } from "./FeatureSpace";

const SLIDES = [
  {
    src: "https://cdn.shopify.com/s/files/1/0990/0464/5681/files/hero_img-1.webp",
    alt: "Interior lounge scene showcasing Corners home styling",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0990/0464/5681/files/hero_img-2.webp",
    alt: "Curated living space and furnishings from Corners India",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0990/0464/5681/files/hero_img-3.webp",
    alt: "Warm interior styling and furnishings from Corners India",
  },
] as const;

const AUTO_MS = 6000;

const ACCENT = "#bc7e5a";
/** Inactive dots: filled circles (same family as former ring color). */
const DOT_INACTIVE_FILL = "rgba(243, 237, 227, 0.9)";

/**
 * Before the Explore block is measured, approximate pull-up (then replaced by measured height).
 */
const OVERLAP_MT_FALLBACK = { xs: -13, sm: -15, md: -18, lg: -21 } as const;

/** Fraction of Explore block height that overlaps the hero (remainder extends below). Desktop only. */
const EXPLORE_OVERLAP_ON_HERO_DESKTOP = 0.7;

/**
 * Approximate distance from top of hero to bottom of overlaid navbar (px), by breakpoint.
 * Aligns arrow controls between nav and Explore block. Tuned for compact mobile nav bar.
 */
const NAVBAR_BOTTOM_PX = { xs: 92, sm: 100, md: 96 } as const;

/** Space between Explore section top edge and carousel dots (px). */
const DOTS_GAP_ABOVE_EXPLORE = 42;

type Props = {
  /** Overlapping content (e.g. Explore category); renders above the hero image, below controls. */
  children?: ReactNode;
};

export function HeroCarousel({ children }: Props) {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const isSm = useMediaQuery(theme.breakpoints.up("sm"));
  /** Stacked hero → explore (no overlap). Matches compact navbar breakpoint. */
  const isStackedHeroLayout = useMediaQuery(theme.breakpoints.down("md"));
  const navBottomPx = isMd
    ? NAVBAR_BOTTOM_PX.md
    : isSm
      ? NAVBAR_BOTTOM_PX.sm
      : NAVBAR_BOTTOM_PX.xs;

  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const mediaRef = useRef<HTMLDivElement>(null);
  const exploreWrapRef = useRef<HTMLDivElement>(null);
  const [mediaHeight, setMediaHeight] = useState(0);
  const [exploreHeight, setExploreHeight] = useState(0);

  /** Vertical center for arrows: stacked layout uses visual center of hero only. */
  const controlsCenterY = useMemo(() => {
    const h = mediaHeight > 0 ? mediaHeight : 0;
    if (h <= 0) return undefined;

    if (isStackedHeroLayout) {
      return (navBottomPx + h - 12) / 2;
    }

    if (children != null && exploreHeight > 0) {
      const rawExploreTop = h - exploreHeight * EXPLORE_OVERLAP_ON_HERO_DESKTOP;
      const exploreTop = Math.min(
        Math.max(navBottomPx + 16, rawExploreTop),
        h - 24,
      );
      return (navBottomPx + exploreTop) / 2;
    }

    if (children != null) {
      return (navBottomPx + h) / 2;
    }

    return h / 2;
  }, [mediaHeight, exploreHeight, children, navBottomPx, isStackedHeroLayout]);

  /** Pagination: near bottom of hero on mobile; above overlapping Explore on desktop. */
  const dotsCenterY = useMemo(() => {
    const h = mediaHeight > 0 ? mediaHeight : 0;
    if (h <= 0) return undefined;

    if (isStackedHeroLayout) {
      return Math.max(navBottomPx + 36, h - 28);
    }

    if (children != null && exploreHeight > 0) {
      const exploreTop = h - exploreHeight * EXPLORE_OVERLAP_ON_HERO_DESKTOP;
      const y = exploreTop - DOTS_GAP_ABOVE_EXPLORE;
      return Math.max(navBottomPx + 28, Math.min(y, h - 16));
    }

    if (children != null) {
      return (navBottomPx + h) / 2;
    }

    return h * 0.88;
  }, [mediaHeight, exploreHeight, children, navBottomPx, isStackedHeroLayout]);

  const len = SLIDES.length;
  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % len) + len) % len);
    },
    [len],
  );

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % len);
  }, [len]);
  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + len) % len);
  }, [len]);

  useEffect(() => {
    if (reduceMotion) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % len);
    }, AUTO_MS);
    return () => window.clearInterval(t);
  }, [len, reduceMotion, index]);

  useLayoutEffect(() => {
    const el = mediaRef.current;
    if (!el) return;

    const measure = () => {
      setMediaHeight(el.getBoundingClientRect().height);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  /** One viewport width per slide; x is % of the track (len × viewport wide). */
  const trackXPercent = -(index * 100) / len;

  return (
    <Box
      role="region"
      aria-roledescription="carousel"
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
          }}
        >
          <motion.div
            style={{
              display: "flex",
              width: `${len * 100}%`,
              /** Fills subpixel gaps at slide edges during translate (avoids dark hairlines). */
              backgroundColor: "#F3EDE3",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
            initial={false}
            animate={{
              x: `${trackXPercent}%`,
            }}
            transition={{
              duration: reduceMotion ? 0.05 : 0.55,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            {SLIDES.map(({ src, alt }) => (
              <Box
                key={src}
                sx={{
                  flex: `0 0 ${100 / len}%`,
                  maxWidth: `${100 / len}%`,
                  minWidth: 0,
                  boxSizing: "border-box",
                  lineHeight: 0,
                  bgcolor: "background.default",
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={src}
                  alt={alt}
                  sx={{
                    width: "100%",
                    minWidth: "100%",
                    maxWidth: "100%",
                    height: "auto",
                    display: "block",
                    border: 0,
                    outline: 0,
                    verticalAlign: "bottom",
                  }}
                />
              </Box>
            ))}
          </motion.div>
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

      {/* Sit above the overlapping Explore card; sized to hero image only. Arrows inset matches navbar (280px @ 1920). */}
      <Box
        sx={{
          position: "absolute",
          zIndex: 2,
          left: 0,
          right: 0,
          top: 0,
          height: mediaHeight > 0 ? `${mediaHeight}px` : "min(56vh, 520px)",
          pointerEvents: "none",
        }}
      >
        <IconButton
          type="button"
          aria-label="Previous slide"
          onClick={prev}
          sx={{
            pointerEvents: "auto",
            position: "absolute",
            left: { xs: 8, sm: 12, md: navbarMarginX },
            top: controlsCenterY !== undefined ? `${controlsCenterY}px` : "50%",
            transform: "translateY(-50%)",
            p: carouselArrowPadding,
            minWidth: { xs: 44, sm: 40 },
            minHeight: { xs: 44, sm: 40 },
            boxSizing: "border-box",
            bgcolor: "#f3ede3",
            color: "#ccbca6",
            boxShadow: "none",
            borderRadius: "50%",
            "& svg": {
              width: carouselChevronSize,
              height: carouselChevronSize,
            },
            "@media (pointer: coarse)": {
              minWidth: 44,
              minHeight: 44,
            },
            "&:hover": { bgcolor: "#e8dfd4" },
          }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          type="button"
          aria-label="Next slide"
          onClick={next}
          sx={{
            pointerEvents: "auto",
            position: "absolute",
            right: { xs: 8, sm: 12, md: navbarMarginX },
            top: controlsCenterY !== undefined ? `${controlsCenterY}px` : "50%",
            transform: "translateY(-50%)",
            p: carouselArrowPadding,
            minWidth: { xs: 44, sm: 40 },
            minHeight: { xs: 44, sm: 40 },
            boxSizing: "border-box",
            bgcolor: "#f3ede3",
            color: "#ccbca6",
            boxShadow: "none",
            borderRadius: "50%",
            "& svg": {
              width: carouselChevronSize,
              height: carouselChevronSize,
            },
            "@media (pointer: coarse)": {
              minWidth: 44,
              minHeight: 44,
            },
            "&:hover": { bgcolor: "#e8dfd4" },
          }}
        >
          <ChevronRight />
        </IconButton>

        <Box
          sx={{
            pointerEvents: "auto",
            position: "absolute",
            left: "50%",
            top: dotsCenterY !== undefined ? `${dotsCenterY}px` : "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            gap: carouselDotsGap,
          }}
        >
          {SLIDES.map((slide, i) => (
            <Dot
              key={slide.src}
              active={i === index}
              onClick={() => goTo(i)}
              label={`Go to slide ${i + 1}`}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function Dot({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <Box
      component="button"
      type="button"
      aria-label={label}
      aria-current={active ? "true" : undefined}
      onClick={onClick}
      sx={{
        p: 0,
        m: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxSizing: "border-box",
        outline: "none",
        WebkitAppearance: "none",
        appearance: "none",
        minWidth: { xs: 44, sm: 40, md: 36 },
        minHeight: { xs: 44, sm: 40, md: 36 },
        touchAction: "manipulation",
        "&:focus-visible": {
          "& .hero-carousel-dot-visual": {
            boxShadow: `0 0 0 2px ${ACCENT}`,
          },
        },
      }}
    >
      <Box
        className="hero-carousel-dot-visual"
        sx={{
          transitionProperty: "min-width, width, background-color",
          transitionDuration: "0.25s",
          transitionTimingFunction: "ease",
          ...(active
            ? {
                width: carouselDotActiveWidth,
                height: carouselDotTrackHeight,
                minWidth: carouselDotActiveWidth,
                borderRadius: carouselDotPillRadius,
                bgcolor: ACCENT,
              }
            : {
                width: carouselDotInactiveSize,
                height: carouselDotInactiveSize,
                minWidth: carouselDotInactiveSize,
                borderRadius: "50%",
                bgcolor: DOT_INACTIVE_FILL,
              }),
        }}
      />
    </Box>
  );
}

function ChevronLeft() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 6L9 12L15 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
