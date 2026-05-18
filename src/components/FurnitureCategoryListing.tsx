import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CatalogProduct } from "../catalog/catalogPageTypes";
import { ProductDetailModal } from "./ProductDetailModal";
import {
  useCallback,
  useId,
  useState,
  type ChangeEventHandler,
  type FocusEventHandler,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type ReactNode,
} from "react";
import { FONT_NAV } from "../fonts";
import {
  discoverHeartIconSize,
  furnitureListingActionBtnGap,
  furnitureListingBadgeFontSize,
  furnitureListingBadgePadX,
  furnitureListingBadgePadY,
  furnitureListingCardHeaderMaxW,
  furnitureListingCardImageMaxW,
  furnitureListingCardMetaGap,
  furnitureListingCardMetaMaxW,
  furnitureListingCardPad,
  furnitureListingCardRadius,
  furnitureListingCardSectionGap,
  furnitureFilterChipStackGap,
  furnitureFilterInputPadX,
  furnitureFilterInputPadY,
  furnitureFilterInputWidth,
  furnitureFilterPriceInputsGap,
  furnitureFilterSectionStackGap,
  furnitureFilterSliderThumbSize,
  furnitureFilterSliderTrackH,
  furnitureFilterThemeHeaderToChipsGap,
  furnitureFilterToLabelSize,
  furnitureListingChevronH,
  furnitureListingChevronW,
  furnitureListingFilterActionPadX,
  furnitureListingFilterActionPadY,
  furnitureListingFilterIconBox,
  furnitureListingFilterMenuIconH,
  furnitureListingFilterMenuIconW,
  furnitureListingFilterToActionsGap,
  furnitureListingGridColGap,
  furnitureListingGridRowGap,
  furnitureListingImageH,
  furnitureListingPriceSize,
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

const THEME_OPTIONS = ["Japandi", "Eclectic", "Modern Contemporary"] as const;
const PRODUCT_TYPE_OPTIONS = ["Chair", "Coffee Tables", "ottoman"] as const;

const PRICE_MIN = 0;
const PRICE_MAX = 100000;
const PRICE_STEP = 500;

function formatInr(n: number) {
  return n.toLocaleString("en-IN");
}

function parseInr(s: string) {
  const n = Number.parseInt(s.replace(/,/g, "").trim(), 10);
  return Number.isFinite(n) ? n : 0;
}

function clampPrice(n: number) {
  return Math.min(PRICE_MAX, Math.max(PRICE_MIN, n));
}

export type FurnitureCategoryListingProps = {
  products: readonly CatalogProduct[];
  sectionAriaLabel: string;
  /** Third filter accordion label (default: Product Type). Figma rugs 990:6185: Size. */
  filterThirdSectionTitle?: string;
  filterThirdSectionOptions?: readonly string[];
};

/**
 * PLP toolbar, filters, and product grid — Figma 990:5601 (below category hero).
 */
export function FurnitureCategoryListing({
  products,
  sectionAriaLabel,
  filterThirdSectionTitle = "Product Type",
  filterThirdSectionOptions = PRODUCT_TYPE_OPTIONS,
}: FurnitureCategoryListingProps) {
  const [detailProduct, setDetailProduct] = useState<CatalogProduct | null>(
    null,
  );
  const itemCount = products.length;
  const itemLabel = `${itemCount} Item${itemCount === 1 ? "" : "s"}`;

  return (
    <Box
      component="section"
      aria-label={sectionAriaLabel}
      sx={{
        width: "100%",
        boxSizing: "border-box",
        py: furnitureListingSectionPadY,
      }}
    >
      <Stack
        sx={{
          width: "100%",
          gap: furnitureListingSectionGap,
          alignItems: "stretch",
        }}
      >
        <ToolbarRow itemLabel={itemLabel} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{
            gap: furnitureListingSidebarGap,
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <FilterSidebar
            thirdSectionTitle={filterThirdSectionTitle}
            thirdSectionOptions={filterThirdSectionOptions}
          />
          <ProductGrid
            products={products}
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

function ToolbarRow({ itemLabel }: { itemLabel: string }) {
  const sortMenuId = useId();
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOptionId>("bestSelling");
  const reduceMotion = useReducedMotion();
  const { menuContainer, menuItem } = buildSortMenuVariants(reduceMotion);

  const sortLabel =
    SORT_OPTIONS.find((o) => o.id === sortBy)?.label ?? "Best Selling";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        gap: furnitureListingToolbarRowGap,
        width: "100%",
      }}
    >
      <IconButton
        type="button"
        aria-label="Open filters"
        sx={{
          alignSelf: { xs: "flex-start", sm: "center" },
          width: furnitureListingFilterIconBox,
          height: furnitureListingFilterIconBox,
          borderRadius: shopRadius,
          border: `${shopBorderWidth} solid ${BORDER_FILTER}`,
          color: MUTED,
          flexShrink: 0,
        }}
      >
        <FilterMenuIcon />
      </IconButton>

      <Stack
        direction="row"
        alignItems="center"
        sx={{
          gap: furnitureListingToolbarGap,
          flexWrap: "wrap",
          justifyContent: { xs: "flex-start", sm: "flex-end" },
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: navFontSize,
            lineHeight: 1.2,
            textTransform: "uppercase",
            color: TAN,
          }}
        >
          {itemLabel}
        </Typography>

        <ClickAwayListener onClickAway={() => setSortMenuOpen(false)}>
          <Box
            sx={{
              position: "relative",
              alignSelf: { xs: "flex-start", sm: "auto" },
            }}
          >
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
                fontSize: navFontSize,
                lineHeight: 1,
                px: furnitureListingSortPadX,
                py: furnitureListingSortPadY,
                borderRadius: shopRadius,
                minWidth: "auto",
                gap: furnitureListingSortEndGap,
                "&:hover": { bgcolor: TAN, opacity: 0.92 },
                "& .MuiButton-endIcon": { color: PAGE_BG },
              }}
            >
              {sortLabel}
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
                          setSortBy(opt.id);
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
  thirdSectionTitle,
  thirdSectionOptions,
}: {
  thirdSectionTitle: string;
  thirdSectionOptions: readonly string[];
}) {
  const [open, setOpen] = useState({
    price: true,
    theme: true,
    productType: true,
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 50000]);
  const [themes, setThemes] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);

  const toggleSection = (key: keyof typeof open) => {
    setOpen((o) => ({ ...o, [key]: !o[key] }));
  };

  const toggleTheme = useCallback((label: string) => {
    setThemes((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label],
    );
  }, []);

  const toggleProductType = useCallback((label: string) => {
    setProductTypes((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label],
    );
  }, []);

  const clearFilters = useCallback(() => {
    setPriceRange([1000, 50000]);
    setThemes([]);
    setProductTypes([]);
  }, []);

  return (
    <Box
      sx={{
        width: { xs: "100%", md: furnitureListingSidebarWidth },
        maxWidth: "100%",
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      <Stack
        sx={{
          gap: furnitureListingFilterToActionsGap,
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <Stack
          divider={
            <Divider
              sx={{
                borderColor: BORDER_FILTER,
              }}
            />
          }
          sx={{ width: "100%" }}
        >
          <FilterAccordionBlock
            title="Price Range"
            expanded={open.price}
            onToggle={() => toggleSection("price")}
          >
            <Collapse in={open.price}>
              <Box
                sx={{
                  pt: furnitureFilterSectionStackGap,
                  pb: furnitureFilterSectionStackGap,
                  width: "100%",
                }}
              >
                <Stack
                  sx={{ gap: furnitureFilterSectionStackGap, width: "100%" }}
                >
                  <PriceRangeSlider
                    value={priceRange}
                    onChange={setPriceRange}
                  />
                  <PriceRangeInputs
                    value={priceRange}
                    onChange={setPriceRange}
                  />
                </Stack>
              </Box>
            </Collapse>
          </FilterAccordionBlock>

          <FilterAccordionBlock
            title="Theme"
            expanded={open.theme}
            onToggle={() => toggleSection("theme")}
          >
            <Collapse in={open.theme}>
              <Box
                sx={{
                  pt: furnitureFilterThemeHeaderToChipsGap,
                  pb: furnitureFilterSectionStackGap,
                  width: "100%",
                }}
              >
                <Stack
                  sx={{
                    gap: furnitureFilterChipStackGap,
                    alignItems: "flex-start",
                    width: "100%",
                  }}
                >
                  {THEME_OPTIONS.map((label) => (
                    <FilterChip
                      key={label}
                      label={label}
                      selected={themes.includes(label)}
                      onClick={() => toggleTheme(label)}
                    />
                  ))}
                </Stack>
              </Box>
            </Collapse>
          </FilterAccordionBlock>

          <FilterAccordionBlock
            title={thirdSectionTitle}
            expanded={open.productType}
            onToggle={() => toggleSection("productType")}
          >
            <Collapse in={open.productType}>
              <Box
                sx={{
                  pt: furnitureFilterSectionStackGap,
                  pb: furnitureFilterSectionStackGap,
                  width: "100%",
                }}
              >
                <Stack
                  sx={{
                    gap: furnitureFilterChipStackGap,
                    alignItems: "flex-start",
                    width: "100%",
                  }}
                >
                  {thirdSectionOptions.map((label) => (
                    <FilterChip
                      key={label}
                      label={label}
                      selected={productTypes.includes(label)}
                      onClick={() => toggleProductType(label)}
                    />
                  ))}
                </Stack>
              </Box>
            </Collapse>
          </FilterAccordionBlock>
        </Stack>

        <Stack
          direction="row"
          sx={{
            gap: furnitureListingActionBtnGap,
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <Button
            type="button"
            variant="outlined"
            sx={{
              ...filterActionSx,
              px: furnitureListingFilterActionPadX,
              py: furnitureListingFilterActionPadY,
            }}
          >
            View
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={clearFilters}
            sx={{
              ...filterActionSx,
              px: furnitureListingFilterActionPadX,
              py: furnitureListingFilterActionPadY,
            }}
          >
            Clear Filters
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

function FilterAccordionBlock({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
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
          py: 0.5,
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
            fontSize: navFontSize,
            lineHeight: 1,
            textTransform: "uppercase",
            color: MUTED,
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
  onChange,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const handleChange = (_: Event, v: number | number[]) => {
    const [a, b] = v as [number, number];
    const lo = clampPrice(a);
    const hi = clampPrice(b);
    onChange([Math.min(lo, hi), Math.max(lo, hi)]);
  };

  return (
    <Slider
      value={value}
      onChange={handleChange}
      valueLabelDisplay="off"
      min={PRICE_MIN}
      max={PRICE_MAX}
      step={PRICE_STEP}
      disableSwap
      getAriaLabel={(index) =>
        index === 0 ? "Minimum price" : "Maximum price"
      }
      sx={{
        width: "100%",
        mx: 0,
        height: furnitureFilterSliderTrackH,
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
        width: { xs: "100%", sm: furnitureFilterInputWidth },
        maxWidth: "100%",
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
        }}
      />
    </Box>
  );
}

function PriceRangeInputs({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [minEditing, setMinEditing] = useState(false);
  const [maxEditing, setMaxEditing] = useState(false);
  const [minDraft, setMinDraft] = useState("");
  const [maxDraft, setMaxDraft] = useState("");

  const minShown = minEditing ? minDraft : formatInr(value[0]);
  const maxShown = maxEditing ? maxDraft : formatInr(value[1]);

  const commitMin = () => {
    let next = clampPrice(parseInr(minDraft));
    next = Math.min(next, value[1]);
    onChange([next, value[1]]);
    setMinEditing(false);
  };

  const commitMax = () => {
    let next = clampPrice(parseInr(maxDraft));
    next = Math.max(next, value[0]);
    onChange([value[0], next]);
    setMaxEditing(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: furnitureFilterPriceInputsGap,
        flexWrap: "wrap",
        width: "100%",
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
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
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
        px: furnitureFilterInputPadX,
        py: furnitureFilterInputPadY,
        fontFamily: FONT_NAV,
        fontWeight: 600,
        fontSize: navFontSize,
        lineHeight: 1,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: selected ? ACCENT : MUTED,
        bgcolor: "transparent",
        boxShadow: "none",
        "&:hover": {
          borderColor: selected ? ACCENT : TAN,
          bgcolor: "rgba(204, 188, 166, 0.14)",
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
  onOpenProduct,
}: {
  products: readonly CatalogProduct[];
  onOpenProduct: (p: CatalogProduct) => void;
}) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(3, minmax(0, 1fr))",
        },
        rowGap: furnitureListingGridRowGap,
        columnGap: furnitureListingGridColGap,
        width: "100%",
      }}
    >
      {products.map((p) => (
        <ProductCard
          key={`${p.name}-${p.image}`}
          product={p}
          onOpen={() => onOpenProduct(p)}
        />
      ))}
    </Box>
  );
}

function ProductCard({
  product,
  onOpen,
}: {
  product: CatalogProduct;
  onOpen: () => void;
}) {
  const { badge, name, price, image } = product;

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      sx={{
        borderRadius: furnitureListingCardRadius,
        border: `${shopBorderWidth} solid transparent`,
        px: furnitureListingCardPad,
        py: furnitureListingCardPad,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: furnitureListingCardSectionGap,
        cursor: "pointer",
        transition: "border-color 0.15s ease",
        width: "100%",
        "@media (hover: hover)": {
          "&:hover": {
            borderColor: TAN,
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: furnitureListingCardHeaderMaxW,
        }}
      >
        <Box
          sx={{
            bgcolor: TAN,
            color: PAGE_BG,
            px: furnitureListingBadgePadX,
            py: furnitureListingBadgePadY,
            borderRadius: shopRadius,
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: furnitureListingBadgeFontSize,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {badge}
        </Box>
        <Box
          component="span"
          onClick={(e) => e.stopPropagation()}
          sx={{ display: "inline-flex", flexShrink: 0 }}
        >
          <Box
            component="img"
            src="/discover/heart.svg"
            alt=""
            sx={{
              width: discoverHeartIconSize,
              height: discoverHeartIconSize,
              display: "block",
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: furnitureListingCardImageMaxW,
          height: furnitureListingImageH,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={image}
          alt=""
          sx={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            display: "block",
          }}
        />
      </Box>

      <Stack
        sx={{
          alignItems: "flex-start",
          width: "100%",
          maxWidth: furnitureListingCardMetaMaxW,
          gap: furnitureListingCardMetaGap,
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: furnitureListingProductTitleSize,
            lineHeight: 1,
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 500,
            fontSize: furnitureListingPriceSize,
            lineHeight: 1,
            textTransform: "capitalize",
            color: ACCENT,
          }}
        >
          {price}
        </Typography>
      </Stack>
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
