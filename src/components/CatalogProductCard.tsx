import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CatalogProduct } from "../catalog/catalogPageTypes";
import { FONT_NAV } from "../fonts";
import {
  discoverCardInnerGap,
  discoverCardPadX,
  discoverCardPadY,
  discoverCardRadius,
  discoverCardWidth,
  discoverImageBoxH,
  discoverMetaGap,
  discoverPriceSize,
  discoverProductTitleSize,
  discoverTagPadX,
  discoverTagPadY,
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
  furnitureListingImageH,
  furnitureListingPriceSize,
  furnitureListingProductTitleSize,
  furnitureListingGridColGap,
  furnitureListingGridRowGap,
  navFontSize,
  shopBorderWidth,
  shopRadius,
} from "../navDesignTokens";
import { WishlistHeartButton } from "./WishlistHeartButton";

const PAGE_BG = "#f3ede3";
const MUTED = "#4b4a4a";
const ACCENT = "#bc7e5a";
const TAN = "#ccbca6";

export type CatalogProductCardProduct = Pick<
  CatalogProduct,
  "badge" | "name" | "price" | "image"
>;

/** grid = PLP cell; carousel = home discover strip; wide = desktop expanded row */
export type CatalogProductCardShell = "grid" | "carousel" | "wide";

/** Matches PLP 2-column mobile cell width (padding + gap). */
export const catalogProductCardCarouselWidthSx = {
  flex: {
    xs: "0 0 calc(50vw - 20px)",
    sm: "0 0 calc(50vw - 28px)",
    md: `0 0 ${discoverCardWidth}`,
  },
  width: {
    xs: "calc(50vw - 20px)",
    sm: "calc(50vw - 28px)",
    md: discoverCardWidth,
  },
  maxWidth: {
    xs: "calc(50vw - 20px)",
    sm: "calc(50vw - 28px)",
    md: discoverCardWidth,
  },
} as const;

export function catalogProductCardShellSx(shell: CatalogProductCardShell) {
  if (shell === "grid") {
    return {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      maxWidth: "100%",
      minWidth: 0,
      boxSizing: "border-box",
    } as const;
  }

  if (shell === "wide") {
    return {
      display: "flex",
      flexDirection: "column",
      width: discoverCardWidth,
      maxWidth: discoverCardWidth,
      minWidth: discoverCardWidth,
      flex: `0 0 ${discoverCardWidth}`,
      boxSizing: "border-box",
    } as const;
  }

  return {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    scrollSnapAlign: { xs: "start", md: "start" },
    boxSizing: "border-box",
    ...catalogProductCardCarouselWidthSx,
  } as const;
}

type CatalogProductCardProps = {
  product: CatalogProductCardProduct;
  onOpen: () => void;
  shell?: CatalogProductCardShell;
  ariaLabel?: string;
  /** When set, adds data-discover-card for carousel scroll helpers */
  markDiscoverCard?: boolean;
  /** Hover class prefix — catalog-card-* or discover-card-* */
  imageClassName?: string;
  titleClassName?: string;
};

/**
 * Shared product card — compact PLP sizing on mobile everywhere;
 * scales up on md+ for carousel / wide shells.
 */
