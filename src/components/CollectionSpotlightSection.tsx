import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FONT_NAV } from "../fonts";
import { layoutPaddingX } from "../layoutConstants";
import { CDN_HEROES } from "../shopify/cdnImages";
import type { CatalogProduct } from "../catalog/catalogPageTypes";
import { useShopifyProductHandleMap } from "../shopify/hooks";
import { ProductDetailModal } from "./ProductDetailModal";
import { WishlistHeartButton } from "./WishlistHeartButton";
import {
  collectionSpotlightFrameBarH,
  collectionSpotlightPadX,
  featureSpaceBg,
  pressStripPadBottom,
  pressStripPadTop,
  collectionSpotlightPillFontSize,
  collectionSpotlightPillsGap,
  collectionSpotlightPillsInsetBottom,
  spotlightCardBadgeFontSize,
  spotlightCardBadgePx,
  spotlightCardBadgePy,
  spotlightCardBadgeRadius,
  spotlightCardHeartW,
  spotlightCardImagePad,
  spotlightCardInnerPb,
  spotlightCardInnerPl,
  spotlightCardInnerPr,
  spotlightCardInnerPt,
  spotlightCardInnerRadius,
  spotlightCardMetaGap,
  spotlightCardOuterPad,
  spotlightCardOuterRadius,
  spotlightCardPriceSize,
  spotlightCardSectionGap,
  spotlightCardTitleSize,
  shopRadius,
} from "../navDesignTokens";

const PAGE_BG = "#f3ede3";
const MUTED = "#4b4a4a";
const ACCENT = "#bc7e5a";
const TAN = "#ccbca6";
const PILL_INACTIVE_BG = "rgba(212, 201, 184, 0.95)";

const HERO_SRC: Record<"eira" | "dunari", string> = {
  eira: CDN_HEROES["eira-collection-hero"],
  dunari: CDN_HEROES["dunari-collection-hero"],
};

const PRESS_STRIP_SRC = "/collections/press-as-seen.svg";

/**
 * Card width as a vw-clamped value (matches ~270 px at 1920 px).
 * Kept in JS so the scale-origin calculation stays consistent.
 */
const CARD_W = "clamp(195px, 14.5vw, 272px)";

/**
 * Dot positions are % of the photo's intrinsic dimensions (1921 × 1085 px)
 * derived from Figma artboard coordinates.
 *
 * Card positions keep each popup visually anchored to its dot and always
 * "away from centre" so cards never overlap the main subject.
 *
 * transformOrigin is the corner/edge of the card that touches the dot —
 * the card "grows from" that point, giving the bubble-pop feel.
 */
type HotspotLayout = {
  dot: { left: string; top: string };
  card: {
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
    transformOrigin: string;
  };
  handle: string;
};

type HotspotDef = HotspotLayout & { label: string; product: CatalogProduct };

/** Figma node 1189:7 — Eira lifestyle photo (1921 × 1085 px) */
const EIRA_HOTSPOT_LAYOUTS: HotspotLayout[] = [
  {
    dot: { left: "36.0%", top: "43.1%" },
    card: { left: "37.8%", top: "16%", transformOrigin: "0% 72%" },
    handle: "eira-chair",
  },
  {
    dot: { left: "65.3%", top: "64.3%" },
    card: { right: "36.2%", top: "44%", transformOrigin: "100% 50%" },
    handle: "eira-table",
  },
  {
    dot: { left: "26.1%", top: "75.2%" },
    card: { left: "27.6%", bottom: "27%", transformOrigin: "0% 100%" },
    handle: "eira-rug",
  },
];

/** Figma node 1193:8 — Dunari photo, cropped to 1920×1080 */
const DUNARI_HOTSPOT_LAYOUTS: HotspotLayout[] = [
  {
    dot: { left: "22.2%", top: "65.2%" },
    card: { left: "23.5%", top: "20%", transformOrigin: "0% 100%" },
    handle: "dunari-ottoman",
  },
  {
    dot: { left: "52.1%", top: "50%" },
    card: { right: "49.5%", top: "18%", transformOrigin: "100% 82%" },
    handle: "dunari-chair",
  },
  {
    dot: { left: "69.1%", top: "40%" },
    card: { right: "32.5%", top: "18%", transformOrigin: "100% 65%" },
    handle: "dunari-table",
  },
  {
    dot: { left: "60.5%", top: "80.2%" },
    card: { right: "41%", bottom: "22%", transformOrigin: "100% 100%" },
    handle: "biophilic-rug",
  },
];

