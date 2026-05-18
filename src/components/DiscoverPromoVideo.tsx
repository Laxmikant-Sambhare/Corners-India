import Box from "@mui/material/Box";
import { useEffect, useRef } from "react";

const VIDEO_SRC = encodeURI("/discover/website 2.mp4");

/**
 * Full-bleed promo clip; loops while in view, muted (required for autoplay).
 */
export function DiscoverPromoVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void video.play().catch(() => {
              /* Autoplay blocked or not ready */
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        maxWidth: "100%",
        lineHeight: 0,
        bgcolor: "common.black",
        overflow: "hidden",
      }}
    >
      <Box
        component="video"
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        loop
        preload="auto"
        aria-label="Brand video"
        sx={{
          width: "100%",
          height: "auto",
          display: "block",
          verticalAlign: "bottom",
        }}
      />
    </Box>
  );
}
