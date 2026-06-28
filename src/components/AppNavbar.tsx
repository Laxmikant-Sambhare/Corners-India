import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme, type SxProps, type Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link as RouterLink, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import type { MouseEventHandler } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  navbarMarginX,
  navFontSize,
  navIconSize,
  navLinkGap,
  navLogoHeight,
  navMegaMenuMarginTop,
  navPillPadX,
  navPillPadY,
  navPillRadius,
  shopFontSize,
  shopRadius,
} from "../navDesignTokens";
import { FONT_NAV, FONT_NAV_SHOP, FONT_SURGENA } from "../fonts";
import { layoutPaddingX } from "../layoutConstants";
import { selectIsLoggedIn, useAuthStore } from "../store/authStore";
import { cartTotalItems, useCartStore } from "../store/cartStore";
import { useWishlistStore, wishlistTotalItems } from "../store/wishlistStore";
import { CartDropdown } from "./CartDropdown";
import {
  navIconColor,
  NavCartIcon,
  NavHeartIcon,
  NavSearchIcon,
  NAV_CHROME_MUTED,
} from "./NavChromeIcons";
import { WishlistDropdown } from "./WishlistDropdown";
import { NavbarShopLink } from "./NavbarShopLink";
import { NavbarTextLink } from "./NavbarTextLink";
import { SearchDropdown } from "./SearchDropdown";
import { ShopMegaMenu } from "./ShopMegaMenu";
import { UserAvatarButton, UserDropdownPanel } from "./UserDropdown";

const LOGO_SRC = "/nav/logo.svg";

const SCROLL_TOP_SHOW_PX = 32;
const SCROLL_DIRECTION_DELTA = 6;

const MOBILE_ICON_CLUSTER_SX = {
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  bgcolor: "rgba(204,188,166,0.14)",
  border: "1px solid rgba(204,188,166,0.38)",
  borderRadius: 999,
  px: 0.25,
  py: 0.25,
} as const;

const MOBILE_ICON_BTN_SX = {
  minWidth: { xs: 36, sm: 40 },
  minHeight: { xs: 36, sm: 40 },
  p: 0.5,
} as const;

const MOBILE_BADGE_SX = {
  "& .MuiBadge-badge": {
    bgcolor: "#bc7e5a",
    color: "#f3ede3",
    fontSize: "9px",
    fontWeight: 700,
    minWidth: "16px",
    height: "16px",
    borderRadius: "8px",
    top: 4,
    right: 2,
    padding: "0 4px",
  },
} as const;

const DRAWER_ACCENT = "#bc7e5a";
const DRAWER_PAGE_BG = "#f3ede3";
const DRAWER_DARK = "#1a1814";
const DRAWER_MUTED = "#4b4a4a";
const DRAWER_TAN = "#ccbca6";
const DRAWER_BORDER = "rgba(204,188,166,0.45)";

