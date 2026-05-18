import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import { fluid1920, megaRadius } from "../navDesignTokens";
import {
  CATALOG_PAGES_SEARCH_INDEX,
  toProductSlug,
} from "../catalog/catalogPageConfig";
import { useShopifyProducts } from "../shopify/hooks";
import { shopifyToCatalogProduct } from "../shopify/mappers";

/* ── Design tokens ── */
const BG = "#f3ede3";
const DARK = "#1a1814";
const MUTED = "#4b4a4a";
const TAN = "#ccbca6";
const ACCENT = "#bc7e5a";
const BORDER = "rgba(204,188,166,0.5)";
const RESULT_HOVER = "rgba(188,126,90,0.08)";

/* ── Types ── */
export type SearchItem = {
  slug: string;
  name: string;
  price: string;
  image: string;
  category: string;
  /** For weighting — exact prefix matches rank higher */
  _nameLower: string;
};

/* ── Build a flat search index from all catalog pages ── */
function buildStaticIndex(): SearchItem[] {
  return CATALOG_PAGES_SEARCH_INDEX.map((p) => ({
    slug: toProductSlug(p.name),
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category,
    _nameLower: p.name.toLowerCase(),
  }));
}

/* ── Fuzzy filter ── */
function filterItems(items: SearchItem[], query: string): SearchItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return items
    .filter((item) => item._nameLower.includes(q))
    .sort((a, b) => {
      const aStarts = a._nameLower.startsWith(q) ? 0 : 1;
      const bStarts = b._nameLower.startsWith(q) ? 0 : 1;
      return aStarts - bStarts;
    })
    .slice(0, 8);
}

/* ── Motion variants ── */
function buildVariants(reduceMotion: boolean | null) {
  const none = reduceMotion === true;
  return {
    hidden: { opacity: 0, y: none ? 0 : -14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: none
        ? { duration: 0 }
        : {
            y: { type: "spring" as const, stiffness: 420, damping: 34 },
            opacity: { duration: 0.2 },
          },
    },
    exit: {
      opacity: 0,
      y: none ? 0 : -8,
      transition: none ? { duration: 0 } : { duration: 0.16 },
    },
  };
}

/* ── Props ── */
type Props = {
  sx?: SxProps<Theme>;
  onClose: () => void;
};