const easeOut = [0.32, 0.72, 0, 1] as const;

function buildCardVariants(reduceMotion: boolean) {
  return {
    hidden: {
      scale: reduceMotion ? 1 : 0.18,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : { type: "spring" as const, stiffness: 440, damping: 30 },
    },
    exit: {
      scale: reduceMotion ? 1 : 0.22,
      opacity: 0,
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.17, ease: easeOut },
    },
  };
}

export function CollectionSpotlightSection() {
  const theme = useTheme();
  const isCompactSpotlight = useMediaQuery(theme.breakpoints.down("md"));
  const [active, setActive] = useState<"eira" | "dunari">("eira");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [modalProduct, setModalProduct] = useState<CatalogProduct | null>(null);
  const reduceMotion = useReducedMotion() === true;
  const cardVariants = buildCardVariants(reduceMotion);
  const catalogByHandle = useShopifyProductHandleMap();

  const heroSrc = HERO_SRC[active];

  const hotspots = useMemo((): HotspotDef[] => {
    const layouts =
      active === "dunari" ? DUNARI_HOTSPOT_LAYOUTS : EIRA_HOTSPOT_LAYOUTS;
    return layouts.flatMap((layout) => {
      const product = catalogByHandle.get(layout.handle);
      if (!product) return [];
      return [
        {
          ...layout,
          product,
          label: `View ${product.name}`,
        },
      ];
    });
  }, [active, catalogByHandle]);

  function switchCollection(collection: "eira" | "dunari") {
    if (collection === active) return;
    setActive(collection);
    setActiveIdx(null);
  }

  function closeAll() {
    setActiveIdx(null);
  }

  useEffect(() => {
    if (activeIdx === null) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-spotlight-popup]")) return;
      if (target.closest("[data-spotlight-hotspot]")) return;
      setActiveIdx(null);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [activeIdx]);

  const activeHotspot = activeIdx !== null ? hotspots[activeIdx] : null;

  return (
    <Box
      component="section"
      aria-label="Featured collections"
      sx={{
        width: "100%",
        maxWidth: "100%",
        bgcolor: TAN,
        boxSizing: "border-box",
      }}
    >
      {/* Top tan bar */}
      <Box
        sx={{
          height: { xs: 12, md: collectionSpotlightFrameBarH },
          width: "100%",
          bgcolor: TAN,
        }}
      />

      {/* Mobile / tablet: slim segmented switch (off the photo) */}
      <CollectionSegmentedToggle active={active} onSwitch={switchCollection} />

      {/* Hero + interactive hotspot overlay */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          lineHeight: 0,
          overflow: "hidden",
          bgcolor: featureSpaceBg,
        }}
      >
        <Box
          key={active}
          component={motion.img}
          src={heroSrc}
          alt={
            active === "eira"
              ? "Eira collection lifestyle scene"
              : "Dunari collection lifestyle scene"
          }
          loading="lazy"
          decoding="async"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeInOut" }}
          sx={{
            width: "100%",
            maxWidth: "100%",
            height: "auto",
            display: "block",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        >
          {activeIdx !== null && (
            <Box
              onClick={closeAll}
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 3,
                pointerEvents: "auto",
                cursor: "default",
                bgcolor: isCompactSpotlight
                  ? "rgba(75, 74, 74, 0.12)"
                  : "transparent",
              }}
            />
          )}

          {isCompactSpotlight ? (
            <AnimatePresence>
              {activeHotspot && (
                <Box
                  key={activeHotspot.handle}
                  component={motion.div}
                  data-spotlight-popup
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 32 }
                  }
                  sx={{
                    position: "absolute",
                    left: { xs: 12, sm: 16 },
                    right: { xs: 12, sm: 16 },
                    bottom: { xs: 14, sm: 16 },
                    zIndex: 5,
                    pointerEvents: "auto",
                  }}
                >
                  <MobileSpotlightCard
                    product={activeHotspot.product}
                    onOpenModal={() => setModalProduct(activeHotspot.product)}
                  />
                </Box>
              )}
            </AnimatePresence>
          ) : (
            <AnimatePresence>
              {activeHotspot && (
                <Box
                  key={activeIdx}
                  component={motion.div}
                  data-spotlight-popup
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ transformOrigin: activeHotspot.card.transformOrigin }}
                  sx={{
                    position: "absolute",
                    left: activeHotspot.card.left,
                    right: activeHotspot.card.right,
                    top: activeHotspot.card.top,
                    bottom: activeHotspot.card.bottom,
                    width: CARD_W,
                    pointerEvents: "auto",
                    zIndex: 5,
                  }}
                >
                  <ProductBubble
                    product={activeHotspot.product}
                    onOpenModal={() => setModalProduct(activeHotspot.product)}
                  />
                </Box>
              )}
            </AnimatePresence>
          )}

          {hotspots.map((hs, i) => (
            <HotspotDot
              key={hs.handle}
              left={hs.dot.left}
              top={hs.dot.top}
              label={hs.label}
              active={activeIdx === i}
              compact={isCompactSpotlight}
              reduceMotion={reduceMotion}
              onClick={() => setActiveIdx((prev) => (prev === i ? null : i))}
            />
          ))}

          {/* Desktop: collection pills on the photo */}
          <CollectionPillBar
            active={active}
            onSwitch={switchCollection}
            sx={{ display: { xs: "none", md: "flex" } }}
          />
        </Box>
      </Box>

      {/* Bottom tan bar */}
      <Box
        sx={{
          height: { xs: 12, md: collectionSpotlightFrameBarH },
          width: "100%",
          bgcolor: TAN,
        }}
      />

      {/* Press strip — compact on mobile/tablet; Figma spacing from lg */}
      <Box
        component="aside"
        aria-label="As seen in the press"
        sx={{
          width: "100%",
          mx: "auto",
          bgcolor: featureSpaceBg,
          px: {
            xs: layoutPaddingX.xs,
            sm: layoutPaddingX.sm,
            lg: collectionSpotlightPadX,
          },
          pt: { xs: 2, sm: 8, md: 12, lg: pressStripPadTop },
          pb: { xs: 2, sm: 8, md: 12, lg: pressStripPadBottom },
          boxSizing: "border-box",
        }}
      >
        <Box
          component="img"
          src={PRESS_STRIP_SRC}
          alt="Business Standard, Architectural Digest, Livingetc, YourStory, Vogue"
          loading="lazy"
          decoding="async"
          sx={{
            display: "block",
            width: "100%",
            maxWidth: "100%",
            height: "auto",
            mx: "auto",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
      </Box>

      <ProductDetailModal
        open={modalProduct !== null}
        onClose={() => setModalProduct(null)}
        product={modalProduct}
      />
    </Box>
  );
}