function DrawerChevron() {
  return (
    <Box
      component="svg"
      viewBox="0 0 18 12"
      aria-hidden
      sx={{
        width: 14,
        height: 8,
        flexShrink: 0,
        color: DRAWER_TAN,
        display: "block",
      }}
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

function MobileDrawerNavItem({
  label,
  selected = false,
  shopStyle = false,
  onClick,
  to,
}: {
  label: string;
  selected?: boolean;
  shopStyle?: boolean;
  onClick?: () => void;
  to?: string;
}) {
  const cardSx = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.5,
    px: 2,
    py: 1.75,
    borderRadius: shopRadius,
    border: `1px solid ${selected ? DRAWER_ACCENT : DRAWER_BORDER}`,
    bgcolor: selected ? "rgba(188,126,90,0.1)" : "rgba(255,255,255,0.48)",
    backdropFilter: "blur(6px)",
    textAlign: "left" as const,
    transition: "border-color 0.18s, background-color 0.18s, transform 0.15s",
    textDecoration: "none",
    color: "inherit",
    boxSizing: "border-box" as const,
    "&:active": { transform: "scale(0.99)" },
  };

  const labelEl = (
    <Typography
      sx={{
        fontFamily: shopStyle ? FONT_NAV_SHOP : FONT_NAV,
        fontWeight: 600,
        fontSize: shopStyle ? shopFontSize : { xs: "0.8125rem", sm: navFontSize },
        textTransform: "uppercase",
        letterSpacing: shopStyle ? "0.04em" : "0.06em",
        color: selected ? DRAWER_ACCENT : DRAWER_DARK,
        lineHeight: 1.2,
      }}
    >
      {label}
    </Typography>
  );

  if (to) {
    return (
      <Box component={RouterLink} to={to} onClick={onClick} sx={cardSx}>
        {labelEl}
        <DrawerChevron />
      </Box>
    );
  }

  return (
    <ButtonBase onClick={onClick} sx={cardSx}>
      {labelEl}
      <DrawerChevron />
    </ButtonBase>
  );
}

function MenuHamburgerIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      width={22}
      height={22}
      aria-hidden
      sx={{ display: "block", fill: "currentColor" }}
    >
      <path d="M4 7h16v1.5H4V7zm0 4.25h16v1.5H4v-1.5zm0 4.25h16V17H4v-1.5z" />
    </Box>
  );
}

function CloseIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      width={22}
      height={22}
      aria-hidden
      sx={{ display: "block", fill: "currentColor" }}
    >
      <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0-.01-1.4z" />
    </Box>
  );
}

type Props = {
  sx?: SxProps<Theme>;
  /**
   * When true (default), an in-flow spacer keeps page content from sitting under the fixed bar.
   * Set false for hero overlays where the bar should not reserve vertical space in the document.
   */
  reserveLayoutSpace?: boolean;
};