export function SearchDropdown({ sx, onClose }: Props) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const variants = buildVariants(reduceMotion);

  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Build combined index: Shopify live products + static fallback */
  const { data: shopifyData } = useShopifyProducts();
  const allItems: SearchItem[] = (() => {
    if (shopifyData && shopifyData.length > 0) {
      return shopifyData.map((p) => {
        const cp = shopifyToCatalogProduct(p);
        const isRug = p.productType?.toLowerCase().includes("rug") ||
          p.title.toLowerCase().includes("rug");
        return {
          slug: toProductSlug(cp.name),
          name: cp.name,
          price: cp.price,
          image: cp.image,
          category: isRug ? "Rugs" : "Furniture",
          _nameLower: cp.name.toLowerCase(),
        };
      });
    }
    return buildStaticIndex();
  })();

  const results = filterItems(allItems, query);

  /* Auto-focus the input when dropdown opens */
  useEffect(() => {
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Reset active index when results change */
  useEffect(() => setActiveIdx(-1), [results.length]);

  function handleSelect(slug: string) {
    onClose();
    void navigate({ to: "/product/$slug", params: { slug } });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      const hit = results[activeIdx];
      if (hit) handleSelect(hit.slug);
    }
  }

  const showEmpty = query.trim().length > 0 && results.length === 0;
  const showResults = results.length > 0;

  return (
    <Box
      component={motion.div}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="search"
      aria-label="Product search"
      sx={[
        {
          width: "100%",
          bgcolor: BG,
          borderRadius: megaRadius,
          boxShadow: "0 24px 48px rgba(0,0,0,0.09)",
          overflow: "hidden",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {/* ── Search input row ── */}
      <Stack
        direction="row"
        alignItems="center"
        gap="12px"
        sx={{
          px: fluid1920(28, { min: 18, max: 36 }),
          py: fluid1920(18, { min: 14, max: 22 }),
          borderBottom: showResults || showEmpty ? `1px solid ${BORDER}` : "none",
        }}
      >
        {/* Search icon */}
        <Box
          component="svg"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          sx={{ width: 20, height: 20, flexShrink: 0, color: TAN }}
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
          <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </Box>

        <Box
          component="input"
          ref={inputRef}
          type="search"
          placeholder="Search products…"
          value={query}
          autoComplete="off"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search products"
          aria-autocomplete="list"
          aria-activedescendant={activeIdx >= 0 ? `search-result-${activeIdx}` : undefined}
          sx={{
            flex: 1,
            border: "none",
            outline: "none",
            bgcolor: "transparent",
            fontFamily: FONT_NAV,
            fontWeight: 400,
            fontSize: fluid1920(16, { min: 14, max: 18 }),
            color: DARK,
            "::placeholder": { color: TAN, opacity: 1 },
            "&::-webkit-search-cancel-button": { display: "none" },
          }}
        />

        {/* Clear button */}
        {query && (
          <ButtonBase
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            aria-label="Clear search"
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              bgcolor: "rgba(204,188,166,0.3)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": { bgcolor: "rgba(204,188,166,0.5)" },
            }}
          >
            <Box
              component="svg"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              sx={{ width: 12, height: 12 }}
            >
              <path d="M4 4l8 8M12 4l-8 8" stroke={MUTED} strokeWidth="1.6" strokeLinecap="round" />
            </Box>
          </ButtonBase>
        )}

        {/* Close button */}
        <ButtonBase
          onClick={onClose}
          aria-label="Close search"
          sx={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: MUTED,
            "&:hover": { color: DARK, bgcolor: "rgba(204,188,166,0.2)" },
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            sx={{ width: 18, height: 18 }}
          >
            <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0-.01-1.4z" fill="currentColor" />
          </Box>
        </ButtonBase>
      </Stack>

      {/* ── Results ── */}
      {showResults && (
        <Box
          role="listbox"
          aria-label="Search results"
          sx={{
            px: fluid1920(16, { min: 10, max: 20 }),
            py: fluid1920(12, { min: 8, max: 16 }),
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: fluid1920(6, { min: 4, max: 8 }),
          }}
        >
          {results.map((item, idx) => (
            <ButtonBase
              key={item.slug + idx}
              id={`search-result-${idx}`}
              role="option"
              aria-selected={activeIdx === idx}
              onClick={() => handleSelect(item.slug)}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "12px",
                textAlign: "left",
                borderRadius: "12px",
                p: fluid1920(10, { min: 8, max: 12 }),
                bgcolor: activeIdx === idx ? RESULT_HOVER : "transparent",
                border: `1px solid ${activeIdx === idx ? "rgba(188,126,90,0.2)" : "transparent"}`,
                transition: "background 0.12s, border-color 0.12s",
                "&:hover": {
                  bgcolor: RESULT_HOVER,
                  borderColor: "rgba(188,126,90,0.15)",
                },
              }}
            >
              {/* Thumbnail */}
              <Box
                component="img"
                src={item.image}
                alt={item.name}
                sx={{
                  width: fluid1920(56, { min: 44, max: 64 }),
                  height: fluid1920(56, { min: 44, max: 64 }),
                  flexShrink: 0,
                  objectFit: "cover",
                  borderRadius: "8px",
                  bgcolor: "#e8dfd4",
                }}
              />
              {/* Text */}
              <Stack gap="2px" sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 600,
                    fontSize: fluid1920(13, { min: 12, max: 14 }),
                    color: DARK,
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 400,
                    fontSize: fluid1920(11, { min: 10, max: 12 }),
                    color: TAN,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.category}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_SURGENA,
                    fontWeight: 600,
                    fontSize: fluid1920(13, { min: 12, max: 14 }),
                    color: ACCENT,
                  }}
                >
                  {item.price}
                </Typography>
              </Stack>
            </ButtonBase>
          ))}
        </Box>
      )}

      {/* ── Empty state ── */}
      {showEmpty && (
        <Stack
          alignItems="center"
          gap="6px"
          sx={{
            py: fluid1920(32, { min: 24, max: 40 }),
            px: fluid1920(28, { min: 18, max: 36 }),
          }}
        >
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 500,
              fontSize: fluid1920(14, { min: 13, max: 15 }),
              color: MUTED,
            }}
          >
            No products found for "{query}"
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 400,
              fontSize: fluid1920(12, { min: 11, max: 13 }),
              color: TAN,
            }}
          >
            Try searching by collection or product type
          </Typography>
        </Stack>
      )}

      {/* ── Initial hint (no query yet) ── */}
      {!query && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={fluid1920(6, { min: 4, max: 8 })}
          sx={{
            px: fluid1920(20, { min: 14, max: 26 }),
            pb: fluid1920(16, { min: 12, max: 20 }),
            pt: fluid1920(10, { min: 8, max: 14 }),
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: fluid1920(11, { min: 10, max: 12 }),
              color: TAN,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              alignSelf: "center",
              mr: "6px",
              whiteSpace: "nowrap",
            }}
          >
            Quick search:
          </Typography>
          {["Chair", "Rug", "Dunari", "Eira", "Ottoman", "Table"].map((hint) => (
            <ButtonBase
              key={hint}
              onClick={() => setQuery(hint)}
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 500,
                fontSize: fluid1920(12, { min: 11, max: 13 }),
                color: MUTED,
                bgcolor: "rgba(204,188,166,0.22)",
                border: `1px solid ${BORDER}`,
                borderRadius: "20px",
                px: "12px",
                py: "5px",
                "&:hover": { bgcolor: "rgba(188,126,90,0.1)", color: ACCENT, borderColor: "rgba(188,126,90,0.3)" },
                transition: "all 0.14s",
              }}
            >
              {hint}
            </ButtonBase>
          ))}
        </Stack>
      )}
    </Box>
  );
}
