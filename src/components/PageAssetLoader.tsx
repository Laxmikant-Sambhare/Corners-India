import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouterState } from "@tanstack/react-router";
import { type ReactNode, useRef } from "react";
import { usePageAssetsReady } from "../hooks/usePageAssetsReady";

const ACCENT = "#bc7e5a";

type PageAssetLoaderProps = {
  children: ReactNode;
};

/**
 * Full-page gate: shows a loader until priority images and videos in the
 * page subtree have loaded, then fades the content in.
 */
export function PageAssetLoader({ children }: PageAssetLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const ready = usePageAssetsReady(containerRef, pathname);

  return (
    <>
      {!ready ? (
        <Box
          aria-busy="true"
          aria-label="Loading page"
          role="status"
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
          }}
        >
          <CircularProgress sx={{ color: ACCENT }} size={40} thickness={3.5} />
        </Box>
      ) : null}
      <Box
        ref={containerRef}
        sx={{
          opacity: ready ? 1 : 0,
          transition: ready ? "opacity 0.35s ease" : "none",
        }}
      >
        {children}
      </Box>
    </>
  );
}
