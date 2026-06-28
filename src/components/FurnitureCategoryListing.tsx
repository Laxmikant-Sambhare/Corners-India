import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CatalogProduct } from "../catalog/catalogPageTypes";
import { parsePriceValue, resolveProductDetail } from "./productDetailUtils";
import { ProductDetailModal } from "./ProductDetailModal";
import {
  CatalogProductCard,
  catalogProductCardGridSx,
} from "./CatalogProductCard";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type ChangeEventHandler,
  type FocusEventHandler,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type ReactNode,
} from "react";
import { FONT_NAV } from "../fonts";
import {
  discoverCarouselGap,
  furnitureListingCardRadius,
  furnitureFilterChipStackGap,
  furnitureFilterInputPadX,
  furnitureFilterInputPadY,
  furnitureFilterPriceInputsGap,
  furnitureFilterSectionDividerGap,
  furnitureFilterSectionHeaderPadY,
  furnitureFilterSectionStackGap,
  furnitureFilterSliderThumbSize,
  furnitureFilterSliderTrackH,
  furnitureFilterToLabelSize,
  furnitureListingChevronH,
  furnitureListingChevronW,
  furnitureListingFilterActionPadX,
  furnitureListingFilterActionPadY,
  furnitureListingFilterIconBox,
  furnitureListingFilterMenuIconH,
  furnitureListingFilterMenuIconW,
  furnitureListingFilterToActionsGap,
  furnitureListingProductTitleSize,
  furnitureListingSectionGap,
  furnitureListingSectionPadY,
  furnitureListingSidebarGap,
  furnitureListingSidebarWidth,
  furnitureListingSortDropdownGap,
  furnitureListingSortDropdownItemGap,
  furnitureListingSortDropdownMinW,
  furnitureListingSortDropdownPad,
  furnitureListingSortEndGap,
  furnitureListingSortPadX,
  furnitureListingSortPadY,
  furnitureListingToolbarGap,
  furnitureListingToolbarRowGap,
  navFontSize,
  shopBorderWidth,
  shopRadius,
} from "../navDesignTokens";

const PAGE_BG = "#f3ede3";
const MUTED = "#4b4a4a";
const ACCENT = "#bc7e5a";
const TAN = "#ccbca6";
const BORDER_FILTER = "#d0c2ad";

const easeOutMenu = [0.32, 0.72, 0, 1] as const;

function buildSortMenuVariants(reduceMotion: boolean | null) {
  const none = reduceMotion === true;

  const menuContainer = {
    hidden: { opacity: 0, y: none ? 0 : -18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: none
        ? { duration: 0 }
        : {
            y: { type: "spring" as const, stiffness: 420, damping: 34 },
            opacity: { duration: 0.22 },
            staggerChildren: 0.055,
            delayChildren: 0.04,
            when: "beforeChildren" as const,
          },
    },
    exit: {
      opacity: 0,
      y: none ? 0 : -10,
      transition: none
        ? { duration: 0 }
        : { duration: 0.18, ease: easeOutMenu },
    },
  };

  const menuItem = {
    hidden: { opacity: 0, y: none ? 0 : -12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: none
        ? { duration: 0 }
        : { duration: 0.22, ease: easeOutMenu },
    },
  };

  return { menuContainer, menuItem };
}

const SORT_OPTIONS = [
  { id: "bestSelling" as const, label: "Best Selling" },
  { id: "priceHighLow" as const, label: "Price (High To Low)" },
  { id: "priceLowHigh" as const, label: "Price (Low To High)" },
];

type SortOptionId = (typeof SORT_OPTIONS)[number]["id"];

type CatalogFilterMode = "productType" | "size";

const PRICE_MIN = 0;
const PRICE_MAX = 100_000;
const DEFAULT_PRICE_RANGE: [number, number] = [PRICE_MIN, PRICE_MAX];
const PRICE_STEP = 500;

type ProductCardLayout = "grid" | "discover";

function countActiveFilters(
  priceRange: [number, number],
  selectedChips: string[],
): number {
  let count = selectedChips.length;
  if (
    priceRange[0] !== DEFAULT_PRICE_RANGE[0] ||
    priceRange[1] !== DEFAULT_PRICE_RANGE[1]
  ) {
    count += 1;
  }
  return count;
}

