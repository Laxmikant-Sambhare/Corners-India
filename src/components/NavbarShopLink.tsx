import Button from "@mui/material/Button";
import type { MouseEventHandler } from "react";
import { Link as RouterLink } from "@tanstack/react-router";
import { FONT_NAV_SHOP } from "../fonts";
import {
  shopBorderWidth,
  shopFontSize,
  shopPadX,
  shopPadY,
  shopRadius,
} from "../navDesignTokens";

const ACCENT = "#bc7e5a";

type Props = {
  to: string;
  children: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  /** Mega menu open — filled pill while dropdown is visible. */
  menuOpen?: boolean;
};

const CREAM = "#F3EDE3";

const a11y = (menuOpen: boolean | undefined) => ({
  "aria-controls": menuOpen ? "shop-mega-menu" : undefined,
  "aria-expanded": Boolean(menuOpen),
  "aria-haspopup": true as const,
});

export function NavbarShopLink({ to, children, onClick, menuOpen }: Props) {
  if (menuOpen) {
    return (
      <Button
        component={RouterLink}
        to={to}
        onClick={onClick}
        {...a11y(menuOpen)}
        variant="text"
        disableElevation
        sx={{
          fontFamily: FONT_NAV_SHOP,
          textTransform: "uppercase",
          fontSize: { xs: "0.75rem", sm: shopFontSize },
          fontWeight: 600,
          lineHeight: 1,
          px: { xs: 1.25, sm: shopPadX },
          py: { xs: 0.625, sm: shopPadY },
          minWidth: "auto",
          flexShrink: 0,
          borderRadius: shopRadius,
          color: CREAM,
          bgcolor: ACCENT,
          border: `${shopBorderWidth} solid`,
          borderColor: ACCENT,
          boxShadow: "none",
          "&:hover": {
            bgcolor: ACCENT,
            color: CREAM,
            opacity: 0.94,
          },
        }}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      component={RouterLink}
      to={to}
      onClick={onClick}
      {...a11y(menuOpen)}
      variant="outlined"
      sx={{
        fontFamily: FONT_NAV_SHOP,
        textTransform: "uppercase",
        fontSize: { xs: "0.75rem", sm: shopFontSize },
        fontWeight: 600,
        lineHeight: 1,
        px: { xs: 1.25, sm: shopPadX },
        py: { xs: 0.625, sm: shopPadY },
        minWidth: "auto",
        flexShrink: 0,
        borderRadius: shopRadius,
        borderWidth: shopBorderWidth,
        borderColor: ACCENT,
        color: ACCENT,
        "&:hover": {
          borderColor: ACCENT,
          bgcolor: "rgba(188, 126, 90, 0.06)",
        },
      }}
    >
      {children}
    </Button>
  );
}
