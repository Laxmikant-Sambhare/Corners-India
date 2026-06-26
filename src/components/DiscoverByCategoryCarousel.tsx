import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useNavigate } from "@tanstack/react-router";
import type { CatalogProduct } from "../catalog/catalogPageTypes";
import { findCatalogProductByImage } from "../catalog/catalogPageConfig";
import { isShopifyConfigured } from "../shopify/client";
import {
  useShopifyProductHandleMap,
  useShopifyProducts,
} from "../shopify/hooks";
import { isRugProduct, shopifyToCatalogProduct } from "../shopify/mappers";
import { ProductDetailModal } from "./ProductDetailModal";
import { WishlistHeartButton } from "./WishlistHeartButton";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FONT_NAV, FONT_NAV_SHOP } from "../fonts";
import { CDN_LIFESTYLE, CDN_PRODUCTS } from "../shopify/cdnImages";
import {
  carouselChevronSize,
  discoverCardInnerGap,
  discoverCardPadX,
  discoverCardPadY,
  discoverCardRadius,
  discoverCardWidth,
  discoverCarouselGap,
  discoverImageBoxH,
  discoverMetaGap,
  discoverNavBtnSize,
  discoverNavIconPadding,
  discoverPriceSize,
  discoverProductTitleSize,
  discoverCarouselEdgePadX,
  discoverSectionPadX,
  discoverSectionPadY,
  discoverSeeMoreArrowHeight,
  discoverSeeMoreArrowWidth,
  discoverSeeMoreGap,
  discoverSeeMorePadX,
  discoverSeeMorePadY,
  discoverSeeMoreRadius,
  discoverTabGap,
  discoverTabsToCarouselGap,
  discoverTagPadX,
  discoverTagPadY,
  discoverTitleMaxWidth,
  discoverTitleToTabsGap,
  exploreHeadingFontSize,
  navFontSize,
  shopBorderWidth,
  shopRadius,
} from "../navDesignTokens";

const PAGE_BG = "#f3ede3";
const MUTED = "#4b4a4a";
const ACCENT = "#bc7e5a";
const TAN = "#ccbca6";

type DiscoverCarouselProduct = {
  handle: string;
  name: string;
  price: string;
  image: string;
  badge: string;
};

/** Editorial images until Shopify product media is uploaded. */
const EDITORIAL_IMAGE_BY_HANDLE: Record<string, string> = {
  "eira-table": CDN_LIFESTYLE["discover-product-1"],
  "eira-chair": CDN_LIFESTYLE["discover-product-2"],
  "dunari-table": CDN_LIFESTYLE["discover-product-3"],
  "dunari-chair": CDN_LIFESTYLE["discover-product-4"],
  "dunari-ottoman": CDN_LIFESTYLE["discover-product-5"],
  "dunari-rug": CDN_PRODUCTS["dunari-rug"],
  "eira-rug": CDN_PRODUCTS["eira-rug-navy"],
  "biophilic-rug": CDN_PRODUCTS["eira-rug-earth"],
};

type CategoryId = "rugs" | "furniture" | "all";

/** Static fallback when Shopify is loading or not configured. */
const FURNITURE_PRODUCTS: DiscoverCarouselProduct[] = [
  {
    handle: "eira-table",
    name: "Eira Table",
    price: "Rs. 50,000.00",
    image: EDITORIAL_IMAGE_BY_HANDLE["eira-table"]!,
    badge: "Table",
  },
  {
    handle: "eira-chair",
    name: "Eira Chair",
    price: "Rs. 50,000.00",
    image: EDITORIAL_IMAGE_BY_HANDLE["eira-chair"]!,
    badge: "Chair",
  },
  {
    handle: "dunari-table",
    name: "Dunari Table",
    price: "Rs. 50,000.00",
    image: EDITORIAL_IMAGE_BY_HANDLE["dunari-table"]!,
    badge: "Table",
  },
  {
    handle: "dunari-chair",
    name: "Dunari Chair",
    price: "Rs. 50,000.00",
    image: EDITORIAL_IMAGE_BY_HANDLE["dunari-chair"]!,
    badge: "Chair",
  },
  {
    handle: "dunari-ottoman",
    name: "Dunari Ottoman",
    price: "Rs. 50,000.00",
    image: EDITORIAL_IMAGE_BY_HANDLE["dunari-ottoman"]!,
    badge: "Ottoman",
  },
];

