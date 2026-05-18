import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { FONT_NAV } from "../fonts";
import { CDN_HEROES, CDN_LIFESTYLE, CDN_PRODUCTS } from "../shopify/cdnImages";
import type { CatalogProduct } from "../catalog/catalogPageTypes";
import { resolveProductImage } from "../shopify/cdnImages";
import { useShopifyProductHandleMap } from "../shopify/hooks";
import { ProductDetailModal } from "./ProductDetailModal";
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

const CHAIR_SRC = CDN_LIFESTYLE["spotlight-chair"];
const PRESS_STRIP_SRC = "/collections/press-as-seen.svg";
const PRESS_STRIP_ASPECT_RATIO = "1345.87 / 44.8";

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
  label: string;
  handle: string;
  fallback: CatalogProduct;
};

type HotspotDef = HotspotLayout & { product: CatalogProduct };

function resolveSpotlightProduct(
  layout: HotspotLayout,
  catalogByHandle: Map<string, CatalogProduct>,
): CatalogProduct {
  const live = catalogByHandle.get(layout.handle);
  const image =
    resolveProductImage(layout.handle, live?.image ?? null) ||
    layout.fallback.image;

  if (!live) {
    return { ...layout.fallback, image };
  }

  return {
    ...live,
    image,
    detail: live.detail
      ? {
          ...live.detail,
          gallery: image
            ? [image, ...live.detail.gallery.filter((u) => u !== image)]
            : live.detail.gallery,
        }
      : undefined,
  };
}

/** Figma node 1189:7 — Eira lifestyle photo (1921 × 1085 px) */
const EIRA_HOTSPOT_LAYOUTS: HotspotLayout[] = [
  {
    dot: { left: "36.0%", top: "43.1%" },
    card: { left: "37.8%", top: "16%", transformOrigin: "0% 72%" },
    label: "View Eira Chair",
    handle: "eira-chair",
    fallback: {
      name: "Eira Chair",
      price: "Rs. 50,000.00",
      badge: "Chair",
      image: CHAIR_SRC,
    },
  },
  {
    dot: { left: "65.3%", top: "64.3%" },
    card: { right: "36.2%", top: "44%", transformOrigin: "100% 50%" },
    label: "View Eira Table",
    handle: "eira-table",
    fallback: {
      name: "Eira Table",
      price: "Rs. 50,000.00",
      badge: "Table",
      image: CDN_LIFESTYLE["discover-product-1"],
    },
  },
  {
    dot: { left: "26.1%", top: "75.2%" },
    card: { left: "27.6%", bottom: "27%", transformOrigin: "0% 100%" },
    label: "View Eira Rug",
    handle: "eira-rug",
    fallback: {
      name: "Eira Rug",
      price: "Rs. 50,000.00",
      badge: "Rug",
      image: CDN_PRODUCTS["eira-rug-navy"],
    },
  },
];

