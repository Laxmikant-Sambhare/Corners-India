import {
  faqFooterStackGap,
  furnitureCategoryShellBg,
  siteFooterCustomizationsPadTop,
  siteFooterCustomizationsTopRadius,
  siteFooterShellBgDefault,
  siteFooterShellPadTopFurniture,
} from "../navDesignTokens";
import {
  isCatalogLayoutPathname,
  isFullBleedHeroPathname,
  isPdpPathname,
} from "./catalogLayoutPaths";

function isTanFooterPathname(pathname: string): boolean {
  return (
    isCatalogLayoutPathname(pathname) ||
    isPdpPathname(pathname) ||
    isFullBleedHeroPathname(pathname)
  );
}

export function siteFooterShellBgForPathname(pathname: string): string {
  return isTanFooterPathname(pathname)
    ? furnitureCategoryShellBg
    : siteFooterShellBgDefault;
}

export function siteFooterShellPadTopForPathname(pathname: string): string {
  if (isFullBleedHeroPathname(pathname)) return siteFooterCustomizationsPadTop;
  if (isTanFooterPathname(pathname)) return siteFooterShellPadTopFurniture;
  return faqFooterStackGap;
}

/**
 * Returns `"X X 0 0"` rounded-top border-radius string for the outer footer shell
 * on the customizations page (Figma 990:1736), otherwise `undefined`.
 */
export function siteFooterShellRadiusForPathname(
  pathname: string,
): string | undefined {
  if (isFullBleedHeroPathname(pathname)) {
    return `${siteFooterCustomizationsTopRadius} ${siteFooterCustomizationsTopRadius} 0 0`;
  }
  return undefined;
}