function formatInr(n: number) {
  return n.toLocaleString("en-IN");
}

function parseInr(s: string) {
  const n = Number.parseInt(s.replace(/,/g, "").trim(), 10);
  return Number.isFinite(n) ? n : 0;
}

function getProductTypeLabel(product: CatalogProduct): string {
  const name = product.name.toLowerCase();
  if (name.includes("chair")) return "Chair";
  if (name.includes("ottoman")) return "Ottoman";
  if (name.includes("table")) return "Table";
  if (name.includes("rug")) return "Rug";

  const badge = product.badge.trim();
  if (badge && !["badging", "new"].includes(badge.toLowerCase())) {
    return badge.charAt(0).toUpperCase() + badge.slice(1).toLowerCase();
  }
  return "Other";
}

function applyCatalogFilters(
  products: readonly CatalogProduct[],
  {
    priceRange,
    selectedChips,
    filterMode,
  }: {
    priceRange: [number, number];
    selectedChips: string[];
    filterMode: CatalogFilterMode;
  },
): CatalogProduct[] {
  return products.filter((product) => {
    const price = parsePriceValue(product.price);
    if (price > 0 && (price < priceRange[0] || price > priceRange[1])) {
      return false;
    }

    if (selectedChips.length === 0) return true;

    if (filterMode === "size") {
      const sizes = resolveProductDetail(product).sizes;
      return sizes.some((size) => selectedChips.includes(size));
    }

    const type = getProductTypeLabel(product);
    return selectedChips.includes(type);
  });
}

function sortCatalogProducts(
  products: readonly CatalogProduct[],
  sortBy: SortOptionId,
): CatalogProduct[] {
  const sorted = [...products];
  if (sortBy === "priceLowHigh") {
    sorted.sort((a, b) => parsePriceValue(a.price) - parsePriceValue(b.price));
  } else if (sortBy === "priceHighLow") {
    sorted.sort((a, b) => parsePriceValue(b.price) - parsePriceValue(a.price));
  }
  return sorted;
}

function buildChipOptions(
  products: readonly CatalogProduct[],
  filterMode: CatalogFilterMode,
): string[] {
  if (filterMode === "size") {
    const sizes = new Set<string>();
    for (const product of products) {
      for (const size of resolveProductDetail(product).sizes) {
        sizes.add(size);
      }
    }
    return [...sizes];
  }

  const types = new Set<string>();
  for (const product of products) {
    const type = getProductTypeLabel(product);
    if (type !== "Other") types.add(type);
  }
  return [...types].sort();
}

export type FurnitureCategoryListingProps = {
  products: readonly CatalogProduct[];
  sectionAriaLabel: string;
  /** Rugs PLP filters by size; furniture/collection routes filter by product type. */
  filterMode?: CatalogFilterMode;
};

/**
 * PLP toolbar, filters, and product grid — Figma 990:5601 (below category hero).
 */
