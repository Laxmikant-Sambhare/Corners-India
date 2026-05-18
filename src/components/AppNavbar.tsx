import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
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
} from "../navDesignTokens";
import { FONT_NAV, FONT_NAV_SHOP } from "../fonts";
import { layoutPaddingX } from "../layoutConstants";
import { cartTotalItems, useCartStore } from "../store/cartStore";
import { CartDropdown } from "./CartDropdown";
import { NavbarShopLink } from "./NavbarShopLink";
import { NavbarTextLink } from "./NavbarTextLink";
import { SearchDropdown } from "./SearchDropdown";
import { ShopMegaMenu } from "./ShopMegaMenu";
import { UserAvatarButton, UserDropdownPanel } from "./UserDropdown";

const LOGO_SRC = "/nav/logo.svg";


const SCROLL_TOP_SHOW_PX = 32;
const SCROLL_DIRECTION_DELTA = 6;

const NAV_CHROME_MUTED = "#4b4a4a";

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
  const isCompactNav = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const shellRef = useRef<HTMLDivElement>(null);
  const [sentinelHeight, setSentinelHeight] = useState(0);

  const [navPinned, setNavPinned] = useState(true);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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

  const handleShopClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    setShopMenuOpen((open) => !open);
    setCartOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  };

  const handleCartClick = () => {
    setCartOpen((open) => !open);
    setShopMenuOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const handleSearchClick = () => {
    setSearchOpen((open) => !open);
    setShopMenuOpen(false);
    setCartOpen(false);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const handleDrawerShopClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setCartOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
    setShopMenuOpen((open) => !open);
  };

  const handleClickAway = () => {
    setShopMenuOpen(false);
    setCartOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  };

  useLayoutEffect(() => {
    if (!reserveLayoutSpace) return;
    const el = shellRef.current;
    if (!el) return;
    const measure = () => {
      setSentinelHeight(Math.ceil(el.getBoundingClientRect().height));
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
                : { xs: "92px", sm: "100px", md: "96px" },
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
                  xs: isCompactNav ? 1 : 2,
                  md: navPillPadY,
                },
                display: "flex",
                flexDirection: isCompactNav
                  ? "row"
                  : { xs: "column", md: "row" },
                alignItems: isCompactNav
                  ? "center"
                  : { xs: "stretch", md: "center" },
                justifyContent: isCompactNav ? "flex-start" : "space-between",
                gap: isCompactNav ? 0.5 : { xs: 2, md: 3 },
                minHeight: isCompactNav ? 52 : undefined,
              }}
            >
              {isCompactNav ? (
                <>
                  <IconButton
                    type="button"
                    aria-label="Open menu"
                    aria-expanded={mobileMenuOpen}
                    aria-haspopup="true"
                    size="medium"
                    onClick={() => {
                      setMobileMenuOpen(true);
                      setShopMenuOpen(false);
                      setCartOpen(false);
                    }}
                    sx={{
                      minWidth: 44,
                      minHeight: 44,
                      ml: -0.5,
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
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      justifyContent: "center",
                      lineHeight: 0,
                      py: 0.25,
                    }}
                  >
                    <Box
                      sx={{
                        lineHeight: 0,
                        "& img": {
                          display: "block",
                          height: 24,
                          width: "auto",
                          maxWidth: "min(122px, 42vw)",
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
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    spacing={0.25}
                    sx={{ flexShrink: 0 }}
                  >
                    <IconButton
                      type="button"
                      aria-label="Search"
                      aria-expanded={searchOpen}
                      size="medium"
                      onClick={handleSearchClick}
                      sx={{
                        minWidth: 44,
                        minHeight: 44,
                        p: 1,
                        color: searchOpen ? "#bc7e5a" : NAV_CHROME_MUTED,
                        "& img": { display: "block", height: 20, width: "auto" },
                      }}
                    >
                      <Box component="img" src="/nav/search.svg" alt="" aria-hidden />
                    </IconButton>
                    <UserAvatarButton size="medium" open={userMenuOpen} onToggle={() => { setUserMenuOpen((v) => !v); setCartOpen(false); setShopMenuOpen(false); setSearchOpen(false); }} />
                    <IconButton
                      type="button"
                      aria-label="Shopping cart"
                      aria-expanded={cartOpen}
                      aria-controls={cartOpen ? "cart-dropdown" : undefined}
                      size="medium"
                      onClick={handleCartClick}
                      sx={{
                        minWidth: 44,
                        minHeight: 44,
                        p: 1,
                        mr: -0.5,
                        color: NAV_CHROME_MUTED,
                        "& img": {
                          display: "block",
                          height: 20,
                          width: "auto",
                        },
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
                            top: 6,
                            right: 4,
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src="/nav/cart.svg"
                          alt=""
                          aria-hidden
                        />
                      </Badge>
                    </IconButton>
                  </Stack>
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
                      alignSelf: { xs: "center", md: "auto" },
                      flexShrink: 0,
                      minWidth: 0,
                      "& img": {
                        display: "block",
                        height: { xs: 28, md: navLogoHeight },
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
                    flexWrap="wrap"
                    useFlexGap
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      flex: { md: 1 },
                      minWidth: 0,
                      gap: { xs: 2, sm: 3, md: 6, lg: navLinkGap },
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
                    sx={{
                      alignSelf: { xs: "center", md: "auto" },
                      flexShrink: 0,
                    }}
                  >
                    <IconButton
                      type="button"
                      aria-label="Search"
                      aria-expanded={searchOpen}
                      size="small"
                      onClick={handleSearchClick}
                      sx={{
                        p: 0.75,
                        color: searchOpen ? "#bc7e5a" : NAV_CHROME_MUTED,
                        "& img": { display: "block", height: navIconSize, width: "auto" },
                      }}
                    >
                      <Box component="img" src="/nav/search.svg" alt="" aria-hidden />
                    </IconButton>
                    <UserAvatarButton size="small" open={userMenuOpen} onToggle={() => { setUserMenuOpen((v) => !v); setCartOpen(false); setShopMenuOpen(false); setSearchOpen(false); }} />
                    <IconButton
                      type="button"
                      aria-label="Shopping cart"
                      aria-expanded={cartOpen}
                      aria-controls={cartOpen ? "cart-dropdown" : undefined}
                      size="small"
                      onClick={handleCartClick}
                      sx={{
                        p: 0.75,
                        color: NAV_CHROME_MUTED,
                        "& img": {
                          display: "block",
                          height: navIconSize,
                          width: "auto",
                        },
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
                        <Box
                          component="img"
                          src="/nav/cart.svg"
                          alt=""
                          aria-hidden
                        />
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
              {userMenuOpen && (
                <UserDropdownPanel
                  key="user-dropdown"
                  onClose={() => setUserMenuOpen(false)}
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
                  width: "min(300px, 88vw)",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                  pt: `calc(${theme.spacing(2)} + env(safe-area-inset-top, 0px))`,
                  pb: `calc(${theme.spacing(2)} + env(safe-area-inset-bottom, 0px))`,
                  px: 0,
                  bgcolor: "background.default",
                  borderTopRightRadius: 14,
                  borderBottomRightRadius: 14,
                  borderRight: 1,
                  borderTop: 1,
                  borderBottom: 1,
                  borderColor: "divider",
                  boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
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
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 2, pb: 1.25, minHeight: 48 }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      fontFamily: FONT_NAV,
                      fontWeight: 700,
                      fontSize: "0.6875rem",
                      letterSpacing: "0.14em",
                      color: NAV_CHROME_MUTED,
                    }}
                  >
                    Menu
                  </Typography>
                  <IconButton
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setMobileMenuOpen(false)}
                    sx={{
                      minWidth: 44,
                      minHeight: 44,
                      mr: -0.75,
                      color: NAV_CHROME_MUTED,
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Stack>
                <Divider sx={{ borderColor: "divider" }} />
                <List disablePadding sx={{ py: 1 }}>
                  <ListItemButton
                    component="button"
                    type="button"
                    selected={shopMenuOpen}
                    onClick={handleDrawerShopClick}
                    aria-controls={shopMenuOpen ? "shop-mega-menu" : undefined}
                    aria-expanded={shopMenuOpen}
                    sx={{
                      py: 1.75,
                      px: 2,
                      minHeight: 52,
                      alignItems: "center",
                      "& .MuiListItemText-primary": {
                        fontFamily: FONT_NAV_SHOP,
                        textTransform: "uppercase",
                        fontWeight: 600,
                        fontSize: { xs: "0.8125rem", sm: shopFontSize },
                        letterSpacing: "0.04em",
                      },
                      "&.Mui-selected": {
                        bgcolor: "rgba(188, 126, 90, 0.12)",
                      },
                    }}
                  >
                    <ListItemText primary="Shop" />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/customizations"
                    selected={pathname === "/customizations"}
                    onClick={() => setMobileMenuOpen(false)}
                    sx={{
                      py: 1.75,
                      px: 2,
                      minHeight: 52,
                      alignItems: "center",
                      "& .MuiListItemText-primary": {
                        fontFamily: FONT_NAV,
                        textTransform: "uppercase",
                        fontWeight: 600,
                        fontSize: { xs: "0.8125rem", sm: navFontSize },
                      },
                    }}
                  >
                    <ListItemText primary="Customizations" />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/discover"
                    selected={pathname === "/discover"}
                    onClick={() => setMobileMenuOpen(false)}
                    sx={{
                      py: 1.75,
                      px: 2,
                      minHeight: 52,
                      alignItems: "center",
                      "& .MuiListItemText-primary": {
                        fontFamily: FONT_NAV,
                        textTransform: "uppercase",
                        fontWeight: 600,
                        fontSize: { xs: "0.8125rem", sm: navFontSize },
                      },
                    }}
                  >
                    <ListItemText primary="Discover Corners" />
                  </ListItemButton>
                </List>
              </Box>
            </Drawer>
          </Box>
        </ClickAwayListener>
      </Box>
    </>
  );
}
