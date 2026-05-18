/**
 * Typography roles (Figma).
 * - Nav links: Gilroy SemiBold (`@qpokychuk/gilroy`).
 * - Display / shop / accent: **Surgena** — `public/fonts/surgena/*.ttf`, see `src/surgena-fonts.css`
 *   (license: `public/font-license /license_certificate_2UZKJW8F7N.pdf`).
 * - Manrope remains as fallback if a Surgena weight fails to load.
 */
export const FONT_SURGENA = '"Surgena", "Manrope", "Gilroy", sans-serif';

export const FONT_NAV = '"Gilroy", "Helvetica Neue", Arial, sans-serif';

/** Former “shop” substitute — now Surgena-first with fallbacks. */
export const FONT_NAV_SHOP = FONT_SURGENA;
