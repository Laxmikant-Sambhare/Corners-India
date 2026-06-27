import { useEffect, useMemo, useState } from "react";
import type { CatalogProduct } from "../catalog/catalogPageTypes";
import {
  inferGalleryOptionValueFromImage,
  resolveProductDetail,
  sizeLabelForCart,
} from "./productDetailUtils";

export function useProductVariantSelection(product: CatalogProduct | null) {
  const detail = useMemo(
    () => (product ? resolveProductDetail(product) : null),
    [product],
  );

  const [sizeIndex, setSizeIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const productKey = product?.name ?? null;

  useEffect(() => {
    if (!product || !detail) return;

    setQuantity(1);

    const firstAvailableIdx = detail.sizes.findIndex((s) =>
      detail.availableSizes ? detail.availableSizes.includes(s) : true,
    );
    setSizeIndex(firstAvailableIdx >= 0 ? firstAvailableIdx : 0);

    if (detail.colors?.length) {
      const inferredColor = inferGalleryOptionValueFromImage(
        product.image,
        detail,
      );
      const colorIdx = inferredColor
        ? detail.colors.indexOf(inferredColor)
        : 0;
      setColorIndex(colorIdx >= 0 ? colorIdx : 0);
    } else {
      setColorIndex(0);
    }
  }, [productKey, product, detail]);

  const selectedSize = detail?.sizes[sizeIndex] ?? detail?.sizes[0] ?? "";
  const selectedColor =
    detail?.colors?.[colorIndex] ?? detail?.colors?.[0] ?? "";

  const selectedSizeInStock = detail
    ? detail.availableSizes
      ? detail.availableSizes.includes(selectedSize)
      : (product?.availableForSale ?? true)
    : false;

  const sizeForCart = sizeLabelForCart(selectedSize);

  const showSizePicker =
    Boolean(detail?.sizes.length) &&
    !(detail!.sizes.length === 1 && detail!.sizes[0] === "Standard");

  return {
    detail,
    sizeIndex,
    setSizeIndex,
    colorIndex,
    setColorIndex,
    quantity,
    setQuantity,
    selectedSize,
    selectedColor,
    selectedSizeInStock,
    sizeForCart,
    showSizePicker,
  };
}