/* ── Mobile: compact card docked above collection pills ── */

function MobileSpotlightCard({
  product,
  onOpenModal,
}: {
  product: CatalogProduct;
  onOpenModal: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onOpenModal}
      aria-label={`View details for ${product.name}`}
      sx={{
        display: "flex",
        alignItems: "stretch",
        gap: 1.25,
        width: "100%",
        p: 1.25,
        bgcolor: PAGE_BG,
        border: `1px solid rgba(243, 237, 227, 0.95)`,
        borderRadius: spotlightCardOuterRadius,
        boxShadow: "0 12px 32px rgba(75, 74, 74, 0.22)",
        boxSizing: "border-box",
        cursor: "pointer",
        textAlign: "left",
        "&:active": { transform: "scale(0.99)" },
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          width: 84,
          height: 84,
          borderRadius: spotlightCardInnerRadius,
          overflow: "hidden",
          bgcolor: "rgba(204, 188, 166, 0.25)",
        }}
      >
        <Box
          component="img"
          src={product.image}
          alt=""
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 0.75,
          py: 0.25,
        }}
      >
        <Box
          sx={{
            alignSelf: "flex-start",
            bgcolor: TAN,
            color: PAGE_BG,
            px: spotlightCardBadgePx,
            py: spotlightCardBadgePy,
            borderRadius: spotlightCardBadgeRadius,
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: spotlightCardBadgeFontSize,
            lineHeight: 1,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          {product.badge}
        </Box>
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: { xs: 14, sm: 15 },
            textTransform: "uppercase",
            color: MUTED,
            lineHeight: 1.2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 500,
            fontSize: spotlightCardPriceSize,
            color: ACCENT,
            lineHeight: 1.2,
          }}
        >
          {product.price}
        </Typography>
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: spotlightCardBadgeFontSize,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: ACCENT,
            lineHeight: 1,
          }}
        >
          View details →
        </Typography>
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          alignSelf: "flex-start",
          pt: 0.25,
        }}
      >
        <WishlistHeartButton product={product} size={spotlightCardHeartW} />
      </Box>
    </Box>
  );
}

