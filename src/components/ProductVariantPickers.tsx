import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CatalogProductDetail } from "../catalog/catalogPageTypes";
import { FONT_NAV } from "../fonts";
import {
  furnitureHeroBodyFontSize,
  navFontSize,
  pdpBodyBtnRadius,
  productDetailModalChipRadius,
  productDetailModalLabelGap,
  productDetailModalSizeChipGap,
  productDetailModalSizeChipPadX,
  productDetailModalSizeChipPadY,
} from "../navDesignTokens";

const ACCENT = "#bc7e5a";
const TAN = "#ccbca6";

type Props = {
  detail: CatalogProductDetail;
  sizeIndex: number;
  colorIndex: number;
  onSizeIndexChange: (index: number) => void;
  onColorIndexChange: (index: number) => void;
  showSizePicker: boolean;
  variant?: "modal" | "pdp";
};

export function ProductVariantPickers({
  detail,
  sizeIndex,
  colorIndex,
  onSizeIndexChange,
  onColorIndexChange,
  showSizePicker,
  variant = "modal",
}: Props) {
  const labelSize =
    variant === "pdp" ? furnitureHeroBodyFontSize : navFontSize;
  const chipRadius =
    variant === "pdp" ? pdpBodyBtnRadius : productDetailModalChipRadius;

  return (
    <>
      {(detail.colors?.length ?? 0) > 1 ? (
        <Stack sx={{ gap: productDetailModalLabelGap, width: "100%" }}>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 500,
              fontSize: labelSize,
              lineHeight: 1.2,
              textTransform: "capitalize",
              color: TAN,
            }}
          >
            Color
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: productDetailModalSizeChipGap,
              alignItems: "center",
            }}
          >
            {detail.colors!.map((label, i) => {
              const isColorAvailable = detail.availableColors
                ? detail.availableColors.includes(label)
                : true;
              const isSelected = colorIndex === i;
              return (
                <ButtonBase
                  key={label}
                  type="button"
                  disabled={!isColorAvailable}
                  onClick={() => isColorAvailable && onColorIndexChange(i)}
                  sx={{
                    px: productDetailModalSizeChipPadX,
                    py: productDetailModalSizeChipPadY,
                    borderRadius: chipRadius,
                    border: isColorAvailable
                      ? isSelected
                        ? `2px solid ${ACCENT}`
                        : `1px solid ${ACCENT}`
                      : "1px solid rgba(75,74,74,0.2)",
                    bgcolor: isColorAvailable
                      ? isSelected
                        ? "rgba(188, 126, 90, 0.08)"
                        : "transparent"
                      : "rgba(75,74,74,0.04)",
                    fontFamily: FONT_NAV,
                    fontWeight: 500,
                    fontSize: labelSize,
                    lineHeight: 1,
                    textTransform: "uppercase",
                    color: isColorAvailable ? ACCENT : "rgba(75,74,74,0.3)",
                    minWidth: { xs: "auto", sm: 77 },
                    cursor: isColorAvailable ? "pointer" : "not-allowed",
                  }}
                >
                  {label}
                </ButtonBase>
              );
            })}
          </Box>
        </Stack>
      ) : null}

      {showSizePicker ? (
        <Stack sx={{ gap: productDetailModalLabelGap, width: "100%" }}>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 500,
              fontSize: labelSize,
              lineHeight: 1.2,
              textTransform: "capitalize",
              color: TAN,
            }}
          >
            Size
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: productDetailModalSizeChipGap,
              alignItems: "center",
            }}
          >
            {detail.sizes.map((label, i) => {
              const isSizeAvailable = detail.availableSizes
                ? detail.availableSizes.includes(label)
                : true;
              const isSelected = sizeIndex === i;
              return (
                <ButtonBase
                  key={label}
                  type="button"
                  disabled={!isSizeAvailable}
                  onClick={() => isSizeAvailable && onSizeIndexChange(i)}
                  sx={{
                    px: productDetailModalSizeChipPadX,
                    py: productDetailModalSizeChipPadY,
                    borderRadius: chipRadius,
                    border: isSizeAvailable
                      ? isSelected
                        ? `2px solid ${ACCENT}`
                        : `1px solid ${ACCENT}`
                      : "1px solid rgba(75,74,74,0.2)",
                    bgcolor: isSizeAvailable
                      ? isSelected
                        ? "rgba(188, 126, 90, 0.08)"
                        : "transparent"
                      : "rgba(75,74,74,0.04)",
                    fontFamily: FONT_NAV,
                    fontWeight: 500,
                    fontSize: labelSize,
                    lineHeight: 1,
                    textTransform: "uppercase",
                    color: isSizeAvailable ? ACCENT : "rgba(75,74,74,0.3)",
                    minWidth: { xs: "auto", sm: 77 },
                    cursor: isSizeAvailable ? "pointer" : "not-allowed",
                    position: "relative",
                    ...(!isSizeAvailable && {
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        left: "10%",
                        right: "10%",
                        top: "50%",
                        height: "1px",
                        bgcolor: "rgba(75,74,74,0.25)",
                      },
                    }),
                  }}
                >
                  {label}
                </ButtonBase>
              );
            })}
          </Box>
        </Stack>
      ) : null}
    </>
  );
}
