import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "@tanstack/react-router";
import { FONT_NAV, FONT_NAV_SHOP } from "../fonts";
import {
  exploreCardImageHeight,
  exploreGridGap,
  exploreHeadingFontSize,
  exploreLabelFontSize,
  exploreSectionPadX,
  exploreSectionPadY,
} from "../navDesignTokens";

const ACCENT = "#bc7e5a";
const MUTED = "#4b4a4a";
const LABEL_GREY = "#7c7c7c";

const cards = [
  {
    title: "Explore rugs",
    to: "/category/rugs",
    image: "https://cdn.shopify.com/s/files/1/0990/0464/5681/files/rugs.webp",
    labelColor: LABEL_GREY,
    font: FONT_NAV,
  },
  {
    title: "Discover furniture",
    to: "/category/furniture",
    image: "https://cdn.shopify.com/s/files/1/0990/0464/5681/files/furniture.webp",
    labelColor: LABEL_GREY,
    font: FONT_NAV_SHOP,
  },
] as const;

export function ExploreCategorySection() {
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        borderRadius: { xs: 2, sm: "14px", md: "18.67px" },
        px: { xs: 1.5, sm: 2.5, md: exploreSectionPadX },
        py: { xs: 3, sm: 5, md: 6, lg: exploreSectionPadY },
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontFamily: FONT_NAV_SHOP,
          fontWeight: 600,
          fontSize: { xs: 28, sm: 40, md: 52, lg: exploreHeadingFontSize },
          lineHeight: 1.1,
          textAlign: "center",
          textTransform: "uppercase",
          color: MUTED,
          mb: { xs: 2.5, md: 5, lg: 6 },
        }}
      >
        Explore category
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "1fr 1fr" },
          gap: { xs: 2.5, sm: 3, md: exploreGridGap },
          alignItems: "start",
          width: "100%",
          minWidth: 0,
        }}
      >
        {cards.map(({ title, to, image, labelColor, font }) => (
          <Box
            key={to}
            component={RouterLink}
            to={to}
            aria-label={`${title} — open category`}
            sx={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
              borderRadius: { xs: 2, sm: "14px", md: "18.67px" },
              maxWidth: "100%",
              minWidth: 0,
              "&:hover .explore-category-card-title": {
                color: ACCENT,
              },
            }}
          >
            <Box
              component="img"
              src={image}
              alt={`${title} preview`}
              sx={{
                display: "block",
                width: "100%",
                maxWidth: "100%",
                height: {
                  xs: 220,
                  sm: 320,
                  md: 400,
                  lg: exploreCardImageHeight,
                },
                borderRadius: { xs: 2, sm: "14px", md: "18.67px" },
                objectFit: "cover",
              }}
            />
            <Typography
              className="explore-category-card-title"
              sx={{
                mt: 1.5,
                fontFamily: font,
                fontSize: { xs: "0.8125rem", sm: "0.875rem", md: exploreLabelFontSize },
                fontWeight: 600,
                textTransform: "uppercase",
                color: labelColor,
                lineHeight: 1.25,
                wordBreak: "break-word",
                transition: "color 0.2s ease",
              }}
            >
              {title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