/* ── Mobile / tablet: segmented collection toggle ── */

const COLLECTION_OPTIONS = [
  { id: "dunari" as const, label: "Dunari" },
  { id: "eira" as const, label: "Eira" },
];

function CollectionSegmentedToggle({
  active,
  onSwitch,
}: {
  active: "eira" | "dunari";
  onSwitch: (collection: "eira" | "dunari") => void;
}) {
  return (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        flexDirection: "column",
        alignItems: "center",
        gap: 0.75,
        px: layoutPaddingX.xs,
        py: { xs: 1.25, sm: 1.5 },
        bgcolor: TAN,
      }}
    >
      <Box
        role="tablist"
        aria-label="Collection"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          p: 0.5,
          gap: 0.5,
          borderRadius: shopRadius,
          bgcolor: "rgba(255, 255, 255, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.65)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
        }}
      >
        {COLLECTION_OPTIONS.map(({ id, label }) => {
          const selected = active === id;
          return (
            <Box
              key={id}
              component="button"
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onSwitch(id)}
              sx={{
                px: { xs: 2.25, sm: 2.75 },
                py: 0.75,
                minHeight: 36,
                minWidth: { xs: 88, sm: 96 },
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: FONT_NAV,
                fontWeight: 600,
                fontSize: { xs: 11, sm: 12 },
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                lineHeight: 1,
                color: selected ? PAGE_BG : MUTED,
                bgcolor: selected ? ACCENT : "transparent",
                transition: "background-color 0.15s ease, color 0.15s ease",
                "&:active": { transform: "scale(0.98)" },
              }}
            >
              {label}
            </Box>
          );
        })}
      </Box>
      <Typography
        sx={{
          fontFamily: FONT_NAV,
          fontWeight: 500,
          fontSize: 11,
          lineHeight: 1.3,
          color: "rgba(75, 74, 74, 0.62)",
          textAlign: "center",
        }}
      >
        Tap a dot on the photo to shop
      </Typography>
    </Box>
  );
}

/* ── Desktop: collection pill bar (overlay on hero) ── */

function CollectionPillBar({
  active,
  onSwitch,
  sx,
}: {
  active: "eira" | "dunari";
  onSwitch: (collection: "eira" | "dunari") => void;
  sx?: object;
}) {
  return (
    <Box
      sx={{
        pointerEvents: "auto",
        position: "absolute",
        left: 0,
        right: 0,
        bottom: collectionSpotlightPillsInsetBottom,
        zIndex: 6,
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "center",
        gap: collectionSpotlightPillsGap,
        px: collectionSpotlightPadX,
        py: 0,
        ...sx,
      }}
    >
      <CollectionPill
        label="Dunari"
        active={active === "dunari"}
        onClick={() => onSwitch("dunari")}
      />
      <CollectionPill
        label="Eira"
        active={active === "eira"}
        onClick={() => onSwitch("eira")}
      />
    </Box>
  );
}

/* ── Hotspot dot ── */

