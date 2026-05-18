import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { featureSpaceBg, featureSpaceHeight } from "../navDesignTokens";

type Props = {
  sx?: SxProps<Theme>;
};

/**
 * Figma `Feature Space` (990:4540) — solid fill band, 1920×379 reference.
 */
export function FeatureSpace({ sx }: Props) {
  return (
    <Box
      component="section"
      aria-label="Feature area"
      sx={[
        {
          width: "100%",
          height: featureSpaceHeight,
          flexShrink: 0,
          bgcolor: featureSpaceBg,
          boxSizing: "border-box",
        },
        ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
      ]}
    />
  );
}