export function CatalogProductCard({
  product,
  onOpen,
  shell = "grid",
  ariaLabel,
  markDiscoverCard = false,
  imageClassName = "catalog-card-image",
  titleClassName = "catalog-card-title",
}: CatalogProductCardProps) {
  const { badge, name, price, image } = product;
  const isWideShell = shell === "wide";
  const isCarouselShell = shell === "carousel";

  const useDiscoverDesktop = isWideShell || isCarouselShell;

  return (
    <Box sx={catalogProductCardShellSx(shell)}>
      <Box aria-hidden sx={{ height: { xs: 0, md: isCarouselShell ? 10 : 10 }, flexShrink: 0 }} />
      <Box
        role="button"
        tabIndex={0}
        {...(markDiscoverCard ? { "data-discover-card": "" } : {})}
        aria-label={ariaLabel ?? `${name}, ${price}. Open details.`}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
        sx={{
          flex: 1,
          borderRadius: useDiscoverDesktop
            ? { xs: furnitureListingCardRadius, md: discoverCardRadius }
            : furnitureListingCardRadius,
          border: `${shopBorderWidth} solid ${TAN}`,
          boxSizing: "border-box",
          px: useDiscoverDesktop
            ? { xs: 1, sm: 1.5, md: discoverCardPadX }
            : { xs: 1, sm: 1.5, md: furnitureListingCardPad },
          py: useDiscoverDesktop
            ? { xs: 1, sm: 1.5, md: discoverCardPadY }
            : { xs: 1, sm: 1.5, md: furnitureListingCardPad },
          display: "flex",
          flexDirection: "column",
          alignItems: useDiscoverDesktop
            ? { xs: "center", md: "stretch" }
            : "center",
          gap: useDiscoverDesktop
            ? { xs: 1, sm: 1.5, md: discoverCardInnerGap }
            : { xs: 1, sm: 1.5, md: furnitureListingCardSectionGap },
          cursor: "pointer",
          width: "100%",
          bgcolor: "transparent",
          transition:
            "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s ease, border-color 0.28s ease",
          "@media (hover: hover)": {
            "&:hover": {
              transform: "translateY(-6px)",
              borderColor: ACCENT,
              boxShadow: "0 14px 32px rgba(75, 74, 74, 0.12)",
              [`& .${imageClassName}`]: {
                transform: "scale(1.05)",
              },
              [`& .${titleClassName}`]: {
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
            maxWidth: useDiscoverDesktop
              ? { xs: furnitureListingCardHeaderMaxW, md: "100%" }
              : furnitureListingCardHeaderMaxW,
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              bgcolor: TAN,
              color: PAGE_BG,
              px: useDiscoverDesktop
                ? { xs: 0.75, sm: 1, md: discoverTagPadX }
                : { xs: 0.75, sm: 1, md: furnitureListingBadgePadX },
              py: useDiscoverDesktop
                ? { xs: 0.5, sm: 0.75, md: discoverTagPadY }
                : { xs: 0.5, sm: 0.75, md: furnitureListingBadgePadY },
              borderRadius: shopRadius,
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: useDiscoverDesktop
                ? { xs: 9, sm: 10, md: navFontSize }
                : { xs: 9, sm: 10, md: furnitureListingBadgeFontSize },
              textTransform: "uppercase",
              lineHeight: 1,
              whiteSpace: "nowrap",
              maxWidth: "72%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {badge}
          </Box>
          <WishlistHeartButton product={product} />
        </Box>

        <Box
          sx={{
            width: "100%",
            maxWidth: useDiscoverDesktop
              ? { xs: furnitureListingCardImageMaxW, md: "100%" }
              : furnitureListingCardImageMaxW,
            height: useDiscoverDesktop
              ? { xs: 120, sm: 160, md: discoverImageBoxH }
              : { xs: 120, sm: 160, md: furnitureListingImageH },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            mx: useDiscoverDesktop ? { xs: "auto", md: 0 } : "auto",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            className={imageClassName}
            src={image}
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

        <Stack
          sx={{
            alignItems: "flex-start",
            width: "100%",
            maxWidth: useDiscoverDesktop
              ? { xs: furnitureListingCardMetaMaxW, md: "100%" }
              : furnitureListingCardMetaMaxW,
            gap: useDiscoverDesktop
              ? { xs: 0.75, sm: 1, md: discoverMetaGap }
              : { xs: 0.75, sm: 1, md: furnitureListingCardMetaGap },
          }}
        >
          <Typography
            className={titleClassName}
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: useDiscoverDesktop
                ? { xs: 11, sm: 13, md: discoverProductTitleSize }
                : { xs: 11, sm: 13, md: furnitureListingProductTitleSize },
              lineHeight: { xs: 1.25, md: useDiscoverDesktop ? 1.2 : 1 },
              textTransform: "uppercase",
              color: MUTED,
              transition: "color 0.28s ease",
              wordBreak: "break-word",
            }}
          >
            {name}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 500,
              fontSize: useDiscoverDesktop
                ? { xs: 10, sm: 12, md: discoverPriceSize }
                : { xs: 10, sm: 12, md: furnitureListingPriceSize },
              lineHeight: 1,
              textTransform: "capitalize",
              color: ACCENT,
            }}
          >
            {price}
          </Typography>
        </Stack>
      </Box>
      <Box
        aria-hidden
        sx={{
          height: { xs: 0, md: isCarouselShell ? 20 : 20 },
          flexShrink: 0,
        }}
      />
    </Box>
  );
}

export const catalogProductCardGridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(3, minmax(0, 1fr))",
  },
  rowGap: { xs: 1.5, sm: 2.5, md: furnitureListingGridRowGap },
  columnGap: { xs: 1, sm: 1.5, md: furnitureListingGridColGap },
} as const;

/** Shared compact card surface styles for order cards etc. */
export const catalogProductCardSurfaceSx = {
  borderRadius: furnitureListingCardRadius,
  border: `${shopBorderWidth} solid ${TAN}`,
  boxSizing: "border-box",
  px: { xs: 1, sm: 1.5, md: furnitureListingCardPad },
  py: { xs: 1, sm: 1.5, md: furnitureListingCardPad },
  gap: { xs: 1, sm: 1.5, md: furnitureListingCardSectionGap },
} as const;

export const catalogProductCardBadgeSx = {
  bgcolor: TAN,
  color: PAGE_BG,
  px: { xs: 0.75, sm: 1, md: furnitureListingBadgePadX },
  py: { xs: 0.5, sm: 0.75, md: furnitureListingBadgePadY },
  borderRadius: shopRadius,
  fontFamily: FONT_NAV,
  fontWeight: 600,
  fontSize: { xs: 9, sm: 10, md: furnitureListingBadgeFontSize },
  textTransform: "uppercase",
  lineHeight: 1,
} as const;

export const catalogProductCardImageBoxSx = {
  width: "100%",
  maxWidth: furnitureListingCardImageMaxW,
  height: { xs: 120, sm: 160, md: furnitureListingImageH },
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  mx: "auto",
  overflow: "hidden",
} as const;

export const catalogProductCardTitleSx = {
  fontFamily: FONT_NAV,
  fontWeight: 600,
  fontSize: { xs: 11, sm: 13, md: furnitureListingProductTitleSize },
  lineHeight: { xs: 1.25, md: 1 },
  textTransform: "uppercase",
  color: MUTED,
} as const;

export const catalogProductCardPriceSx = {
  fontFamily: FONT_NAV,
  fontWeight: 500,
  fontSize: { xs: 10, sm: 12, md: furnitureListingPriceSize },
  lineHeight: 1,
  textTransform: "capitalize",
  color: ACCENT,
} as const;