function HotspotDot({
  left,
  top,
  label,
  active,
  compact = false,
  reduceMotion,
  onClick,
}: {
  left: string;
  top: string;
  label: string;
  active: boolean;
  compact?: boolean;
  reduceMotion: boolean;
  onClick: () => void;
}) {
  const visualSize = compact ? 22 : { xs: 28, sm: 32, md: 38 };
  const touchSize = compact ? 44 : undefined;
  const idlePulse = compact ? [1, 1.06, 1] : [1, 1.22, 1];
  const activeScale = compact ? 1.04 : 1.1;
  const activeRing = compact
    ? "0 0 0 3px rgba(188,126,90,0.18)"
    : "0 0 0 5px rgba(188,126,90,0.2)";

  return (
    <Box
      component="button"
      type="button"
      data-spotlight-hotspot
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      sx={{
        pointerEvents: "auto",
        position: "absolute",
        left,
        top,
        transform: "translate(-50%, -50%)",
        background: "none",
        border: "none",
        p: 0,
        cursor: "pointer",
        zIndex: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: touchSize,
        height: touchSize,
        minWidth: touchSize,
        minHeight: touchSize,
      }}
    >
      <Box
        component={motion.div}
        animate={
          active
            ? {
                backgroundColor: ACCENT,
                scale: activeScale,
                borderColor: ACCENT,
              }
            : reduceMotion
              ? {
                  backgroundColor: "rgba(255,255,255,0.52)",
                  scale: 1,
                  borderColor: "rgba(255,255,255,0.8)",
                }
              : {
                  backgroundColor: [
                    "rgba(255,255,255,0.42)",
                    "rgba(255,255,255,0.72)",
                    "rgba(255,255,255,0.42)",
                  ],
                  scale: idlePulse,
                  borderColor: [
                    "rgba(255,255,255,0.7)",
                    "rgba(255,255,255,1)",
                    "rgba(255,255,255,0.7)",
                  ],
                }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : active
              ? { type: "spring", stiffness: 360, damping: 26 }
              : {
                  duration: compact ? 2.6 : 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
        }
        sx={{
          width: visualSize,
          height: visualSize,
          borderRadius: "50%",
          border: compact ? "1px solid" : "1.5px solid",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: active
            ? activeRing
            : compact
              ? "0 1px 6px rgba(0,0,0,0.18)"
              : "0 2px 10px rgba(0,0,0,0.2)",
          transition: "box-shadow 0.25s ease",
        }}
      >
        <Box
          component={motion.div}
          animate={{ scale: active ? (compact ? 1.1 : 1.2) : 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 420, damping: 28 }
          }
          sx={{
            width: "36%",
            height: "36%",
            borderRadius: "50%",
            bgcolor: active ? "rgba(255,255,255,0.9)" : "#fff",
            boxShadow: compact ? "none" : "0 1px 4px rgba(0,0,0,0.15)",
          }}
        />
      </Box>
    </Box>
  );
}

/* ── Product bubble card ── */

function ProductBubble({
  product,
  onOpenModal,
}: {
  product: CatalogProduct;
  onOpenModal: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onOpenModal}
      aria-label={`View details for ${product.name}`}
      sx={{
        display: "block",
        width: "100%",
        background: "none",
        border: `1px solid ${PAGE_BG}`,
        borderRadius: spotlightCardOuterRadius,
        p: spotlightCardOuterPad,
        boxSizing: "border-box",
        cursor: "pointer",
        textAlign: "left",
        "&:hover .bubble-inner": { filter: "brightness(0.97)" },
      }}
    >
      <Box
        className="bubble-inner"
        sx={{
          bgcolor: PAGE_BG,
          borderRadius: spotlightCardInnerRadius,
          pt: spotlightCardInnerPt,
          pr: spotlightCardInnerPr,
          pb: spotlightCardInnerPb,
          pl: spotlightCardInnerPl,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: spotlightCardSectionGap,
          transition: "filter 0.15s ease",
        }}
      >
        {/* Badge + heart */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              bgcolor: TAN,
              color: PAGE_BG,
              px: spotlightCardBadgePx,
              py: spotlightCardBadgePy,
              borderRadius: spotlightCardBadgeRadius,
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: spotlightCardBadgeFontSize,
              lineHeight: 1,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            {product.badge}
          </Box>
          <WishlistHeartButton product={product} size={spotlightCardHeartW} />
        </Box>

        {/* Product image */}
        <Box sx={{ width: "100%", p: spotlightCardImagePad }}>
          <Box
            component="img"
            src={product.image}
            alt=""
            sx={{
              width: "100%",
              height: "auto",
              display: "block",
              verticalAlign: "top",
            }}
          />
        </Box>

        {/* Name + price + link */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: spotlightCardMetaGap,
          }}
        >
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: spotlightCardTitleSize,
              textTransform: "uppercase",
              color: MUTED,
              lineHeight: 1.15,
              whiteSpace: { xs: "normal", sm: "nowrap" },
              wordBreak: "break-word",
            }}
          >
            {product.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 500,
              fontSize: spotlightCardPriceSize,
              color: ACCENT,
              lineHeight: 1.2,
            }}
          >
            {product.price}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: spotlightCardBadgeFontSize,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: ACCENT,
              lineHeight: 1.2,
            }}
          >
            View details →
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

/* ── Collection pill ── */

function CollectionPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        px: collectionSpotlightPillsGap,
        py: "12px",
        minHeight: 44,
        borderRadius: shopRadius,
        fontFamily: FONT_NAV,
        fontWeight: 600,
        fontSize: collectionSpotlightPillFontSize,
        lineHeight: 1,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        textAlign: "center",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.15s ease",
        color: "#fff",
        ...(active ? { bgcolor: ACCENT } : { bgcolor: PILL_INACTIVE_BG }),
        "&:hover": { filter: "brightness(1.05)" },
        "&:active": { transform: "scale(0.98)" },
      }}
    >
      {label}
    </Box>
  );
}