export function FurnitureCategoryListing({
  products,
  sectionAriaLabel,
  filterMode = "productType",
}: FurnitureCategoryListingProps) {
  const [detailProduct, setDetailProduct] = useState<CatalogProduct | null>(
    null,
  );
  const [sortBy, setSortBy] = useState<SortOptionId>("bestSelling");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>(
    DEFAULT_PRICE_RANGE,
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setFiltersOpen(isMdUp);
  }, [isMdUp]);

  useEffect(() => {
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSelectedChips([]);
    setSortBy("bestSelling");
  }, [products]);

  const chipOptions = useMemo(
    () => buildChipOptions(products, filterMode),
    [products, filterMode],
  );

  const showChipFilter = chipOptions.length > 1;
  const chipFilterTitle = filterMode === "size" ? "Size" : "Product Type";

  const filteredProducts = useMemo(() => {
    const filtered = applyCatalogFilters(products, {
      priceRange,
      selectedChips,
      filterMode,
    });
    return sortCatalogProducts(filtered, sortBy);
  }, [products, priceRange, selectedChips, filterMode, sortBy]);

  const toggleChip = useCallback((label: string) => {
    setSelectedChips((prev) =>
      prev.includes(label)
        ? prev.filter((value) => value !== label)
        : [...prev, label],
    );
  }, []);

  const clearFilters = useCallback(() => {
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSelectedChips([]);
  }, []);

  const itemCount = filteredProducts.length;
  const itemLabel = `${itemCount} Item${itemCount === 1 ? "" : "s"}`;
  const activeFilterCount = countActiveFilters(priceRange, selectedChips);
  const cardLayout: ProductCardLayout =
    isMdUp && !filtersOpen ? "discover" : "grid";

  return (
    <Box
      component="section"
      aria-label={sectionAriaLabel}
      sx={{
        width: "100%",
        boxSizing: "border-box",
        py: { xs: 2, sm: 3, md: furnitureListingSectionPadY },
      }}
    >
      <Stack
        sx={{
          width: "100%",
          gap: { xs: 2, sm: 3, md: furnitureListingSectionGap },
          alignItems: "stretch",
        }}
      >
        <ToolbarRow
          itemLabel={itemLabel}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filtersOpen={filtersOpen}
          activeFilterCount={activeFilterCount}
          onToggleFilters={() => setFiltersOpen((open) => !open)}
        />

        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{
            gap: filtersOpen ? furnitureListingSidebarGap : 0,
            alignItems: "flex-start",
            width: "100%",
            transition: reduceMotion
              ? undefined
              : "gap 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
          }}
        >
          {isMdUp ? (
            <AnimatePresence initial={false}>
              {filtersOpen ? (
                <Box
                  key="catalog-filter-sidebar"
                  component={motion.div}
                  initial={
                    reduceMotion ? false : { width: 0, opacity: 0 }
                  }
                  animate={
                    reduceMotion
                      ? undefined
                      : { width: furnitureListingSidebarWidth, opacity: 1 }
                  }
                  exit={
                    reduceMotion ? undefined : { width: 0, opacity: 0 }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 0.35,
                    ease: easeOutMenu,
                  }}
                  sx={{
                    overflow: "hidden",
                    flexShrink: 0,
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: furnitureListingSidebarWidth,
                      maxWidth: "100%",
                      boxSizing: "border-box",
                      px: 1.5,
                      py: 0.5,
                      minWidth: 0,
                    }}
                  >
                    <FilterSidebar
                      showChipFilter={showChipFilter}
                      chipFilterTitle={chipFilterTitle}
                      chipOptions={chipOptions}
                      priceRange={priceRange}
                      onPriceRangeChange={setPriceRange}
                      selectedChips={selectedChips}
                      onToggleChip={toggleChip}
                      onClearFilters={clearFilters}
                    />
                  </Box>
                </Box>
              ) : null}
            </AnimatePresence>
          ) : (
            <Collapse in={filtersOpen} timeout={reduceMotion ? 0 : 350}>
              <Box
                sx={{
                  width: "100%",
                  mb: { xs: 0.5, md: 0 },
                  p: { xs: 2, sm: 2.5 },
                  bgcolor: PAGE_BG,
                  borderRadius: shopRadius,
                  border: `${shopBorderWidth} solid ${BORDER_FILTER}`,
                  boxSizing: "border-box",
                }}
              >
                <FilterSidebar
                  showChipFilter={showChipFilter}
                  chipFilterTitle={chipFilterTitle}
                  chipOptions={chipOptions}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  selectedChips={selectedChips}
                  onToggleChip={toggleChip}
                  onClearFilters={clearFilters}
                  compact
                />
              </Box>
            </Collapse>
          )}

          <ProductGrid
            products={filteredProducts}
            totalProductCount={products.length}
            cardLayout={cardLayout}
            onClearFilters={clearFilters}
            onOpenProduct={(p) => setDetailProduct(p)}
          />
        </Stack>
      </Stack>

      <ProductDetailModal
        open={detailProduct !== null}
        onClose={() => setDetailProduct(null)}
        product={detailProduct}
      />
    </Box>
  );
}

