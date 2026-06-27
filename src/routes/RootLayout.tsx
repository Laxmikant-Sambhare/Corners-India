import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { PostCheckoutReturnHandler } from "../components/PostCheckoutReturnHandler";
import { AppLayout } from "../layouts/AppLayout";

/**
 * Root shell: shared layout (navbar + padded main) for all child routes.
 */
export function RootLayout() {
  return (
    <>
      <PostCheckoutReturnHandler />
      <AppLayout />
      {import.meta.env.DEV ? (
        <TanStackRouterDevtools position="bottom-right" />
      ) : null}
    </>
  );
}
