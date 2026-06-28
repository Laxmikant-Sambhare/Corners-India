import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import { motion, useReducedMotion } from "framer-motion";
import { Link as RouterLink, useRouterState } from "@tanstack/react-router";
import { FONT_NAV, FONT_NAV_SHOP } from "../fonts";
import {
  megaGap,
  megaImgHeight,
  megaImgWidth,
  megaLinkGap,
  megaMinHeight,
  megaPadLeft,
  megaPadRight,
  megaPadY,
  megaRadius,
  megaTitleMarginBottom,
  navFontSize,
  fluid1920,
  shopRadius,
} from "../navDesignTokens";

const LABEL = "#7c7c7c";
const ACCENT = "#bc7e5a";
const TEXT = "#4b4a4a";
const PAGE_BG = "#f3ede3";
const TAN = "#ccbca6";
const BORDER = "rgba(204,188,166,0.45)";
const MEGA_FEATURE_IMG =
  "https://cdn.shopify.com/s/files/1/0990/0464/5681/files/mega-menu-feature.webp";

const linkBase = {
  display: "block",
  fontFamily: FONT_NAV,
  fontWeight: 500,
  color: TEXT,
  textDecoration: "none",
  textTransform: "uppercase" as const,
  lineHeight: 1.4,
  "&:hover": { color: ACCENT },
};

const easeOut = [0.32, 0.72, 0, 1] as const;

function buildVariants(reduceMotion: boolean | null) {
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
      transition: none ? { duration: 0 } : { duration: 0.18, ease: easeOut },
    },
  };

  const menuItem = {
    hidden: { opacity: 0, y: none ? 0 : -12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: none
        ? { duration: 0 }
        : { duration: 0.22, ease: easeOut },
    },
  };

  return { menuContainer, menuItem };
}

type Props = {
  sx?: SxProps<Theme>;
};

function megaShopLinkSx(selected: boolean) {
  return {
    ...linkBase,
    fontSize: navFontSize,
    fontFamily: FONT_NAV_SHOP,
    fontWeight: selected ? 600 : 500,
    color: selected ? ACCENT : TEXT,
    "&:hover": { color: ACCENT },
  } as const;
}