function ToolbarRow({
  itemLabel,
  sortBy,
  onSortChange,
  filtersOpen,
  activeFilterCount,
  onToggleFilters,
}: {
  itemLabel: string;
  sortBy: SortOptionId;
  onSortChange: (id: SortOptionId) => void;
  filtersOpen: boolean;
  activeFilterCount: number;
  onToggleFilters: () => void;
}) {
  const sortMenuId = useId();
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { menuContainer, menuItem } = buildSortMenuVariants(reduceMotion);

  const sortLabel =
    SORT_OPTIONS.find((o) => o.id === sortBy)?.label ?? "Best Selling";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: { xs: 1, sm: furnitureListingToolbarRowGap },
        width: "100%",
      }}
    >
      <Badge
        badgeContent={activeFilterCount}
        invisible={activeFilterCount === 0}
        overlap="circular"
        sx={{
          flexShrink: 0,
          "& .MuiBadge-badge": {
            bgcolor: ACCENT,
            color: PAGE_BG,
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: "0.6875rem",
            minWidth: 18,
            height: 18,
            padding: "0 4px",
          },
        }}
      >
        <Button
          type="button"
          variant="outlined"
          aria-label={filtersOpen ? "Hide filters" : "Show filters"}
          aria-expanded={filtersOpen}
          onClick={onToggleFilters}
          startIcon={<FilterMenuIcon />}
          sx={{
            minWidth: { xs: "auto", md: furnitureListingFilterIconBox },
            height: { xs: 40, md: furnitureListingFilterIconBox },
            px: { xs: 1.5, md: 0 },
            borderRadius: shopRadius,
            border: `${shopBorderWidth} solid ${
              filtersOpen ? ACCENT : BORDER_FILTER
            }`,
            color: filtersOpen ? ACCENT : MUTED,
            flexShrink: 0,
            bgcolor: filtersOpen ? "rgba(188, 126, 90, 0.08)" : "transparent",
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: { xs: 11, sm: navFontSize },
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            "& .MuiButton-startIcon": {
              mr: { xs: 0.75, md: 0 },
              ml: { xs: 0, md: 0 },
            },
            "&:hover": {
              borderColor: filtersOpen ? ACCENT : BORDER_FILTER,
              bgcolor: filtersOpen
                ? "rgba(188, 126, 90, 0.12)"
                : "rgba(204, 188, 166, 0.12)",
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: "inline", md: "none" } }}>
            Filters
          </Box>
        </Button>
      </Badge>

      <Stack
        direction="row"
        alignItems="center"
        sx={{
          gap: { xs: 1.25, sm: 2, md: furnitureListingToolbarGap },
          flexWrap: "nowrap",
          justifyContent: "flex-end",
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: { xs: 11, sm: navFontSize },
            lineHeight: 1.2,
            textTransform: "uppercase",
            color: TAN,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {itemLabel}
        </Typography>

        <ClickAwayListener onClickAway={() => setSortMenuOpen(false)}>
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            <Button
              type="button"
              variant="text"
              disableElevation
              aria-haspopup="listbox"
              aria-expanded={sortMenuOpen}
              aria-controls={sortMenuId}
              endIcon={
                <Box
                  sx={{
                    display: "inline-flex",
                    transition: "transform 0.2s ease",
                    transform: sortMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <ChevronDown sort />
                </Box>
              }
              onClick={() => setSortMenuOpen((o) => !o)}
              sx={{
                bgcolor: TAN,
                color: PAGE_BG,
                textTransform: "uppercase",
                fontFamily: FONT_NAV,
                fontWeight: 600,
                fontSize: { xs: 10, sm: navFontSize },
                lineHeight: 1,
                px: { xs: 1.25, sm: furnitureListingSortPadX },
                py: { xs: 1, sm: furnitureListingSortPadY },
                borderRadius: shopRadius,
                minWidth: "auto",
                maxWidth: { xs: 148, sm: "none" },
                gap: { xs: 0.5, md: furnitureListingSortEndGap },
                "& .MuiButton-endIcon": { color: PAGE_BG, ml: 0.5 },
                "& .MuiButton-label": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
                "&:hover": { bgcolor: TAN, opacity: 0.92 },
              }}
            >
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                {sortLabel}
              </Box>
              <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                Sort
              </Box>
            </Button>

            <AnimatePresence>
              {sortMenuOpen ? (
                <Box
                  key={sortMenuId}
                  id={sortMenuId}
                  role="listbox"
                  aria-label="Sort products"
                  component={motion.div}
                  variants={menuContainer}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  sx={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    mt: furnitureListingSortDropdownGap,
                    zIndex: 20,
                    minWidth: furnitureListingSortDropdownMinW,
                    bgcolor: TAN,
                    color: PAGE_BG,
                    borderRadius: shopRadius,
                    px: furnitureListingSortDropdownPad,
                    py: furnitureListingSortDropdownPad,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    gap: furnitureListingSortDropdownItemGap,
                    boxSizing: "border-box",
                  }}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <Box
                      key={opt.id}
                      component={motion.div}
                      variants={menuItem}
                      sx={{ width: "100%" }}
                    >
                      <Box
                        component="button"
                        type="button"
                        role="option"
                        aria-selected={sortBy === opt.id}
                        onClick={() => {
                          onSortChange(opt.id);
                          setSortMenuOpen(false);
                        }}
                        sx={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          padding: 0,
                          margin: 0,
                          fontFamily: FONT_NAV,
                          fontWeight: 600,
                          fontSize: navFontSize,
                          lineHeight: 1,
                          textTransform: "uppercase",
                          color: PAGE_BG,
                          textAlign: "left",
                          width: "100%",
                          "&:hover": { opacity: 0.88 },
                        }}
                      >
                        {opt.label}
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : null}
            </AnimatePresence>
          </Box>
        </ClickAwayListener>
      </Stack>
    </Box>
  );
}

function FilterSidebar({
  showChipFilter,
  chipFilterTitle,
  chipOptions,
  priceRange,
  onPriceRangeChange,
  selectedChips,
  onToggleChip,
  onClearFilters,
  compact = false,
}: {
  showChipFilter: boolean;
  chipFilterTitle: string;
  chipOptions: readonly string[];
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  selectedChips: string[];
  onToggleChip: (label: string) => void;
  onClearFilters: () => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState({
    price: true,
    chips: true,
  });

  const toggleSection = (key: keyof typeof open) => {
    setOpen((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", md: furnitureListingSidebarWidth },
        maxWidth: "100%",
        minWidth: 0,
        flexShrink: 0,
        boxSizing: "border-box",
        overflow: "visible",
      }}
    >
      <Stack
        sx={{
          gap: compact
            ? { xs: 2, md: furnitureListingFilterToActionsGap }
            : furnitureListingFilterToActionsGap,
          alignItems: compact ? "stretch" : "flex-start",
          width: "100%",
        }}
      >
        <Stack
          divider={
            <Divider
              sx={{
                borderColor: BORDER_FILTER,
                my: furnitureFilterSectionDividerGap,
              }}
            />
          }
          sx={{ width: "100%", minWidth: 0 }}
        >
          <FilterAccordionBlock
            title="Price Range"
            expanded={open.price}
            onToggle={() => toggleSection("price")}
            compact={compact}
          >
            <Collapse in={open.price}>
              <Box
                sx={{
                  pt: furnitureFilterSectionStackGap,
                  pb: furnitureFilterSectionStackGap,
                  width: "100%",
                  minWidth: 0,
                  overflow: "visible",
                }}
              >
                <Stack
                  sx={{
                    gap: furnitureFilterSectionStackGap,
                    width: "100%",
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      minWidth: 0,
                      px: 0.75,
                      boxSizing: "border-box",
                    }}
                  >
                    <PriceRangeSlider
                      value={priceRange}
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      onChange={onPriceRangeChange}
                    />
                  </Box>
                  <PriceRangeInputs
                    value={priceRange}
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    onChange={onPriceRangeChange}
                  />
                </Stack>
              </Box>
            </Collapse>
          </FilterAccordionBlock>

          {showChipFilter ? (
            <FilterAccordionBlock
              title={chipFilterTitle}
              expanded={open.chips}
              onToggle={() => toggleSection("chips")}
              compact={compact}
            >
              <Collapse in={open.chips}>
                <Box
                  sx={{
                    pt: furnitureFilterSectionStackGap,
                    pb: furnitureFilterSectionStackGap,
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: compact ? "row" : "column",
                      flexWrap: compact ? "wrap" : "nowrap",
                      gap: compact
                        ? { xs: 0.75, sm: 1 }
                        : furnitureFilterChipStackGap,
                      alignItems: "flex-start",
                      width: "100%",
                    }}
                  >
                    {chipOptions.map((label) => (
                      <FilterChip
                        key={label}
                        label={label}
                        selected={selectedChips.includes(label)}
                        onClick={() => onToggleChip(label)}
                        compact={compact}
                      />
                    ))}
                  </Box>
                </Box>
              </Collapse>
            </FilterAccordionBlock>
          ) : null}
        </Stack>

        <Button
          type="button"
          variant="outlined"
          onClick={onClearFilters}
          sx={{
            ...filterActionSx,
            px: furnitureListingFilterActionPadX,
            py: furnitureListingFilterActionPadY,
            width: compact ? "100%" : "auto",
            alignSelf: compact ? "stretch" : "flex-start",
          }}
        >
          Clear Filters
        </Button>
      </Stack>
    </Box>
  );
}

function FilterAccordionBlock({
  title,
  expanded,
  onToggle,
  children,
  compact = false,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        component="button"
        type="button"
        onClick={onToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          py: compact
            ? { xs: 1, md: furnitureFilterSectionHeaderPadY }
            : furnitureFilterSectionHeaderPadY,
          border: "none",
          background: "none",
          cursor: "pointer",
          textAlign: "left",
          paddingInline: 0,
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: compact ? { xs: 11, sm: navFontSize } : navFontSize,
            lineHeight: 1,
            textTransform: "uppercase",
            color: MUTED,
            letterSpacing: compact ? "0.06em" : undefined,
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: "inline-flex",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <ChevronDown muted />
        </Box>
      </Box>
      {children}
    </Box>
  );
}

function PriceRangeSlider({
  value,
  min,
  max,
  onChange,
}: {
  value: [number, number];
  min: number;
  max: number;
  onChange: (v: [number, number]) => void;
}) {
  const handleChange = (_: Event, v: number | number[]) => {
    const [a, b] = v as [number, number];
    const lo = Math.min(max, Math.max(min, a));
    const hi = Math.min(max, Math.max(min, b));
    onChange([Math.min(lo, hi), Math.max(lo, hi)]);
  };

  return (
    <Slider
      value={value}
      onChange={handleChange}
      valueLabelDisplay="off"
      min={min}
      max={max}
      step={PRICE_STEP}
      disableSwap
      getAriaLabel={(index) =>
        index === 0 ? "Minimum price" : "Maximum price"
      }
      sx={{
        width: "100%",
        minWidth: 0,
        mx: 0,
        px: 0.5,
        boxSizing: "border-box",
        height: furnitureFilterSliderTrackH,
        overflow: "visible",
        "& .MuiSlider-rail": {
          opacity: 1,
          bgcolor: MUTED,
          height: furnitureFilterSliderTrackH,
          borderRadius: 100,
        },
        "& .MuiSlider-track": {
          border: "none",
          bgcolor: MUTED,
          height: furnitureFilterSliderTrackH,
          borderRadius: 100,
        },
        "& .MuiSlider-thumb": {
          width: furnitureFilterSliderThumbSize,
          height: furnitureFilterSliderThumbSize,
          bgcolor: MUTED,
          border: `2px solid ${PAGE_BG}`,
          boxSizing: "border-box",
          "&:hover, &.Mui-focusVisible, &.Mui-active": {
            boxShadow: "none",
          },
        },
      }}
    />
  );
}

function PriceInputWithRupee({
  value,
  inputMode,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  "data-price": dataPrice,
}: {
  value: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFocus: FocusEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  "data-price"?: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        border: `${shopBorderWidth} solid ${TAN}`,
        borderRadius: shopRadius,
        px: furnitureFilterInputPadX,
        py: furnitureFilterInputPadY,
        gap: 0.75,
        "&:focus-within": {
          borderColor: MUTED,
        },
      }}
    >
      <Typography
        component="span"
        aria-hidden
        sx={{
          fontFamily: FONT_NAV,
          fontWeight: 600,
          fontSize: navFontSize,
          lineHeight: 1,
          color: MUTED,
          flexShrink: 0,
        }}
      >
        ₹
      </Typography>
      <Box
        component="input"
        data-price={dataPrice}
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        sx={{
          flex: 1,
          minWidth: 0,
          border: "none",
          outline: "none",
          bgcolor: "transparent",
          fontFamily: FONT_NAV,
          fontWeight: 600,
          fontSize: navFontSize,
          lineHeight: 1,
          color: MUTED,
          textAlign: "right",
          p: 0,
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      />
    </Box>
  );
}

function PriceRangeInputs({
  value,
  min,
  max,
  onChange,
}: {
  value: [number, number];
  min: number;
  max: number;
  onChange: (v: [number, number]) => void;
}) {
  const [minEditing, setMinEditing] = useState(false);
  const [maxEditing, setMaxEditing] = useState(false);
  const [minDraft, setMinDraft] = useState("");
  const [maxDraft, setMaxDraft] = useState("");

  const minShown = minEditing ? minDraft : formatInr(value[0]);
  const maxShown = maxEditing ? maxDraft : formatInr(value[1]);

  const commitMin = () => {
    let next = Math.min(max, Math.max(min, parseInr(minDraft)));
    next = Math.min(next, value[1]);
    onChange([next, value[1]]);
    setMinEditing(false);
  };

  const commitMax = () => {
    let next = Math.min(max, Math.max(min, parseInr(maxDraft)));
    next = Math.max(next, value[0]);
    onChange([value[0], next]);
    setMaxEditing(false);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
        alignItems: "center",
        columnGap: furnitureFilterPriceInputsGap,
        rowGap: 1,
        width: "100%",
        minWidth: 0,
      }}
    >
      <PriceInputWithRupee
        data-price="min"
        value={minShown}
        inputMode="numeric"
        onChange={(e) => setMinDraft(e.target.value)}
        onFocus={() => {
          setMinEditing(true);
          setMinDraft(formatInr(value[0]));
        }}
        onBlur={commitMin}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitMin();
        }}
      />
      <Typography
        sx={{
          fontFamily: FONT_NAV,
          fontWeight: 600,
          fontSize: furnitureFilterToLabelSize,
          lineHeight: 1,
          textTransform: "uppercase",
          color: MUTED,
          textAlign: "center",
          flexShrink: 0,
          px: 0.25,
        }}
      >
        To
      </Typography>
      <PriceInputWithRupee
        data-price="max"
        value={maxShown}
        inputMode="numeric"
        onChange={(e) => setMaxDraft(e.target.value)}
        onFocus={() => {
          setMaxEditing(true);
          setMaxDraft(formatInr(value[1]));
        }}
        onBlur={commitMax}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitMax();
        }}
      />
    </Box>
  );
}

