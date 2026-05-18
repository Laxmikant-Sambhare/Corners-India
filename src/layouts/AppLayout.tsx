import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { AppNavbar } from "../components/AppNavbar";
import { DiscoverByCategoryCarousel } from "../components/DiscoverByCategoryCarousel";
import { CollectionSpotlightSection } from "../components/CollectionSpotlightSection";
import { FaqFooterSection } from "../components/FaqFooterSection";
import { SiteFooter } from "../components/SiteFooter";
import { DiscoverCollectionSection } from "../components/DiscoverCollectionSection";
import { DiscoverPromoVideo } from "../components/DiscoverPromoVideo";
import { HeroCarousel } from "../components/HeroCarousel";
import { isCatalogLayoutPathname, isFullBleedHeroPathname, isPdpPathname } from "../catalog/catalogLayoutPaths";
import { layoutMarginX } from "../navDesignTokens";
import { layoutPaddingX } from "../layoutConstants";

const pagePaddingY = { xs: 3, sm: 4, md: 5 };

const HERO_BLOCK_SX = {
  position: "relative" as const,
  /** Edge-to-edge viewport width (break out of bordered column) */
  width: "100vw",
  maxWidth: "100vw",
  marginLeft: "calc(50% - 50vw)",
  marginRight: "calc(50% - 50vw)",
  /**
   * Clip horizontal bleed on small viewports (100vw vs scrollbar gutter) while keeping
   * vertical overflow visible for the Explore card pull-up over the hero.
   */
  overflowX: "clip" as const,
  overflowY: "visible" as const,
  boxSizing: "border-box" as const,
};

export function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const isCatalogLayout = isCatalogLayoutPathname(pathname);
  const isPdp = isPdpPathname(pathname);
  const isFullBleedHero = isFullBleedHeroPathname(pathname);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflowX: "hidden",
        bgcolor: "background.default",
        borderInline: 1,
        borderColor: "divider",
      }}
    >
      {isHome ? (
        <Box sx={HERO_BLOCK_SX}>
          <HeroCarousel>
            <Box
              component="main"
              sx={{
                px: {
                  xs: layoutPaddingX.xs,
                  sm: layoutPaddingX.sm,
                  md: layoutMarginX,
                },
                pt: 0,
                pb: pagePaddingY,
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                boxSizing: "border-box",
              }}
            >
              <Container maxWidth="xl" disableGutters sx={{ maxWidth: "100%" }}>
                <Outlet />
              </Container>
            </Box>
          </HeroCarousel>
          <DiscoverByCategoryCarousel />
          <DiscoverPromoVideo />
          <DiscoverCollectionSection />
          <CollectionSpotlightSection />
          <FaqFooterSection />
          <AppNavbar
            key={pathname}
            reserveLayoutSpace={false}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 5,
            }}
          />
        </Box>
      ) : isCatalogLayout || isPdp || isFullBleedHero ? (
        <Box sx={HERO_BLOCK_SX}>
          <Outlet />
          <AppNavbar
            key={pathname}
            reserveLayoutSpace={false}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 5,
            }}
          />
        </Box>
      ) : (
        <AppNavbar key={pathname} />
      )}

      {!isHome && !isCatalogLayout && !isPdp && !isFullBleedHero && (
        <Box
          component="main"
          sx={{
            flex: 1,
            px: {
              xs: layoutPaddingX.xs,
              sm: layoutPaddingX.sm,
              md: layoutMarginX,
            },
            py: pagePaddingY,
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          <Container maxWidth="xl" disableGutters sx={{ maxWidth: "100%" }}>
            <Outlet />
          </Container>
        </Box>
      )}

      <SiteFooter />
    </Box>
  );
}