const RUGS_PRODUCTS: DiscoverCarouselProduct[] = [
  {
    handle: "dunari-rug",
    name: "Dunari Rug",
    price: "Rs. 50,000.00",
    image: EDITORIAL_IMAGE_BY_HANDLE["dunari-rug"]!,
    badge: "Rug",
  },
  {
    handle: "eira-rug",
    name: "Eira Rug",
    price: "Rs. 50,000.00",
    image: EDITORIAL_IMAGE_BY_HANDLE["eira-rug"]!,
    badge: "Rug",
  },
  {
    handle: "biophilic-rug",
    name: "Biophilic Rug",
    price: "Rs. 50,000.00",
    image: EDITORIAL_IMAGE_BY_HANDLE["biophilic-rug"]!,
    badge: "Rug",
  },
];

function staticProductsForCategory(
  category: CategoryId,
): DiscoverCarouselProduct[] {
  if (category === "rugs") return RUGS_PRODUCTS;
  if (category === "furniture") return FURNITURE_PRODUCTS;
  return [...FURNITURE_PRODUCTS, ...RUGS_PRODUCTS];
}

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "rugs", label: "Rugs" },
  { id: "furniture", label: "Furniture" },
  { id: "all", label: "View All" },
];

export function DiscoverByCategoryCarousel() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryId>("furniture");
  /** Last Rugs / Furniture choice — drives "View All" + "See more" when tab is View All. */
  const [plpTarget, setPlpTarget] = useState<"rugs" | "furniture">("furniture");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const updateScrollEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const eps = 2;
    setCanScrollLeft(scrollLeft > eps);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - eps);
  }, []);

  useLayoutEffect(() => {
    updateScrollEdges();
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScrollEdges);
    ro.observe(el);
    el.addEventListener("scroll", updateScrollEdges, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", updateScrollEdges);
    };
  }, [updateScrollEdges]);

  const seeMoreHref =
    category === "rugs" || category === "furniture"
      ? `/category/${category}`
      : `/category/${plpTarget}`;

  const {
    data: shopifyProducts,
    isSuccess,
    isLoading,
    isFetched,
  } = useShopifyProducts();
  const catalogByHandle = useShopifyProductHandleMap();

  /**
   * Live Shopify only when configured. Static mock is used only without `.env`.
   * Note: empty array from API means products are not published to Headless —
   * we do not fall back to mock in that case.
   */
  const visibleProducts = useMemo((): DiscoverCarouselProduct[] => {
    if (!isShopifyConfigured) {
      return staticProductsForCategory(category);
    }
    if (!isFetched || isLoading) {
      return [];
    }
    if (!isSuccess || !shopifyProducts) {
      return [];
    }

    const filtered = shopifyProducts.filter((p) => {
      const rug = isRugProduct(p);
      if (category === "rugs") return rug;
      if (category === "furniture") return !rug;
      return true;
    });

    return filtered.map((p) => {
      const catalog = shopifyToCatalogProduct(p);
      return {
        handle: p.handle,
        name: p.title,
        price: catalog.price,
        badge: catalog.badge,
        image: catalog.image || "",
      };
    });
  }, [shopifyProducts, category, isSuccess, isLoading, isFetched]);

  const showHeadlessEmptyHint =
    isShopifyConfigured && isSuccess && visibleProducts.length === 0;

  useLayoutEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0, behavior: "auto" });
    updateScrollEdges();
  }, [category, updateScrollEdges, visibleProducts]);

  const [detailProduct, setDetailProduct] = useState<CatalogProduct | null>(
    null,
  );

  const openProductDetail = useCallback(
    (p: DiscoverCarouselProduct) => {
      const live = catalogByHandle.get(p.handle);
      if (live) {
        setDetailProduct({
          ...live,
          image: p.image,
        });
        return;
      }
      setDetailProduct(
        findCatalogProductByImage(p.image) ?? {
          badge: p.badge,
          name: p.name,
          price: p.price,
          image: p.image,
        },
      );
    },
    [catalogByHandle],
  );

  const scrollByDir = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-discover-card]");
    if (!first) return;
    const gap = parseFloat(getComputedStyle(el).gap || "0") || 0;
    const step = first.offsetWidth + gap;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  return (
    <Box
      component="section"
      role="region"
      aria-label="Discover by category"
      sx={{
        width: "100%",
        maxWidth: "100%",
        bgcolor: PAGE_BG,
        /** Full-bleed horizontally; inset only on heading + tabs (see inner wrappers). */
        px: 0,
        py: discoverSectionPadY,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          px: discoverSectionPadX,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontFamily: FONT_NAV_SHOP,
            fontWeight: 600,
            fontSize: { xs: 28, sm: 40, md: 52, lg: exploreHeadingFontSize },
            lineHeight: 1.2,
            textAlign: "center",
            textTransform: "uppercase",
            color: MUTED,
            whiteSpace: { xs: "normal", sm: "nowrap" },
            maxWidth: { xs: "100%", sm: discoverTitleMaxWidth },
            px: { xs: 0.5, sm: 0 },
            wordBreak: "break-word",
          }}
        >
          Discover by Category
        </Typography>

        <Box
          sx={{
            width: "100%",
            mt: discoverTitleToTabsGap,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 2, sm: 2 },
          }}
        >
          <IconButton
            type="button"
            aria-label="Previous products"
            disabled={!canScrollLeft}
            onClick={() => scrollByDir(-1)}
            sx={{
              ...discoverNavIconBaseSx,
              order: { xs: 2, sm: 0 },
              alignSelf: { xs: "center", sm: "auto" },
              ...discoverNavIconVariantSx(!canScrollLeft),
            }}
          >
            <ChevronLeft filled={!canScrollLeft} />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: discoverTabGap,
              flex: 1,
              order: { xs: 0, sm: 1 },
            }}
          >
            {CATEGORIES.map(({ id, label }) => {
              const isActive = category === id;
              return (
                <Box
                  key={id}
                  component="button"
                  type="button"
                  onClick={() => {
                    if (id === "all") {
                      navigate({ to: `/category/${plpTarget}` });
                      return;
                    }
                    setCategory(id);
                    setPlpTarget(id);
                  }}
                  sx={{
                    cursor: "pointer",
                    border: isActive
                      ? "none"
                      : `${shopBorderWidth} solid ${TAN}`,
                    bgcolor: isActive ? ACCENT : "transparent",
                    color: isActive ? PAGE_BG : TAN,
                    px: discoverTagPadX,
                    py: discoverTagPadY,
                    borderRadius: shopRadius,
                    fontFamily: isActive ? FONT_NAV_SHOP : FONT_NAV,
                    fontWeight: 600,
                    fontSize: navFontSize,
                    textTransform: "uppercase",
                    lineHeight: 1,
                    transition: "background-color 0.2s, color 0.2s",
                  }}
                >
                  {label}
                </Box>
              );
            })}
          </Box>

          <IconButton
            type="button"
            aria-label="Next products"
            disabled={!canScrollRight}
            onClick={() => scrollByDir(1)}
            sx={{
              ...discoverNavIconBaseSx,
              order: { xs: 3, sm: 2 },
              alignSelf: { xs: "center", sm: "auto" },
              ...discoverNavIconVariantSx(!canScrollRight),
            }}
          >
            <ChevronRight filled={!canScrollRight} />
          </IconButton>
        </Box>
      </Box>

      {showHeadlessEmptyHint ? (
        <Typography
          sx={{
            mt: discoverTabsToCarouselGap,
            px: discoverSectionPadX,
            fontFamily: FONT_NAV,
            fontWeight: 500,
            fontSize: navFontSize,
            color: MUTED,
            textAlign: "center",
            maxWidth: 520,
            lineHeight: 1.6,
          }}
        >
          No products are visible on the Headless storefront yet. In Shopify
          Admin, open each product → Sales channels → enable{" "}
          <Box component="span" sx={{ fontWeight: 600 }}>
            Headless
          </Box>
          , then refresh this page.
        </Typography>
      ) : null}

      <Box
        ref={scrollerRef}
        role="group"
        aria-label="Product carousel"
        sx={{
          width: "100%",
          maxWidth: "100%",
          mt: discoverTabsToCarouselGap,
          display: "flex",
          flexDirection: "row",
          gap: discoverCarouselGap,
          overflowX: "auto",
          overflowY: "visible",
          scrollSnapType: "x mandatory",
          scrollPaddingLeft: discoverCarouselEdgePadX,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
          WebkitOverflowScrolling: "touch",
          pl: discoverCarouselEdgePadX,
          pr: 0,
          boxSizing: "border-box",
        }}
      >
        {visibleProducts.map((p) => (
            <Box
              key={p.handle}
              sx={{
                flex: `0 0 ${discoverCardWidth}`,
                maxWidth: discoverCardWidth,
                minWidth: 0,
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
              }}
            >
              <Box aria-hidden sx={{ height: 10, flexShrink: 0 }} />
              <Box
                role="button"
                data-discover-card
                onClick={() => openProductDetail(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openProductDetail(p);
                  }
                }}
                tabIndex={0}
                aria-label={`${p.name}, ${p.price}. Open details.`}
                sx={{
                  flex: 1,
                  borderRadius: discoverCardRadius,
                  border: `${shopBorderWidth} solid ${TAN}`,
                  boxSizing: "border-box",
                  px: discoverCardPadX,
                  py: discoverCardPadY,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: discoverCardInnerGap,
                  bgcolor: "transparent",
                  cursor: "pointer",
                  transition:
                    "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s ease, border-color 0.28s ease",
                  "@media (hover: hover)": {
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: ACCENT,
                      boxShadow: "0 14px 32px rgba(75, 74, 74, 0.12)",
                      "& .discover-card-image": {
                        transform: "scale(1.05)",
                      },
                      "& .discover-card-title": {
                        color: ACCENT,
                      },
                    },
                  },
                  "&:active": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    bgcolor: TAN,
                    color: PAGE_BG,
                    px: discoverTagPadX,
                    py: discoverTagPadY,
                    borderRadius: shopRadius,
                    fontFamily: FONT_NAV,
                    fontWeight: 600,
                    fontSize: navFontSize,
                    textTransform: "uppercase",
                    lineHeight: 1,
                  }}
                >
                  {p.badge}
                </Box>
                <WishlistHeartButton
                  product={{
                    badge: p.badge,
                    name: p.name,
                    price: p.price,
                    image: p.image,
                  }}
                />
              </Box>

              <Box
                sx={{
                  width: "100%",
                  height: discoverImageBoxH,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  mx: "auto",
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  className="discover-card-image"
                  src={p.image}
                  alt=""
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                    transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: discoverMetaGap,
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                <Typography
                  className="discover-card-title"
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 600,
                    fontSize: discoverProductTitleSize,
                    textTransform: "uppercase",
                    color: MUTED,
                    lineHeight: 1.2,
                    transition: "color 0.28s ease",
                  }}
                >
                  {p.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 500,
                    fontSize: discoverPriceSize,
                    textTransform: "capitalize",
                    color: ACCENT,
                  }}
                >
                  {p.price}
                </Typography>
              </Box>
              </Box>
              <Box aria-hidden sx={{ height: 20, flexShrink: 0 }} />
            </Box>
        ))}
        {/* trailing spacer — browsers clip padding-right on overflow flex, use a child instead */}
        <Box
          aria-hidden
          sx={{
            flexShrink: 0,
            width: discoverCarouselEdgePadX,
            minWidth: discoverCarouselEdgePadX,
            height: 1,
          }}
        />
      </Box>

      <Box
        sx={{
          mt: discoverTabsToCarouselGap,
          width: "100%",
          px: discoverSectionPadX,
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          component={RouterLink}
          to={seeMoreHref}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: discoverSeeMoreGap,
            px: discoverSeeMorePadX,
            py: discoverSeeMorePadY,
            borderRadius: discoverSeeMoreRadius,
            border: `${shopBorderWidth} solid ${TAN}`,
            color: TAN,
            textDecoration: "none",
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: discoverPriceSize,
            transition: "opacity 0.2s",
            "&:hover": { opacity: 0.85 },
          }}
        >
          See More Product
          <Box
            component="img"
            src="/discover/arrow-long.svg"
            alt=""
            sx={{
              width: discoverSeeMoreArrowWidth,
              height: discoverSeeMoreArrowHeight,
              display: "block",
            }}
          />
        </Box>
      </Box>

      <ProductDetailModal
        open={detailProduct !== null}
        onClose={() => setDetailProduct(null)}
        product={detailProduct}
      />
    </Box>
  );
}

