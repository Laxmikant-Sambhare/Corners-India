import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ImgHTMLAttributes } from "react";

type Props = {
  src: string;
  alt?: string;
  sx?: SxProps<Theme>;
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
  fetchPriority?: ImgHTMLAttributes<HTMLImageElement>["fetchPriority"];
  decoding?: ImgHTMLAttributes<HTMLImageElement>["decoding"];
};

const RASTER = /\.(png|jpe?g)$/i;

/**
 * Renders WebP via `<picture>` when `src` is PNG/JPEG (expects matching `.webp` in `public/`).
 * SVG and other assets pass through as a plain `<img>`.
 */
export function PictureImg({
  src,
  alt = "",
  sx,
  loading,
  fetchPriority,
  decoding = "async",
}: Props) {
  if (!RASTER.test(src)) {
    return (
      <Box
        component="img"
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        sx={sx}
      />
    );
  }

  const webp = src.replace(RASTER, ".webp");

  return (
    <Box component="picture" sx={{ display: "contents" }}>
      <source type="image/webp" srcSet={webp} />
      <Box
        component="img"
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        sx={sx}
      />
    </Box>
  );
}
