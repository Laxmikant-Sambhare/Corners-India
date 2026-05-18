import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AppLayout } from "../layouts/AppLayout";

/**
 * Root shell: shared layout (navbar + padded main) for all child routes.
 */
export function RootLayout() {
  return (
    <>
      <AppLayout />
      {import.meta.env.DEV ? (
        <TanStackRouterDevtools position="bottom-right" />
      ) : null}
    </>
  );
}