const discoverNavIconBaseSx = {
  p: discoverNavIconPadding,
  width: discoverNavBtnSize,
  height: discoverNavBtnSize,
  boxSizing: "border-box" as const,
  flexShrink: 0,
  borderRadius: "50%",
  "& svg": {
    display: "block",
    flexShrink: 0,
    width: carouselChevronSize,
    height: carouselChevronSize,
  },
};

function discoverNavIconVariantSx(filled: boolean) {
  if (filled) {
    /** Solid tan disc + cream chevron (at scroll limit). */
    return {
      bgcolor: TAN,
      color: PAGE_BG,
      border: "none",
      boxShadow: "none",
      "&.Mui-disabled": {
        opacity: 1,
        bgcolor: TAN,
        color: PAGE_BG,
      },
    };
  }
  /** Thin tan ring, cream interior + tan chevron (can scroll). */
  return {
    bgcolor: PAGE_BG,
    color: TAN,
    border: `${shopBorderWidth} solid ${TAN}`,
    boxShadow: "none",
    "&:hover": {
      bgcolor: "rgba(204, 188, 166, 0.14)",
    },
  };
}

function ChevronLeft({ filled }: { filled: boolean }) {
  const stroke = filled ? PAGE_BG : TAN;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 6L9 12L15 18"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight({ filled }: { filled: boolean }) {
  const stroke = filled ? PAGE_BG : TAN;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6L15 12L9 18"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
