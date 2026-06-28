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
import {
  CatalogProductCard,
  catalogProductCardCarouselWidthSx,
} from "./CatalogProductCard";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FONT_NAV, FONT_NAV_SHOP } from "../fonts";
import { layoutPaddingX } from "../layoutConstants";
import { CDN_LIFESTYLE, CDN_PRODUCTS } from "../shopify/cdnImages";
import {
  carouselChevronSize,
  discoverCardRadius,
  discoverCarouselGap,
  discoverCarouselEdgePadX,
  discoverNavBtnSize,
  discoverNavIconPadding,
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

/** Responsive card width — matches PLP 2-col cell on mobile. */
const cardWidthSx = catalogProductCardCarouselWidthSx;

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

  const isLoadingProducts = isShopifyConfigured && (!isFetched || isLoading);

  const renderNavButton = (
    dir: -1 | 1,
    disabled: boolean,
    variant: "header" | "overlay",
  ) => {
    const isPrev = dir === -1;
    const label = isPrev ? "Previous products" : "Next products";
    return (
      <IconButton
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={() => scrollByDir(dir)}
        sx={{
          ...discoverNavIconBaseSx,
          ...(variant === "overlay"
            ? {
                display: { xs: "inline-flex", md: "none" },
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                ...(isPrev
                  ? { left: { xs: 4, sm: 8 } }
                  : { right: { xs: 4, sm: 8 } }),
                boxShadow: "0 4px 16px rgba(75, 74, 74, 0.14)",
              }
            : {
                display: { xs: "none", md: "inline-flex" },
                flexShrink: 0,
              }),
          ...discoverNavIconVariantSx(disabled),
        }}
      >
        {isPrev ? (
          <ChevronLeft filled={disabled} />
        ) : (
          <ChevronRight filled={disabled} />
        )}
      </IconButton>
    );
  };

  return (
    <Box
      component="section"
      role="region"
      aria-label="Discover by category"
      sx={{
        width: "100%",
        maxWidth: "100%",
        bgcolor: PAGE_BG,
        px: 0,
        py: { xs: 5, sm: 6, md: discoverSectionPadY },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          px: {
            xs: layoutPaddingX.xs,
            sm: layoutPaddingX.sm,
            md: discoverSectionPadX,
          },
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
            fontSize: { xs: 26, sm: 36, md: 48, lg: exploreHeadingFontSize },
            lineHeight: 1.2,
            textAlign: "center",
            textTransform: "uppercase",
            color: MUTED,
            whiteSpace: { xs: "normal", md: "nowrap" },
            maxWidth: { xs: "100%", md: discoverTitleMaxWidth },
            wordBreak: "break-word",
            letterSpacing: { xs: "0.02em", md: 0 },
          }}
        >
          Discover by Category
        </Typography>

        {/* Desktop: prev | tabs | next */}
        <Box
          sx={{
            width: "100%",
            mt: { xs: 2.5, sm: 3, md: discoverTitleToTabsGap },
            display: { xs: "none", md: "flex" },
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {renderNavButton(-1, !canScrollLeft, "header")}

          <CategoryTabs
            category={category}
            onSelect={(id) => {
              if (id === "all") {
                navigate({ to: `/category/${plpTarget}` });
                return;
              }
              setCategory(id);
              setPlpTarget(id);
            }}
          />

          {renderNavButton(1, !canScrollRight, "header")}
        </Box>

        {/* Mobile / tablet: scrollable tabs */}
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            width: "100%",
            mt: { xs: 2.5, sm: 3 },
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
            WebkitOverflowScrolling: "touch",
          }}
        >
          <CategoryTabs
            category={category}
            centered={false}
            onSelect={(id) => {
              if (id === "all") {
                navigate({ to: `/category/${plpTarget}` });
                return;
              }
              setCategory(id);
              setPlpTarget(id);
            }}
          />
        </Box>
      </Box>

      {showHeadlessEmptyHint ? (
        <Typography
          sx={{
            mt: { xs: 2.5, md: discoverTabsToCarouselGap },
            px: {
              xs: layoutPaddingX.xs,
              sm: layoutPaddingX.sm,
              md: discoverSectionPadX,
            },
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
        sx={{
          position: "relative",
          width: "100%",
          mt: { xs: 2.5, sm: 3, md: discoverTabsToCarouselGap },
        }}
      >
        {renderNavButton(-1, !canScrollLeft, "overlay")}
        {renderNavButton(1, !canScrollRight, "overlay")}

        <Box
          ref={scrollerRef}
          role="group"
          aria-label="Product carousel"
          aria-busy={isLoadingProducts}
          sx={{
            width: "100%",
            maxWidth: "100%",
            display: "flex",
            flexDirection: "row",
            gap: { xs: 2, sm: 2.5, md: discoverCarouselGap },
            overflowX: "auto",
            overflowY: "visible",
            scrollSnapType: "x mandatory",
            scrollPaddingLeft: {
              xs: 16,
              sm: 24,
              md: discoverCarouselEdgePadX,
            },
            scrollPaddingRight: {
              xs: 16,
              sm: 24,
              md: discoverCarouselEdgePadX,
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
            WebkitOverflowScrolling: "touch",
            pl: {
              xs: layoutPaddingX.xs,
              sm: layoutPaddingX.sm,
              md: discoverCarouselEdgePadX,
            },
            pr: 0,
            boxSizing: "border-box",
          }}
        >
          {isLoadingProducts
            ? Array.from({ length: 3 }, (_, i) => (
                <DiscoverCardSkeleton key={`skeleton-${i}`} />
              ))
            : visibleProducts.map((p) => (
                <CatalogProductCard
                  key={p.handle}
                  product={p}
                  shell="carousel"
                  markDiscoverCard
                  onOpen={() => openProductDetail(p)}
                  imageClassName="discover-card-image"
                  titleClassName="discover-card-title"
                />
              ))}
          <Box
            aria-hidden
            sx={{
              flexShrink: 0,
              width: { xs: 16, sm: 24, md: discoverCarouselEdgePadX },
              minWidth: { xs: 16, sm: 24, md: discoverCarouselEdgePadX },
              height: 1,
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          mt: { xs: 3, sm: 3.5, md: discoverTabsToCarouselGap },
          width: "100%",
          px: {
            xs: layoutPaddingX.xs,
            sm: layoutPaddingX.sm,
            md: discoverSectionPadX,
          },
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
            width: { xs: "100%", sm: "auto" },
            maxWidth: { xs: 360, sm: "none" },
            borderRadius: discoverSeeMoreRadius,
            border: `${shopBorderWidth} solid ${TAN}`,
            color: TAN,
            textDecoration: "none",
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: navFontSize,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            transition: "opacity 0.2s, border-color 0.2s, color 0.2s",
            "&:hover": {
              opacity: 0.9,
              borderColor: ACCENT,
              color: ACCENT,
            },
          }}
        >
          See More Products
          <Box
            component="img"
            src="/discover/arrow-long.svg"
            alt=""
            sx={{
              width: discoverSeeMoreArrowWidth,
              height: discoverSeeMoreArrowHeight,
              display: "block",
              flexShrink: 0,
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

function CategoryTabs({
  category,
  onSelect,
  centered = true,
}: {
  category: CategoryId;
  onSelect: (id: CategoryId) => void;
  centered?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: { xs: "nowrap", md: "wrap" },
        justifyContent: centered ? "center" : "flex-start",
        gap: { xs: 1, sm: 1.5, md: discoverTabGap },
        flex: centered ? 1 : undefined,
        minWidth: centered ? 0 : "max-content",
        px: centered ? 0 : { xs: 0.5, sm: 0 },
      }}
    >
      {CATEGORIES.map(({ id, label }) => {
        const isActive = category === id;
        return (
          <Box
            key={id}
            component="button"
            type="button"
            onClick={() => onSelect(id)}
            sx={{
              cursor: "pointer",
              flexShrink: 0,
              border: isActive ? "none" : `${shopBorderWidth} solid ${TAN}`,
              bgcolor: isActive ? ACCENT : "transparent",
              color: isActive ? PAGE_BG : TAN,
              px: discoverTagPadX,
              py: discoverTagPadY,
              minHeight: { xs: 44, md: "auto" },
              borderRadius: shopRadius,
              fontFamily: isActive ? FONT_NAV_SHOP : FONT_NAV,
              fontWeight: 600,
              fontSize: navFontSize,
              textTransform: "uppercase",
              lineHeight: 1,
              transition:
                "background-color 0.2s, color 0.2s, border-color 0.2s",
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
          >
            {label}
          </Box>
        );
      })}
    </Box>
  );
}

function DiscoverCardSkeleton() {
  return (
    <Box
      sx={{
        ...cardWidthSx,
        minWidth: 0,
        scrollSnapAlign: { xs: "start", md: "start" },
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <Box
        aria-hidden
        sx={{
          flex: 1,
          borderRadius: discoverCardRadius,
          border: `${shopBorderWidth} solid ${TAN}`,
          boxSizing: "border-box",
          px: { xs: 1, sm: 1.5 },
          py: { xs: 1, sm: 1.5 },
          display: "flex",
          flexDirection: "column",
          gap: { xs: 1, sm: 1.5 },
          opacity: 0.55,
        }}
      >
        <Box
          sx={{ width: 52, height: 20, borderRadius: shopRadius, bgcolor: TAN }}
        />
        <Box
          sx={{
            width: "100%",
            height: { xs: 120, sm: 160 },
            borderRadius: 1,
            bgcolor: "rgba(204, 188, 166, 0.35)",
          }}
        />
        <Box
          sx={{
            width: "70%",
            height: 12,
            borderRadius: 1,
            bgcolor: "rgba(204, 188, 166, 0.35)",
          }}
        />
        <Box
          sx={{
            width: "45%",
            height: 10,
            borderRadius: 1,
            bgcolor: "rgba(204, 188, 166, 0.25)",
          }}
        />
      </Box>
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
