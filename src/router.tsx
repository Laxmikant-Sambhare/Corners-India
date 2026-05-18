import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from "@tanstack/react-router";
import { RootLayout } from "./routes/RootLayout";
import { PlaceholderPage } from "./routes/PlaceholderPage";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyRouteComponent(() => import("./routes/HomePage").then((m) => ({ default: m.HomePage }))),
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: lazyRouteComponent(() => import("./routes/AboutPage").then((m) => ({ default: m.AboutPage }))),
});

const moodBoardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mood-board",
  component: () => <PlaceholderPage title="Mood board" />,
});

const customizationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customizations",
  component: lazyRouteComponent(() => import("./routes/CustomizationsPage").then((m) => ({ default: m.CustomizationsPage }))),
});

const discoverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/discover",
  component: lazyRouteComponent(() => import("./routes/DiscoverPage").then((m) => ({ default: m.DiscoverPage }))),
});

const categoryFurnitureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/category/furniture",
  component: lazyRouteComponent(() => import("./routes/CatalogPage").then((m) => ({ default: m.CatalogPage }))),
});

const categoryRugsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/category/rugs",
  component: lazyRouteComponent(() => import("./routes/CatalogPage").then((m) => ({ default: m.CatalogPage }))),
});

const collectionDunariRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/collections/dunari",
  component: lazyRouteComponent(() => import("./routes/CatalogPage").then((m) => ({ default: m.CatalogPage }))),
});

const collectionEiraRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/collections/eira",
  component: lazyRouteComponent(() => import("./routes/CatalogPage").then((m) => ({ default: m.CatalogPage }))),
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$slug",
  component: lazyRouteComponent(() => import("./routes/ProductDescriptionPage").then((m) => ({ default: m.ProductDescriptionPage }))),
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: lazyRouteComponent(() => import("./routes/CheckoutPage").then((m) => ({ default: m.CheckoutPage }))),
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: lazyRouteComponent(() => import("./routes/OrdersPage").then((m) => ({ default: m.OrdersPage }))),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: lazyRouteComponent(() => import("./routes/LoginPage").then((m) => ({ default: m.LoginPage }))),
});

const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/callback",
  component: lazyRouteComponent(() => import("./routes/AuthCallbackPage").then((m) => ({ default: m.AuthCallbackPage }))),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  moodBoardRoute,
  customizationsRoute,
  discoverRoute,
  categoryFurnitureRoute,
  categoryRugsRoute,
  collectionDunariRoute,
  collectionEiraRoute,
  productRoute,
  checkoutRoute,
  ordersRoute,
  loginRoute,
  authCallbackRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