function FilterChip({
  label,
  selected,
  onClick,
  compact = false,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outlined"
      disableElevation
      onClick={onClick}
      sx={{
        alignSelf: "flex-start",
        width: "auto",
        minWidth: "auto",
        justifyContent: "center",
        borderRadius: shopRadius,
        borderWidth: shopBorderWidth,
        borderColor: selected ? ACCENT : TAN,
        px: compact
          ? { xs: 1, sm: 1.25, md: furnitureFilterInputPadX }
          : furnitureFilterInputPadX,
        py: compact
          ? { xs: 0.625, sm: 0.75, md: furnitureFilterInputPadY }
          : furnitureFilterInputPadY,
        fontFamily: FONT_NAV,
        fontWeight: 600,
        fontSize: compact ? { xs: 10, sm: 11, md: navFontSize } : navFontSize,
        lineHeight: 1,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: selected ? ACCENT : MUTED,
        bgcolor: selected ? "rgba(188, 126, 90, 0.08)" : "transparent",
        boxShadow: "none",
        "&:hover": {
          borderColor: selected ? ACCENT : TAN,
          bgcolor: selected
            ? "rgba(188, 126, 90, 0.12)"
            : "rgba(204, 188, 166, 0.14)",
        },
      }}
    >
      {label}
    </Button>
  );
}

