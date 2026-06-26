import Box from "@mui/material/Box";
import { HomeIntroSection } from "./HomeIntroSection";

const HERO_VIDEO_SRC = "/discover/hero_section_video.mp4";

export function HeroCarousel() {
  return (
    <Box
      role="region"
      aria-label="Featured home imagery"
      sx={{
        position: "relative",
        width: "100%",
        minWidth: "100%",
        maxWidth: "100%",
        bgcolor: "background.default",
        overflow: "visible",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          lineHeight: 0,
          bgcolor: "#F3EDE3",
        }}
      >
        <Box
          component="video"
          src={HERO_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          aria-label="Interior home styling from Corners India"
          sx={{
            width: "100%",
            minWidth: "100%",
            maxWidth: "100%",
            height: "auto",
            display: "block",
            border: 0,
            outline: 0,
            verticalAlign: "bottom",
            objectFit: "cover",
          }}
        />
      </Box>
      <HomeIntroSection />
    </Box>
  );
}
