import Box from "@mui/material/Box";
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
} from "../navDesignTokens";

const LABEL = "#7c7c7c";
const ACCENT = "#bc7e5a";
const TEXT = "#4b4a4a";

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
          bgcolor: "#f3ede3",
          borderRadius: megaRadius,
          px: { xs: 2, sm: 3, md: fluid1920(32, { min: 16, max: 48 }) },
          pl: { lg: megaPadLeft },
          pr: { lg: megaPadRight },
          py: { xs: 3, lg: megaPadY },
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: { xs: 3, lg: megaGap },
          alignItems: { lg: "flex-start" },
          justifyContent: "space-between",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.08)",
          minHeight: { lg: megaMinHeight },
          overflow: "hidden",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
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
          src="https://cdn.shopify.com/s/files/1/0990/0464/5681/files/mega-menu-feature.webp"
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