/** Figma node 1193:8 — Dunari photo, cropped to 1920×1080 */
const DUNARI_HOTSPOT_LAYOUTS: HotspotLayout[] = [
  {
    dot: { left: "22.2%", top: "65.2%" },
    card: { left: "23.5%", top: "20%", transformOrigin: "0% 100%" },
    label: "View Dunari Ottoman",
    handle: "dunari-ottoman",
    fallback: {
      name: "Dunari Ottoman",
      price: "Rs. 50,000.00",
      badge: "Ottoman",
      image: CDN_LIFESTYLE["discover-product-5"],
    },
  },
  {
    dot: { left: "52.1%", top: "61.1%" },
    card: { right: "49.5%", top: "18%", transformOrigin: "100% 82%" },
    label: "View Dunari Chair",
    handle: "dunari-chair",
    fallback: {
      name: "Dunari Chair",
      price: "Rs. 50,000.00",
      badge: "Chair",
      image: CDN_LIFESTYLE["discover-product-4"],
    },
  },
  {
    dot: { left: "69.1%", top: "54.5%" },
    card: { right: "32.5%", top: "18%", transformOrigin: "100% 65%" },
    label: "View Dunari Table",
    handle: "dunari-table",
    fallback: {
      name: "Dunari Table",
      price: "Rs. 50,000.00",
      badge: "Table",
      image: CDN_LIFESTYLE["discover-product-3"],
    },
  },
  {
    dot: { left: "60.5%", top: "80.2%" },
    card: { right: "41%", bottom: "22%", transformOrigin: "100% 100%" },
    label: "View Dunari Rug",
    handle: "dunari-rug",
    fallback: {
      name: "Dunari Rug",
      price: "Rs. 50,000.00",
      badge: "Rug",
      image: CDN_PRODUCTS["dunari-rug"],
    },
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
    return layouts.map((layout) => ({
      ...layout,
      product: resolveSpotlightProduct(layout, catalogByHandle),
    }));
  }, [active, catalogByHandle]);

  function switchCollection(collection: "eira" | "dunari") {
    if (collection === active) return;
    setActive(collection);
    setActiveIdx(null);
  }

  function closeAll() {
    setActiveIdx(null);
  }

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
          height: collectionSpotlightFrameBarH,
          width: "100%",
          bgcolor: TAN,
        }}
      />

      {/* ── Hero image + interactive overlay ── */}
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
          alt=""
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

        {/* Overlay — inset: 0 so % positions match the image exactly */}
        <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {/* ── Click-outside backdrop: closes active dot when clicking image ── */}
          {activeIdx !== null && (
            <Box
              onClick={closeAll}
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 3,
                pointerEvents: "auto",
                cursor: "default",
              }}
            />
          )}

          {/* ── Product cards (one per hotspot, positioned near its dot) ── */}
          <AnimatePresence>
            {activeIdx !== null &&
              (() => {
                const hs = hotspots[activeIdx];
                return (
                  <Box
                    key={activeIdx}
                    component={motion.div}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ transformOrigin: hs.card.transformOrigin }}
                    sx={{
                      position: "absolute",
                      left: hs.card.left,
                      right: hs.card.right,
                      top: hs.card.top,
                      bottom: hs.card.bottom,
                      width: CARD_W,
                      pointerEvents: "auto",
                      zIndex: 5,
                    }}
                  >
                    <ProductBubble
                      product={hs.product}
                      onOpenModal={() => setModalProduct(hs.product)}
                    />
                  </Box>
                );
              })()}
          </AnimatePresence>

          {/* ── Hotspot dots ── */}
          {hotspots.map((hs, i) => (
            <HotspotDot
              key={hs.label}
              left={hs.dot.left}
              top={hs.dot.top}
              label={hs.label}
              active={activeIdx === i}
              reduceMotion={reduceMotion}
              onClick={() => setActiveIdx((prev) => (prev === i ? null : i))}
            />
          ))}

          {/* ── Collection pills ── */}
          <Box
            sx={{
              pointerEvents: "auto",
              position: "absolute",
              left: 0,
              right: 0,
              bottom: collectionSpotlightPillsInsetBottom,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: collectionSpotlightPillsGap,
              px: { xs: 2, sm: collectionSpotlightPadX },
              zIndex: 2,
            }}
          >
            <CollectionPill
              label="Dunari"
              active={active === "dunari"}
              onClick={() => switchCollection("dunari")}
            />
            <CollectionPill
              label="EIRA"
              active={active === "eira"}
              onClick={() => switchCollection("eira")}
            />
          </Box>
        </Box>
      </Box>

      {/* Bottom tan bar */}
      <Box
        sx={{
          height: collectionSpotlightFrameBarH,
          width: "100%",
          bgcolor: TAN,
        }}
      />

      {/* Press strip */}
      <Box
        component="aside"
        aria-label="As seen in the press"
        sx={{
          width: "90%",
          maxWidth: "90%",
          mx: "auto",
          bgcolor: featureSpaceBg,
          px: collectionSpotlightPadX,
          pt: pressStripPadTop,
          pb: pressStripPadBottom,
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
            width: "100%",
            maxWidth: "100%",
            height: "auto",
            aspectRatio: PRESS_STRIP_ASPECT_RATIO,
            display: "block",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
      </Box>

      {/* ── Product detail modal ── */}
      <ProductDetailModal
        open={modalProduct !== null}
        onClose={() => setModalProduct(null)}
        product={modalProduct}
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
  reduceMotion,
  onClick,
}: {
  left: string;
  top: string;
  label: string;
  active: boolean;
  reduceMotion: boolean;
  onClick: () => void;
}) {
  const SIZE = { xs: 28, sm: 32, md: 38 };

  return (
    <Box
      component="button"
      type="button"
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
        padding: 0,
        cursor: "pointer",
        zIndex: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Outer circle — pulses when idle, turns ACCENT when active */}
      <Box
        component={motion.div}
        animate={
          active
            ? {
                backgroundColor: ACCENT,
                scale: 1.1,
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
                  scale: [1, 1.22, 1],
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
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
        }
        sx={{
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          border: "1.5px solid",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: active
            ? "0 0 0 5px rgba(188,126,90,0.2)"
            : "0 2px 10px rgba(0,0,0,0.2)",
          transition: "box-shadow 0.25s ease",
        }}
      >
        {/* Inner white dot */}
        <Box
          component={motion.div}
          animate={{ scale: active ? 1.2 : 1 }}
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
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
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
          <Box
            component="img"
            src="/discover/heart.svg"
            alt=""
            sx={{
              width: spotlightCardHeartW,
              height: "auto",
              aspectRatio: "22.3996 / 19.5999",
              display: "block",
              flexShrink: 0,
              objectFit: "contain",
            }}
          />
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
        py: { xs: "10px", sm: "12px" },
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
      }}
    >
      {label}
    </Box>
  );
}