const filterActionSx = {
  borderRadius: shopRadius,
  borderColor: ACCENT,
  borderWidth: shopBorderWidth,
  color: ACCENT,
  fontFamily: FONT_NAV,
  fontWeight: 600,
  fontSize: navFontSize,
  textTransform: "uppercase" as const,
  lineHeight: 1,
  "&:hover": {
    borderColor: ACCENT,
    bgcolor: "rgba(188, 126, 90, 0.06)",
  },
};

function ProductGrid({
  products,
  totalProductCount,
  cardLayout,
  onClearFilters,
  onOpenProduct,
}: {
  products: readonly CatalogProduct[];
  totalProductCount: number;
  cardLayout: ProductCardLayout;
  onClearFilters: () => void;
  onOpenProduct: (p: CatalogProduct) => void;
}) {
  if (products.length === 0) {
    const filteredOut = totalProductCount > 0;

    return (
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: { xs: 2, sm: 4 },
          py: { xs: 6, sm: 8 },
          borderRadius: furnitureListingCardRadius,
          border: `${shopBorderWidth} solid ${BORDER_FILTER}`,
          boxSizing: "border-box",
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: { xs: navFontSize, sm: furnitureListingProductTitleSize },
            lineHeight: 1.3,
            textTransform: "uppercase",
            color: MUTED,
            maxWidth: 420,
          }}
        >
          {filteredOut ? "No products match your filters" : "No products here yet"}
        </Typography>
        <Typography
          sx={{
            mt: 1.5,
            fontFamily: FONT_NAV,
            fontWeight: 500,
            fontSize: navFontSize,
            lineHeight: 1.5,
            color: TAN,
            maxWidth: 460,
          }}
        >
          {filteredOut
            ? "Try widening the price range or clearing your selections to explore more from Corners."
            : "Check back soon — new pieces are on their way."}
        </Typography>
        {filteredOut ? (
          <Button
            type="button"
            variant="outlined"
            onClick={onClearFilters}
            sx={{
              ...filterActionSx,
              mt: 3,
              px: furnitureListingFilterActionPadX,
              py: furnitureListingFilterActionPadY,
            }}
          >
            Clear all filters
          </Button>
        ) : null}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        width: "100%",
        overflow: "visible",
        ...(cardLayout === "discover"
          ? {
              display: "flex",
              flexWrap: "wrap",
              alignItems: "stretch",
              gap: discoverCarouselGap,
            }
          : catalogProductCardGridSx),
      }}
    >
      {products.map((p) => (
        <CatalogProductCard
          key={`${p.name}-${p.image}`}
          product={p}
          shell={cardLayout === "discover" ? "wide" : "grid"}
          onOpen={() => onOpenProduct(p)}
          imageClassName={
            cardLayout === "discover" ? "discover-card-image" : "catalog-card-image"
          }
          titleClassName={
            cardLayout === "discover" ? "discover-card-title" : "catalog-card-title"
          }
        />
      ))}
    </Box>
  );
}

function FilterMenuIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 20 14"
      sx={{
        width: furnitureListingFilterMenuIconW,
        height: furnitureListingFilterMenuIconH,
        display: "block",
      }}
      fill="none"
      aria-hidden
    >
      <path
        d="M0 1H20M0 7H20M0 13H20"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </Box>
  );
}

function ChevronDown({ muted, sort }: { muted?: boolean; sort?: boolean }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 15 7"
      fill="none"
      sx={{
        width: furnitureListingChevronW,
        height: furnitureListingChevronH,
        flexShrink: 0,
        display: "block",
        color: sort ? PAGE_BG : muted ? MUTED : PAGE_BG,
      }}
      aria-hidden
    >
      <path
        d="M1 1L7.5 6L14 1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}