export function AppNavbar({ sx, reserveLayoutSpace = true }: Props) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const isViewportCompact = useMediaQuery(theme.breakpoints.down("lg"));
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const shellRef = useRef<HTMLDivElement>(null);
  const [sentinelHeight, setSentinelHeight] = useState(0);
  /** Collapse to hamburger when the bar itself is too narrow (e.g. DevTools docked). */
  const [isContainerCompact, setIsContainerCompact] = useState(false);
  const isCompactNav = isViewportCompact || isContainerCompact;

  const [navPinned, setNavPinned] = useState(true);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const loggedIn = useAuthStore(selectIsLoggedIn);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(
    typeof window !== "undefined" ? window.scrollY : 0,
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMobileMenuOpen(false);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (!loggedIn) setUserMenuOpen(false);
  }, [loggedIn]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const prev = lastScrollY.current;
      lastScrollY.current = y;
      const delta = y - prev;

      if (y <= SCROLL_TOP_SHOW_PX) {
        setNavPinned(true);
        return;
      }
      if (delta > SCROLL_DIRECTION_DELTA) {
        setNavPinned(false);
        setShopMenuOpen(false);
        setCartOpen(false);
        setWishlistOpen(false);
        setUserMenuOpen(false);
        setSearchOpen(false);
        setMobileMenuOpen(false);
      } else if (delta < -SCROLL_DIRECTION_DELTA) {
        setNavPinned(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartItems = useCartStore((s) => s.items);
  const totalUnits = cartTotalItems(cartItems);
  const wishlistItems = useWishlistStore((s) => s.items);
  const savedCount = wishlistTotalItems(wishlistItems);

  const handleShopClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    setShopMenuOpen((open) => !open);
    setCartOpen(false);
    setWishlistOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  };

  const handleCartClick = () => {
    setCartOpen((open) => !open);
    setShopMenuOpen(false);
    setWishlistOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const handleWishlistClick = () => {
    setWishlistOpen((open) => !open);
    setShopMenuOpen(false);
    setCartOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const handleSearchClick = () => {
    setSearchOpen((open) => !open);
    setShopMenuOpen(false);
    setCartOpen(false);
    setWishlistOpen(false);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const openShopFromDrawer = () => {
    setMobileMenuOpen(false);
    setCartOpen(false);
    setWishlistOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
    setShopMenuOpen((open) => !open);
  };

  const handleClickAway = () => {
    setShopMenuOpen(false);
    setCartOpen(false);
    setWishlistOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  };

  useLayoutEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    const NAV_EXPAND_MIN_W = 1040;

    const measure = () => {
      const width = el.getBoundingClientRect().width;
      setIsContainerCompact(width > 0 && width < NAV_EXPAND_MIN_W);
      if (reserveLayoutSpace) {
        setSentinelHeight(Math.ceil(el.getBoundingClientRect().height));
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [reserveLayoutSpace]);

  const transformTransition = reduceMotion
    ? "none"
    : theme.transitions.create("transform", {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeInOut,
      });

  return (
    <>
      {reserveLayoutSpace && (
        <Box
          aria-hidden
          sx={{
            flexShrink: 0,
            height:
              sentinelHeight > 0
                ? `${sentinelHeight}px`
                : { xs: "84px", sm: "92px", md: "96px" },
          }}
        />
      )}
      <Box
        ref={shellRef}
        sx={[
          {
            width: "100%",
            px: {
              xs: layoutPaddingX.xs,
              sm: layoutPaddingX.sm,
              md: navbarMarginX,
            },
            pt: {
              xs: `calc(${theme.spacing(1.5)} + env(safe-area-inset-top, 0px))`,
              sm: `calc(${theme.spacing(2)} + env(safe-area-inset-top, 0px))`,
              md: 2.5,
            },
            pb: { xs: 0.75, sm: 1 },
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.appBar,
            transform: navPinned ? "translateY(0)" : "translateY(-100%)",
            transition: transformTransition,
            willChange: "transform",
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
          {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.appBar,
            transform: navPinned ? "translateY(0)" : "translateY(-100%)",
            transition: transformTransition,
          },
        ]}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ position: "relative", width: "100%" }}>
            <Box
              sx={{
                borderRadius: { xs: 2, sm: 2.5, md: navPillRadius },
                bgcolor: "background.default",
                boxShadow: isCompactNav
                  ? "0 1px 0 rgba(0,0,0,0.04), 0 2px 12px rgba(0,0,0,0.05)"
                  : "none",
                px: {
                  xs: isCompactNav ? 1 : 2,
                  sm: isCompactNav ? 1.5 : 3,
                  md: navPillPadX,
                },
                py: {
                  xs: isCompactNav ? 0.875 : 2,
                  md: navPillPadY,
                },
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: isCompactNav ? 1 : 3,
                minHeight: isCompactNav ? 48 : undefined,
                flexWrap: "nowrap",
              }}
            >
              {isCompactNav ? (
                <>
                  <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                      gap: { xs: 0.75, sm: 1 },
                      minWidth: 0,
                      flexShrink: 1,
                    }}
                  >
                    <IconButton
                      type="button"
                      aria-label="Open menu"
                      aria-expanded={mobileMenuOpen}
                      aria-haspopup="true"
                      size="small"
                      onClick={() => {
                        setMobileMenuOpen(true);
                        setShopMenuOpen(false);
                        setCartOpen(false);
                        setWishlistOpen(false);
                      }}
                      sx={{
                        ...MOBILE_ICON_BTN_SX,
                        ml: -0.25,
                        color: NAV_CHROME_MUTED,
                      }}
                    >
                      <MenuHamburgerIcon />
                    </IconButton>
                    <Box
                      component={RouterLink}
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      sx={{
                        minWidth: 0,
                        display: "flex",
                        alignItems: "center",
                        lineHeight: 0,
                        py: 0.25,
                      }}
                    >
                      <Box
                        sx={{
                          lineHeight: 0,
                          "& img": {
                            display: "block",
                            height: { xs: 22, sm: 24 },
                            width: "auto",
                            maxWidth: { xs: "min(108px, 36vw)", sm: "min(122px, 42vw)" },
                          },
                        }}
                      >
                        <img
                          src={LOGO_SRC}
                          alt="Corners India"
                          width={135}
                          height={32}
                        />
                      </Box>
                    </Box>
                  </Stack>

                  <Box sx={MOBILE_ICON_CLUSTER_SX}>
                    <IconButton
                      type="button"
                      aria-label="Search"
                      aria-expanded={searchOpen}
                      size="small"
                      onClick={handleSearchClick}
                      sx={{
                        ...MOBILE_ICON_BTN_SX,
                        color: navIconColor(searchOpen),
                      }}
                    >
                      <NavSearchIcon height={18} />
                    </IconButton>
                    <UserAvatarButton
                      size="small"
                      open={userMenuOpen}
                      onToggle={() => {
                        setUserMenuOpen((v) => !v);
                        setCartOpen(false);
                        setWishlistOpen(false);
                        setShopMenuOpen(false);
                        setSearchOpen(false);
                      }}
                    />
                    <IconButton
                      type="button"
                      aria-label="Saved products"
                      aria-expanded={wishlistOpen}
                      aria-controls={wishlistOpen ? "wishlist-dropdown" : undefined}
                      size="small"
                      onClick={handleWishlistClick}
                      sx={{
                        ...MOBILE_ICON_BTN_SX,
                        color: navIconColor(wishlistOpen),
                      }}
                    >
                      <Badge badgeContent={savedCount || null} sx={MOBILE_BADGE_SX}>
                        <NavHeartIcon height={18} />
                      </Badge>
                    </IconButton>
                    <IconButton
                      type="button"
                      aria-label="Shopping cart"
                      aria-expanded={cartOpen}
                      aria-controls={cartOpen ? "cart-dropdown" : undefined}
                      size="small"
                      onClick={handleCartClick}
                      sx={{
                        ...MOBILE_ICON_BTN_SX,
                        mr: 0.125,
                        color: navIconColor(cartOpen),
                      }}
                    >
                      <Badge badgeContent={totalUnits || null} sx={MOBILE_BADGE_SX}>
                        <NavCartIcon height={18} />
                      </Badge>
                    </IconButton>
                  </Box>
                </>
              ) : (
                <>
                  <Box
                    component={RouterLink}
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    sx={{
                      display: "block",
                      lineHeight: 0,
                      flexShrink: 0,
                      minWidth: 0,
                      "& img": {
                        display: "block",
                        height: navLogoHeight,
                        width: "auto",
                      },
                    }}
                  >
                    <img
                      src={LOGO_SRC}
                      alt="Corners India"
                      width={135}
                      height={32}
                    />
                  </Box>

                  <Stack
                    direction="row"
                    flexWrap="nowrap"
                    useFlexGap
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      gap: { lg: 4, xl: navLinkGap },
                    }}
                  >
                    <NavbarShopLink
                      to="/"
                      onClick={handleShopClick}
                      menuOpen={shopMenuOpen}
                    >
                      Shop
                    </NavbarShopLink>
                    <NavbarTextLink to="/customizations">
                      Customizations
                    </NavbarTextLink>
                    <NavbarTextLink to="/discover">
                      Discover Corners
                    </NavbarTextLink>
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    spacing={0.5}
                    sx={{ flexShrink: 0 }}
                  >
                    <IconButton
                      type="button"
                      aria-label="Search"
                      aria-expanded={searchOpen}
                      size="small"
                      onClick={handleSearchClick}
                      sx={{
                        p: 0.75,
                        color: navIconColor(searchOpen),
                      }}
                    >
                      <NavSearchIcon height={navIconSize} />
                    </IconButton>
                    <UserAvatarButton size="small" open={userMenuOpen} onToggle={() => { setUserMenuOpen((v) => !v); setCartOpen(false); setWishlistOpen(false); setShopMenuOpen(false); setSearchOpen(false); }} />
                    <IconButton
                      type="button"
                      aria-label="Saved products"
                      aria-expanded={wishlistOpen}
                      aria-controls={wishlistOpen ? "wishlist-dropdown" : undefined}
                      size="small"
                      onClick={handleWishlistClick}
                      sx={{
                        p: 0.75,
                        color: navIconColor(wishlistOpen),
                      }}
                    >
                      <Badge
                        badgeContent={savedCount || null}
                        sx={{
                          "& .MuiBadge-badge": {
                            bgcolor: "#bc7e5a",
                            color: "#f3ede3",
                            fontSize: "10px",
                            fontWeight: 700,
                            minWidth: "18px",
                            height: "18px",
                            borderRadius: "9px",
                            top: 2,
                            right: 2,
                          },
                        }}
                      >
                        <NavHeartIcon height={navIconSize} />
                      </Badge>
                    </IconButton>
                    <IconButton
                      type="button"
                      aria-label="Shopping cart"
                      aria-expanded={cartOpen}
                      aria-controls={cartOpen ? "cart-dropdown" : undefined}
                      size="small"
                      onClick={handleCartClick}
                      sx={{
                        p: 0.75,
                        color: navIconColor(cartOpen),
                      }}
                    >
                      <Badge
                        badgeContent={totalUnits || null}
                        sx={{
                          "& .MuiBadge-badge": {
                            bgcolor: "#bc7e5a",
                            color: "#f3ede3",
                            fontSize: "10px",
                            fontWeight: 700,
                            minWidth: "18px",
                            height: "18px",
                            borderRadius: "9px",
                            top: 2,
                            right: 2,
                          },
                        }}
                      >
                        <NavCartIcon height={navIconSize} />
                      </Badge>
                    </IconButton>
                  </Stack>
                </>
              )}
            </Box>

            {/* Shop mega-menu */}
            <AnimatePresence>
              {shopMenuOpen && (
                <ShopMegaMenu
                  key="shop-mega-menu"
                  sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: "100%",
                    mt: navMegaMenuMarginTop,
                    zIndex: 20,
                  }}
                />
              )}
            </AnimatePresence>

            {/* Search dropdown */}
            <AnimatePresence>
              {searchOpen && (
                <SearchDropdown
                  key="search-dropdown"
                  onClose={() => setSearchOpen(false)}
                  sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: "100%",
                    mt: navMegaMenuMarginTop,
                    zIndex: 20,
                  }}
                />
              )}
            </AnimatePresence>

            {/* User dropdown */}
            <AnimatePresence>
              {userMenuOpen && loggedIn && (
                <UserDropdownPanel
                  key="user-dropdown"
                  onClose={() => setUserMenuOpen(false)}
                />
              )}
            </AnimatePresence>

            {/* Wishlist dropdown */}
            <AnimatePresence>
              {wishlistOpen && (
                <WishlistDropdown
                  key="wishlist-dropdown"
                  onClose={() => setWishlistOpen(false)}
                />
              )}
            </AnimatePresence>

            {/* Cart dropdown */}
            <AnimatePresence>
              {cartOpen && (
                <CartDropdown
                  key="cart-dropdown"
                  onClose={() => setCartOpen(false)}
                />
              )}
            </AnimatePresence>

            <Drawer
              anchor="left"
              open={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
              ModalProps={{ keepMounted: true }}
              PaperProps={{
                sx: {
                  width: "min(320px, 88vw)",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                  pt: `calc(${theme.spacing(2)} + env(safe-area-inset-top, 0px))`,
                  pb: `calc(${theme.spacing(2.5)} + env(safe-area-inset-bottom, 0px))`,
                  px: 0,
                  bgcolor: DRAWER_PAGE_BG,
                  borderTopRightRadius: shopRadius,
                  borderBottomRightRadius: shopRadius,
                  borderRight: `1px solid ${DRAWER_BORDER}`,
                  borderTop: `1px solid ${DRAWER_BORDER}`,
                  borderBottom: `1px solid ${DRAWER_BORDER}`,
                  boxShadow: "8px 0 32px rgba(26,24,20,0.1)",
                  overflow: "hidden",
                },
              }}
            >
              <Box
                component="nav"
                aria-label="Primary"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  position: "relative",
                }}
              >
                {/* Subtle texture */}
                <Box
                  aria-hidden
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(ellipse at 0% 100%, rgba(188,126,90,0.12) 0%, transparent 55%), radial-gradient(ellipse at 100% 0%, rgba(204,188,166,0.08) 0%, transparent 50%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Header */}
                <Stack
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    px: 2.5,
                    pb: 2,
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: "2px",
                      bgcolor: DRAWER_ACCENT,
                      borderRadius: "1px",
                    }}
                  />
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={1}
                  >
                    <Box
                      component={RouterLink}
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      sx={{ lineHeight: 0, flexShrink: 1, minWidth: 0 }}
                    >
                      <Box
                        component="img"
                        src={LOGO_SRC}
                        alt="Corners India"
                        sx={{
                          height: 26,
                          width: "auto",
                          maxWidth: "min(120px, 52vw)",
                          display: "block",
                        }}
                      />
                    </Box>
                    <IconButton
                      type="button"
                      aria-label="Close menu"
                      onClick={() => setMobileMenuOpen(false)}
                      sx={{
                        minWidth: 40,
                        minHeight: 40,
                        flexShrink: 0,
                        color: DRAWER_MUTED,
                        border: `1px solid ${DRAWER_BORDER}`,
                        bgcolor: "rgba(255,255,255,0.45)",
                        borderRadius: shopRadius,
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Stack>
                  <Typography
                    sx={{
                      fontFamily: FONT_SURGENA,
                      fontWeight: 600,
                      fontSize: 15,
                      lineHeight: 1.35,
                      color: DRAWER_MUTED,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Every corner tells a story.
                  </Typography>
                </Stack>

                {/* Nav links */}
                <Stack
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    flex: 1,
                    px: 2,
                    gap: 1,
                    overflowY: "auto",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONT_NAV,
                      fontWeight: 600,
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: DRAWER_TAN,
                      px: 0.5,
                      pb: 0.25,
                    }}
                  >
                    Explore
                  </Typography>
                  <MobileDrawerNavItem
                    label="Shop"
                    shopStyle
                    selected={shopMenuOpen}
                    onClick={openShopFromDrawer}
                  />
                  <MobileDrawerNavItem
                    label="Customizations"
                    to="/customizations"
                    selected={pathname === "/customizations"}
                    onClick={() => setMobileMenuOpen(false)}
                  />
                  <MobileDrawerNavItem
                    label="Discover Corners"
                    to="/discover"
                    selected={pathname === "/discover"}
                    onClick={() => setMobileMenuOpen(false)}
                  />
                </Stack>

                {/* Footer */}
                <Stack
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    px: 2,
                    pt: 2,
                    gap: 1,
                    borderTop: `1px solid ${DRAWER_BORDER}`,
                    mx: 2,
                  }}
                >
                  {!loggedIn ? (
                    <ButtonBase
                      component={RouterLink}
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      sx={{
                        width: "100%",
                        minHeight: 46,
                        bgcolor: DRAWER_DARK,
                        color: DRAWER_PAGE_BG,
                        borderRadius: shopRadius,
                        fontFamily: FONT_NAV,
                        fontWeight: 700,
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        "&:hover": { opacity: 0.9 },
                      }}
                    >
                      Log in to Corners
                    </ButtonBase>
                  ) : (
                    <ButtonBase
                      component={RouterLink}
                      to="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      sx={{
                        width: "100%",
                        minHeight: 46,
                        borderRadius: shopRadius,
                        border: `1px solid ${DRAWER_BORDER}`,
                        bgcolor: "rgba(255,255,255,0.42)",
                        fontFamily: FONT_NAV,
                        fontWeight: 600,
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        color: DRAWER_MUTED,
                        "&:hover": { borderColor: DRAWER_ACCENT, color: DRAWER_ACCENT },
                      }}
                    >
                      My Orders
                    </ButtonBase>
                  )}
                </Stack>
              </Box>
            </Drawer>
          </Box>
        </ClickAwayListener>
      </Box>
    </>
  );
}