function MegaChevron() {
  return (
    <Box
      component="svg"
      viewBox="0 0 18 12"
      aria-hidden
      sx={{ width: 12, height: 7, flexShrink: 0, color: TAN, display: "block" }}
      fill="none"
    >
      <path
        d="M6 2L12 6L6 10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}

function MobileMegaLink({
  label,
  to,
  selected,
  shopStyle = false,
}: {
  label: string;
  to: string;
  selected: boolean;
  shopStyle?: boolean;
}) {
  return (
    <Box
      component={RouterLink}
      to={to}
      aria-current={selected ? "page" : undefined}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        px: 1.5,
        py: 1.25,
        borderRadius: shopRadius,
        border: `1px solid ${selected ? ACCENT : BORDER}`,
        bgcolor: selected ? "rgba(188,126,90,0.1)" : "rgba(255,255,255,0.5)",
        textDecoration: "none",
        transition: "border-color 0.18s, background-color 0.18s, transform 0.15s",
        "&:active": { transform: "scale(0.99)" },
      }}
    >
      <Typography
        sx={{
          fontFamily: shopStyle ? FONT_NAV_SHOP : FONT_NAV,
          fontWeight: 600,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: shopStyle ? "0.04em" : "0.06em",
          color: selected ? ACCENT : TEXT,
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
      <MegaChevron />
    </Box>
  );
}

function MobileMegaSection({
  title,
  children,
  muted = false,
}: {
  title: string;
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <Box
      sx={{
        borderRadius: shopRadius,
        border: `1px solid ${BORDER}`,
        bgcolor: muted ? "rgba(204,188,166,0.12)" : "rgba(255,255,255,0.42)",
        backdropFilter: "blur(6px)",
        px: 1.5,
        py: 1.5,
      }}
    >
      <Typography
        sx={{
          fontFamily: FONT_NAV,
          fontSize: 10,
          fontWeight: 600,
          color: muted ? TAN : LABEL,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          mb: 1,
          px: 0.25,
        }}
      >
        {title}
      </Typography>
      <Stack gap={0.75}>{children}</Stack>
    </Box>
  );
}

export function ShopMegaMenu({ sx }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduceMotion = useReducedMotion();
  const { menuContainer, menuItem } = buildVariants(reduceMotion);

  return (
    <Box
      id="shop-mega-menu"
      role="navigation"
      aria-label="Shop"
      component={motion.div}
      variants={menuContainer}
      initial="hidden"
      animate="visible"
      exit="exit"
      sx={[
        {
          width: "100%",
          bgcolor: PAGE_BG,
          borderRadius: { xs: shopRadius, lg: megaRadius },
          border: { xs: `1px solid ${BORDER}`, lg: "none" },
          px: { xs: 1.5, sm: 2, md: fluid1920(32, { min: 16, max: 48 }) },
          pl: { lg: megaPadLeft },
          pr: { lg: megaPadRight },
          py: { xs: 1.75, sm: 2.5, lg: megaPadY },
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: { xs: 1.25, sm: 2, lg: megaGap },
          alignItems: { lg: "flex-start" },
          justifyContent: "space-between",
          boxShadow: {
            xs: "0 12px 32px rgba(26,24,20,0.08)",
            lg: "0 24px 48px rgba(0, 0, 0, 0.08)",
          },
          minHeight: { lg: megaMinHeight },
          overflow: "hidden",
          position: "relative",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {/* Mobile / tablet */}
      <Stack
        component={motion.div}
        variants={menuItem}
        sx={{
          display: { xs: "flex", lg: "none" },
          width: "100%",
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 24,
            height: "2px",
            bgcolor: ACCENT,
            borderRadius: "1px",
            mb: 0.25,
          }}
        />

        <MobileMegaSection title="Category">
          <MobileMegaLink
            label="Furniture"
            to="/category/furniture"
            selected={pathname === "/category/furniture"}
            shopStyle
          />
          <MobileMegaLink
            label="Rugs"
            to="/category/rugs"
            selected={pathname === "/category/rugs"}
            shopStyle
          />
        </MobileMegaSection>

        <MobileMegaSection title="Shop by collection">
          <MobileMegaLink
            label="Dunari"
            to="/collections/dunari"
            selected={pathname === "/collections/dunari"}
            shopStyle
          />
          <MobileMegaLink
            label="Eira"
            to="/collections/eira"
            selected={pathname === "/collections/eira"}
            shopStyle
          />
        </MobileMegaSection>

        <MobileMegaSection title="Limited collection" muted>
          <Box
            sx={{
              px: 1.5,
              py: 1.25,
              borderRadius: shopRadius,
              border: `1px dashed ${BORDER}`,
              bgcolor: "rgba(255,255,255,0.35)",
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 600,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: TAN,
                lineHeight: 1.2,
              }}
            >
              Stay tuned
            </Typography>
          </Box>
        </MobileMegaSection>

        <Box
          sx={{
            position: "relative",
            borderRadius: shopRadius,
            overflow: "hidden",
            border: `1px solid ${BORDER}`,
            mt: 0.25,
          }}
        >
          <Box
            component="img"
            src={MEGA_FEATURE_IMG}
            alt="Corners furniture collection"
            sx={{
              display: "block",
              width: "100%",
              height: "auto",
              aspectRatio: "16 / 10",
              objectFit: "cover",
            }}
          />
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, transparent 40%, rgba(26,24,20,0.35) 100%)",
              pointerEvents: "none",
            }}
          />
          <Typography
            sx={{
              position: "absolute",
              left: 12,
              bottom: 12,
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: PAGE_BG,
            }}
          >
            New arrivals soon
          </Typography>
        </Box>
      </Stack>

      {/* Desktop */}
      <Box
        sx={{
          display: { xs: "none", lg: "contents" },
        }}
      >
        <MegaColumn title="Category" variants={menuItem}>
          <Typography
            component={RouterLink}
            to="/category/furniture"
            aria-current={pathname === "/category/furniture" ? "page" : undefined}
            sx={{
              ...megaShopLinkSx(pathname === "/category/furniture"),
              mb: megaLinkGap,
            }}
          >
            Furniture
          </Typography>
          <Typography
            component={RouterLink}
            to="/category/rugs"
            aria-current={pathname === "/category/rugs" ? "page" : undefined}
            sx={megaShopLinkSx(pathname === "/category/rugs")}
          >
            Rugs
          </Typography>
        </MegaColumn>

        <MegaColumn title="Shop by collection" variants={menuItem}>
          <Typography
            component={RouterLink}
            to="/collections/dunari"
            aria-current={pathname === "/collections/dunari" ? "page" : undefined}
            sx={{
              ...megaShopLinkSx(pathname === "/collections/dunari"),
              mb: megaLinkGap,
            }}
          >
            Dunari
          </Typography>
          <Typography
            component={RouterLink}
            to="/collections/eira"
            aria-current={pathname === "/collections/eira" ? "page" : undefined}
            sx={megaShopLinkSx(pathname === "/collections/eira")}
          >
            Eira
          </Typography>
        </MegaColumn>

        <MegaColumn title="Limited collection" variants={menuItem}>
          <Typography
            sx={{
              ...linkBase,
              fontSize: navFontSize,
              cursor: "default",
              "&:hover": { color: TEXT },
            }}
          >
            Stay tuned
          </Typography>
        </MegaColumn>

        <Box
          component={motion.div}
          variants={menuItem}
          sx={{ alignSelf: { xs: "stretch", sm: "flex-start" }, flexShrink: 0 }}
        >
          <Box
            component="img"
            src={MEGA_FEATURE_IMG}
            alt=""
            sx={{
              display: "block",
              width: { xs: "100%", sm: megaImgWidth },
              height: { xs: "auto", sm: megaImgHeight },
              aspectRatio: { xs: "332.267 / 220.267", sm: "auto" },
              borderRadius: megaRadius,
              objectFit: "cover",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

function MegaColumn({
  title,
  children,
  variants,
}: {
  title: string;
  children: ReactNode;
  variants: ReturnType<typeof buildVariants>["menuItem"];
}) {
  return (
    <Box
      component={motion.div}
      variants={variants}
      sx={{ minWidth: { sm: fluid1920(140, { min: 120, max: 160 }) } }}
    >
      <Typography
        sx={{
          fontFamily: FONT_NAV,
          fontSize: navFontSize,
          fontWeight: 600,
          color: LABEL,
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          mb: megaTitleMarginBottom,
        }}
      >
        {title}
      </Typography>
      <Box>{children}</Box>
    </Box>
  );
}
