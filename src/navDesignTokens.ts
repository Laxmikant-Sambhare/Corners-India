/**
 * Figma reference: 1920×1080. Values scale with viewport width so 16:9 layouts
 * keep the same proportions (fluid `vw` with clamps for tiny/ultra-wide screens).
 */
export const DESIGN_WIDTH_PX = 1920;
export const DESIGN_HEIGHT_PX = 1080;

/**
 * Maps a px value from the 1920 design to `clamp(min, vw, max)`.
 * At 1920px width, `vw` resolves to the original px.
 */
export function fluid1920(
  px: number,
  opts?: { min?: number; max?: number },
): string {
  const vw = (px / DESIGN_WIDTH_PX) * 100;
  const min = opts?.min ?? Math.max(1, Math.round(px * (px < 2 ? 0.6 : 0.42)));
  const max = opts?.max ?? Math.round(px * 1.2);
  return `clamp(${min}px, ${vw}vw, ${max}px)`;
}

/**
 * Maps a px value from the 1080-tall artboard to `clamp(min, vh, max)`.
 * At 1080px viewport height, `vh` resolves to the original px.
 */
export function fluid1080(
  px: number,
  opts?: { min?: number; max?: number },
): string {
  const vh = (px / DESIGN_HEIGHT_PX) * 100;
  const min = opts?.min ?? Math.max(1, Math.round(px * (px < 2 ? 0.6 : 0.42)));
  const max = opts?.max ?? Math.round(px * 1.2);
  return `clamp(${min}px, ${vh}vh, ${max}px)`;
}

/**
 * Page / main content shell: 265px each side @ 1920 (Explore, layout outlet, etc.).
 */
export const layoutMarginX = fluid1920(265, { min: 16, max: 265 });

/**
 * Navbar shell only: 280px each side @ 1920 (wider inset than page content).
 */
export const navbarMarginX = fluid1920(280, { min: 16, max: 280 });

/** @deprecated Use navbarMarginX */
export const navShellPadX = navbarMarginX;

/** Pill bar inner padding (Figma ~58.8 / ~20.5). */
export const navPillPadX = fluid1920(58.8, { min: 16, max: 72 });
export const navPillPadY = fluid1920(20.5, { min: 12, max: 28 });
export const navPillRadius = fluid1920(18.67, { min: 12, max: 22 });

/** Gap between primary nav links at desktop. */
export const navLinkGap = fluid1920(102, { min: 12, max: 120 });

export const navLogoHeight = fluid1920(32, { min: 24, max: 40 });
export const navIconSize = fluid1920(22, { min: 18, max: 28 });

/** Space between pill bar and mega menu panel. */
export const navMegaMenuMarginTop = fluid1920(12, { min: 8, max: 18 });

/** Mega menu panel (990-4503 family). */
export const megaPadLeft = fluid1920(148, { min: 20, max: 160 });
export const megaPadRight = fluid1920(58, { min: 16, max: 72 });
export const megaPadY = fluid1920(58, { min: 24, max: 72 });
export const megaGap = fluid1920(48, { min: 20, max: 56 });
export const megaRadius = fluid1920(18.67, { min: 12, max: 22 });
export const megaMinHeight = fluid1920(280, { min: 200, max: 340 });
export const megaImgWidth = fluid1920(332.267, { min: 200, max: 360 });
export const megaImgHeight = fluid1920(220.267, { min: 132, max: 240 });

/** Typography — nav & mega (14px design). */
export const navFontSize = fluid1920(14, { min: 12, max: 15 });
export const megaTitleMarginBottom = fluid1920(16, { min: 10, max: 20 });
export const megaLinkGap = fluid1920(10, { min: 6, max: 12 });

/** Shop control (990-4515). */
export const shopFontSize = fluid1920(14, { min: 12, max: 15 });
export const shopPadX = fluid1920(18, { min: 9, max: 18 });
export const shopPadY = fluid1920(9, { min: 6, max: 12 });
export const shopRadius = fluid1920(9.33, { min: 15, max: 30 });
export const shopBorderWidth = fluid1920(0.93, { min: 1, max: 1.5 });

/** Explore category block inner padding @ 1920 (card padding inside 265px shell). */
export const exploreSectionPadX = fluid1920(130, { min: 16, max: 140 });
export const exploreSectionPadY = fluid1920(102, { min: 32, max: 120 });
export const exploreHeadingFontSize = fluid1920(64, { min: 28, max: 72 });
export const exploreCardImageHeight = fluid1920(441, { min: 220, max: 480 });
export const exploreGridGap = fluid1920(28, { min: 16, max: 32 });
export const exploreLabelFontSize = fluid1920(14, { min: 12, max: 15 });

/** Hero carousel controls @ 1920 (arrows + pagination). */
export const carouselArrowPadding = fluid1920(14, { min: 8, max: 16 });
export const carouselChevronSize = fluid1920(22, { min: 16, max: 24 });
export const carouselDotsGap = fluid1920(10, { min: 6, max: 12 });
export const carouselDotActiveWidth = fluid1920(58, { min: 36, max: 64 });
export const carouselDotTrackHeight = fluid1920(7, { min: 5, max: 8 });
export const carouselDotInactiveSize = fluid1920(10, { min: 7, max: 11 });
export const carouselDotPillRadius = fluid1920(4, { min: 3, max: 5 });

/** Feature Space strip (990:4540) @ 1920×1080 — height scales with viewport (`vh`). */
export const featureSpaceBg = "#ccbca6";
export const featureSpaceHeight = fluid1080(379, { min: 80, max: 250 });

/** Discover by category (990:4552) @ 1920×1080 */
export const discoverSectionPadX = fluid1920(198, { min: 16, max: 220 });
/** Left/right padding inside the scrolling carousel strip — aligns card start with section content. */
export const discoverCarouselEdgePadX = fluid1920(60, { min: 16, max: 60 });
export const discoverSectionPadY = fluid1080(128, { min: 48, max: 140 });
export const discoverTitleToTabsGap = fluid1080(54, { min: 24, max: 64 });
export const discoverTabsToCarouselGap = fluid1080(54, { min: 24, max: 64 });
export const discoverTabGap = fluid1920(20.5, { min: 8, max: 24 });
export const discoverCarouselGap = fluid1920(67.2, { min: 16, max: 80 });
export const discoverCardWidth = fluid1920(412.5, { min: 260, max: 440 });
export const discoverCardPadX = fluid1920(52.27, { min: 16, max: 56 });
export const discoverCardPadY = fluid1920(48.53, { min: 24, max: 52 });
export const discoverCardRadius = fluid1920(18.67, { min: 12, max: 22 });
export const discoverCardInnerGap = fluid1920(39.2, { min: 20, max: 44 });
export const discoverImageBoxH = fluid1080(278.13, { min: 180, max: 300 });
export const discoverNavBtnSize = fluid1920(39.2, { min: 32, max: 44 });
/** Inset inside nav circles — must stay small vs `discoverNavBtnSize` so chevrons remain visible. */
export const discoverNavIconPadding = fluid1920(8, { min: 5, max: 10 });
export const discoverTagPadX = fluid1920(16.8, { min: 10, max: 20 });
export const discoverTagPadY = fluid1080(11.2, { min: 6, max: 14 });
export const discoverProductTitleSize = fluid1920(22, { min: 16, max: 24 });
export const discoverPriceSize = fluid1920(16, { min: 14, max: 18 });
export const discoverMetaGap = fluid1080(13.07, { min: 8, max: 16 });
export const discoverSeeMoreGap = fluid1920(26.13, { min: 12, max: 32 });
export const discoverSeeMorePadX = fluid1920(46.67, { min: 20, max: 52 });
export const discoverSeeMorePadY = fluid1080(23.33, { min: 12, max: 28 });
export const discoverSeeMoreRadius = fluid1920(13.07, { min: 8, max: 16 });
export const discoverTitleMaxWidth = fluid1920(756, { min: 280, max: 756 });
export const discoverHeartIconSize = fluid1920(22.4, { min: 18, max: 26 });
export const discoverSeeMoreArrowWidth = fluid1920(72.34, { min: 48, max: 80 });
export const discoverSeeMoreArrowHeight = fluid1080(16.85, {
  min: 12,
  max: 20,
});

/** Discover Collection copy band (990:4732) @ 1920×1080 */
export const discoverCollectionPadX = fluid1920(239, { min: 16, max: 260 });
export const discoverCollectionPadY = fluid1080(117, { min: 48, max: 140 });
export const discoverCollectionInnerMaxW = fluid1920(1404, {
  min: 320,
  max: 1440,
});
export const discoverCollectionGap = fluid1920(120, { min: 24, max: 140 });
export const discoverCollectionBodyMaxW = fluid1920(550, {
  min: 280,
  max: 600,
});
export const discoverCollectionBodyFontSize = fluid1920(12, {
  min: 12,
  max: 12,
});

/** Collection spotlight — hero overlays (990:4743–990:4764) @ 1920×1080 */
export const collectionSpotlightPadX = fluid1920(239, { min: 16, max: 260 });
export const collectionSpotlightPillsGap = fluid1920(16, { min: 8, max: 20 });
export const collectionSpotlightStampSize = fluid1920(200, {
  min: 120,
  max: 240,
});
export const collectionSpotlightPillFontSize = fluid1920(14, {
  min: 12,
  max: 14,
});
/** Top/bottom tan bars framing the lifestyle image */
export const collectionSpotlightFrameBarH = fluid1080(24, { min: 14, max: 32 });
/** Space from image bottom edge to the collection pill row */
export const collectionSpotlightPillsInsetBottom = fluid1080(36, {
  min: 20,
  max: 48,
});
/** Press logo strip (990:4737) — vertical padding inside the tan band */
export const pressStripPadTop = fluid1080(80, { min: 40, max: 96 });
export const pressStripPadBottom = fluid1080(104, { min: 52, max: 124 });

/** Collection spotlight product card inner frame (990:4751) @ 1920 — outer ring + inner panel */
export const spotlightCardOuterMaxW = fluid1920(272, { min: 248, max: 292 });
export const spotlightCardOuterPad = fluid1920(8.018, { min: 6, max: 10 });
export const spotlightCardOuterRadius = fluid1920(14.578, { min: 12, max: 18 });
export const spotlightCardInnerRadius = fluid1920(10.205, { min: 8, max: 12 });
export const spotlightCardInnerPt = fluid1920(24.783, { min: 16, max: 28 });
export const spotlightCardInnerPr = fluid1920(19.68, { min: 14, max: 24 });
export const spotlightCardInnerPb = fluid1920(24.054, { min: 16, max: 28 });
export const spotlightCardInnerPl = fluid1920(30.614, { min: 16, max: 34 });
export const spotlightCardSectionGap = fluid1920(26.241, { min: 18, max: 30 });
export const spotlightCardMetaGap = fluid1920(8.747, { min: 6, max: 12 });
export const spotlightCardImageBoxH = fluid1920(156.714, {
  min: 120,
  max: 175,
});
export const spotlightCardImagePad = fluid1920(7.289, { min: 4, max: 10 });
export const spotlightCardBadgePx = fluid1920(11.662, { min: 8, max: 14 });
export const spotlightCardBadgePy = fluid1920(7.289, { min: 5, max: 10 });
export const spotlightCardBadgeRadius = fluid1920(5.831, { min: 4, max: 8 });
export const spotlightCardBadgeFontSize = fluid1920(10, { min: 9, max: 11 });
export const spotlightCardTitleSize = fluid1920(22, { min: 16, max: 24 });
export const spotlightCardPriceSize = fluid1920(12, { min: 11, max: 14 });
export const spotlightCardHeartW = fluid1920(14.578, { min: 12, max: 16 });
export const spotlightCardHeartH = fluid1920(13.12, { min: 11, max: 15 });

/** FAQ + Footer band (990:4631) @ 1920×1080 */
export const faqFooterPadX = fluid1920(117.6, { min: 16, max: 120 });
export const faqFooterPadY = fluid1080(146, { min: 48, max: 160 });
export const faqFooterStackGap = fluid1920(117.6, { min: 32, max: 120 });
export const faqFooterTitleGap = fluid1080(54, { min: 24, max: 64 });
export const faqFooterTitleSize = fluid1920(64, { min: 28, max: 72 });
export const faqFooterInnerMaxW = fluid1920(1310.4, { min: 320, max: 1400 });
export const faqCategoryPillPadX = fluid1920(16.8, { min: 12, max: 20 });
export const faqCategoryPillPadY = fluid1080(13.067, { min: 8, max: 16 });
export const faqCategoryPillRadius = fluid1920(9.333, { min: 6, max: 12 });
export const faqCategoryGap = fluid1920(20.533, { min: 8, max: 24 });
export const faqAccordionGap = fluid1920(29.867, { min: 16, max: 32 });
export const faqAccordionRadius = fluid1920(18.667, { min: 12, max: 22 });
export const faqAccordionPadX = fluid1920(55.067, { min: 16, max: 56 });
export const faqAccordionPadYExpanded = fluid1080(42.933, { min: 24, max: 48 });
export const faqAccordionPadYCollapsed = fluid1080(36.4, { min: 20, max: 40 });
export const faqQuestionSize = fluid1920(24, { min: 18, max: 26 });
export const faqAnswerSize = fluid1920(14, { min: 12, max: 16 });
export const footerPadX = fluid1080(60, { min: 28, max: 60 });
export const footerBandPadX = fluid1920(116.667, { min: 16, max: 120 });
export const footerBandPadY = fluid1080(99.867, { min: 40, max: 120 });
export const footerBandRadius = fluid1920(14, { min: 10, max: 16 });
export const footerNewsletterH = fluid1080(63.467, { min: 48, max: 72 });
export const footerNewsletterRadius = fluid1920(10, { min: 8, max: 12 });
/** Newsletter field padding (990:4673) */
export const footerNewsletterInputPadX = fluid1920(46.667, {
  min: 16,
  max: 52,
});
export const footerNewsletterInputPadY = fluid1080(20.533, {
  min: 12,
  max: 24,
});
/** Frame 117 width (990:4675) */
export const footerNewsletterBtnW = fluid1920(147.467, { min: 120, max: 160 });
/** Space before submit art so text doesn’t sit under it (990:4673 gap 9.333) */
export const footerNewsletterTextBtnGap = fluid1920(9.333, { min: 4, max: 12 });
export const footerColumnGap = fluid1920(95.2, { min: 24, max: 100 });
export const footerLinkGap = fluid1920(20, { min: 12, max: 24 });
export const footerSectionHeadingGap = fluid1080(32, { min: 20, max: 32 });
export const footerPaymentIconGap = fluid1920(33.6, { min: 16, max: 40 });
export const footerBrandColMaxW = fluid1920(403.2, { min: 280, max: 420 });
/** Gap between brand column and links + contact row (footer main row @ 1920). */
export const footerMainColumnsGap = fluid1920(240, { min: 64, max: 240 });

/** Footer card inner column (990:4664–990:4679) @ 1920×1080 */
export const footerLogoToTaglineGap = fluid1920(31.733, { min: 16, max: 36 });
/** Between blurb and “Subscribe to newsletter” block */
export const footerTaglineToNewsletterGap = fluid1080(54.133, {
  min: 28,
  max: 60,
});
export const footerNewsletterTitleToFormGap = fluid1920(30.8, {
  min: 20,
  max: 36,
});
/** Between newsletter row and copyright (990:4666 gap 108.267) */
export const footerNewsletterToCopyrightGap = fluid1080(108.267, {
  min: 48,
  max: 120,
});
export const footerLinksClusterMaxW = fluid1920(761.6, { min: 280, max: 800 });
export const footerLinksRowMaxW = fluid1920(735, { min: 280, max: 760 });
export const footerQuickLinksColW = fluid1920(138, { min: 120, max: 160 });
export const footerInformationColW = fluid1920(194.133, { min: 160, max: 220 });
export const footerContactColW = fluid1920(251.067, { min: 200, max: 280 });
/** Placeholder + input text (990:4677) */
export const footerNewsletterPlaceholderColor = "#bc7e5a";

/** Category furniture hero (990:4811, 990:4905) @ 1920×1080 */
export const furnitureHeroMinHeight = fluid1080(1010, { min: 420, max: 1010 });
export const furnitureHeroTitleSize = fluid1920(110, { min: 42, max: 110 });
export const furnitureHeroBreadcrumbToTitleGap = fluid1920(399, {
  min: 32,
  max: 399,
});
export const furnitureHeroTitleToBodyGap = fluid1920(53, { min: 24, max: 56 });
export const furnitureHeroBodyMaxW = fluid1920(756, { min: 280, max: 756 });
export const furnitureHeroBodyFontSize = fluid1920(16, { min: 14, max: 16 });
export const furnitureHeroBreadcrumbFontSize = fluid1920(16, {
  min: 14,
  max: 16,
});

/** Furniture page shell — inset below hero (128px x, 144px y @ 1920×1080) */
export const furniturePagePadX = fluid1920(128, { min: 16, max: 128 });
export const furniturePagePadY = fluid1080(144, { min: 48, max: 144 });

/** Furniture PLP toolbar + grid (990:5601) @ 1920 */
export const furnitureListingSectionGap = fluid1920(90, { min: 40, max: 90 });
export const furnitureListingSidebarGap = fluid1920(94, { min: 24, max: 94 });
export const furnitureListingSidebarWidth = fluid1920(329, {
  min: 260,
  max: 360,
});
export const furnitureListingGridRowGap = fluid1920(45, { min: 24, max: 48 });
export const furnitureListingGridColGap = fluid1920(55, { min: 20, max: 56 });
export const furnitureListingCardPad = fluid1920(48, { min: 24, max: 52 });
export const furnitureListingCardRadius = fluid1920(14, { min: 12, max: 16 });
export const furnitureListingImageH = fluid1920(227, { min: 180, max: 240 });
export const furnitureListingProductTitleSize = fluid1920(24, {
  min: 18,
  max: 26,
});
export const furnitureListingPriceSize = fluid1920(16, { min: 14, max: 16 });
export const furnitureListingBadgeFontSize = fluid1920(14, {
  min: 12,
  max: 14,
});
export const furnitureListingToolbarGap = fluid1920(51, { min: 24, max: 56 });
/** Space between filter icon and sort cluster when toolbar wraps */
export const furnitureListingToolbarRowGap = fluid1920(16, {
  min: 12,
  max: 20,
});
export const furnitureListingFilterRowGap = fluid1920(34, { min: 20, max: 36 });
export const furnitureListingFilterToActionsGap = fluid1920(57, {
  min: 32,
  max: 60,
});
export const furnitureListingActionBtnGap = fluid1920(29, { min: 16, max: 32 });
/** Toolbar filter control (990:5603) — h 52px @ 1920 */
export const furnitureListingFilterIconBox = fluid1920(52, {
  min: 44,
  max: 56,
});
/** Card top row / image / meta max widths from Figma */
export const furnitureListingCardHeaderMaxW = fluid1920(280, {
  min: 220,
  max: 300,
});
export const furnitureListingCardImageMaxW = fluid1920(221, {
  min: 180,
  max: 240,
});
export const furnitureListingCardMetaMaxW = fluid1920(281, {
  min: 240,
  max: 300,
});
/** Vertical gap badge row → image (26px) */
export const furnitureListingCardSectionGap = fluid1920(26, {
  min: 18,
  max: 28,
});
/** Title → price (14px) */
export const furnitureListingCardMetaGap = fluid1920(14, { min: 10, max: 16 });
/** Listing section vertical padding (replaces fixed theme spacing) */
export const furnitureListingSectionPadY = fluid1080(48, { min: 24, max: 56 });
/** Sort pill (990:5609) */
export const furnitureListingSortPadX = fluid1920(24, { min: 16, max: 28 });
export const furnitureListingSortPadY = fluid1920(16, { min: 12, max: 20 });
export const furnitureListingSortEndGap = fluid1920(20, { min: 12, max: 22 });
/** Space between sort pill and dropdown panel (990:6461) */
export const furnitureListingSortDropdownGap = fluid1920(20, {
  min: 12,
  max: 22,
});
export const furnitureListingSortDropdownPad = fluid1920(24, {
  min: 16,
  max: 28,
});
export const furnitureListingSortDropdownItemGap = fluid1920(24, {
  min: 16,
  max: 28,
});
export const furnitureListingSortDropdownMinW = fluid1920(182, {
  min: 160,
  max: 220,
});
/** Filter actions View / Clear (990:5631) */
export const furnitureListingFilterActionPadX = fluid1920(36, {
  min: 24,
  max: 40,
});
export const furnitureListingFilterActionPadY = fluid1920(20, {
  min: 14,
  max: 24,
});
/** Badge pill padding in card */
export const furnitureListingBadgePadX = fluid1920(16, { min: 12, max: 18 });
export const furnitureListingBadgePadY = fluid1920(10, { min: 8, max: 12 });
/** Hamburger + chevron assets @ 1920 */
export const furnitureListingFilterMenuIconW = fluid1920(20, {
  min: 16,
  max: 22,
});
export const furnitureListingFilterMenuIconH = fluid1920(14, {
  min: 12,
  max: 16,
});
export const furnitureListingChevronW = fluid1920(15, { min: 12, max: 16 });
export const furnitureListingChevronH = fluid1920(7, { min: 6, max: 9 });

/** Open filter panel (990:6260) */
export const furnitureFilterSectionDividerGap = fluid1920(22, {
  min: 16,
  max: 26,
});
export const furnitureFilterSectionHeaderPadY = fluid1920(10, {
  min: 8,
  max: 12,
});
export const furnitureFilterSectionStackGap = fluid1920(34, {
  min: 20,
  max: 36,
});
export const furnitureFilterPriceInputsGap = fluid1920(39, {
  min: 16,
  max: 40,
});
export const furnitureFilterChipStackGap = furnitureListingCardMetaGap;
export const furnitureFilterThemeHeaderToChipsGap = fluid1920(39, {
  min: 20,
  max: 40,
});
export const furnitureFilterInputWidth = fluid1920(112, { min: 88, max: 120 });
export const furnitureFilterInputPadX = fluid1920(18, { min: 12, max: 20 });
export const furnitureFilterInputPadY = fluid1920(14, { min: 10, max: 16 });
export const furnitureFilterToLabelSize = fluid1920(14, { min: 12, max: 14 });
export const furnitureFilterSliderThumbSize = fluid1920(15, {
  min: 14,
  max: 16,
});
export const furnitureFilterSliderTrackH = fluid1920(4, { min: 3, max: 5 });

/** Furniture PLP — Customisation band (990:6384, banner only; footer stays `SiteFooter`) */
export const furnitureCustomisationBandPadX = fluid1920(126, {
  min: 16,
  max: 140,
});
export const furnitureCustomisationBandPadY = fluid1080(128, {
  min: 48,
  max: 140,
});

/** Bottom padding of the tan band only — tighter than `furnitureCustomisationBandPadY` so the footer sits closer. */
export const furnitureCustomisationBandPadBottom = fluid1080(56, {
  min: 24,
  max: 64,
});

/** `SiteFooter` shell `padding-top` on `/category/furniture` (smaller than `faqFooterStackGap` to meet the customisation band). */
export const siteFooterShellPadTopFurniture = fluid1920(36, {
  min: 16,
  max: 44,
});
export const furnitureCustomisationTopRadius = fluid1920(47, {
  min: 24,
  max: 48,
});
export const furnitureCustomisationCardInnerPadX = fluid1920(130, {
  min: 20,
  max: 140,
});
export const furnitureCustomisationCardInnerPadY = fluid1080(162, {
  min: 48,
  max: 180,
});
export const furnitureCustomisationTitleSize = fluid1920(42, {
  min: 28,
  max: 48,
});
export const furnitureCustomisationBodyMaxW = fluid1920(667, {
  min: 280,
  max: 720,
});
export const furnitureCustomisationStackGap = fluid1920(15, {
  min: 12,
  max: 20,
});
export const furnitureCustomisationCtaPadX = fluid1920(40, {
  min: 20,
  max: 44,
});
export const furnitureCustomisationCtaPadY = fluid1080(18, {
  min: 12,
  max: 22,
});
export const furnitureCustomisationMediaMinH = fluid1080(504, {
  min: 280,
  max: 560,
});

/** `object-position` for the customisation band image (`object-fit: cover`); adjust to reframe. */
export const furnitureCustomisationImageObjectPosition = "50% 56%";

/** Corner radius of the customisation lifestyle image card. */
export const furnitureCustomisationCardRadius = fluid1920(24, {
  min: 16,
  max: 32,
});

/** Product quick-view modal — Figma 990:8629 (`fluid1920` / `fluid1080`). */
export const productDetailModalMaxW = fluid1920(1300, { min: 300, max: 1300 });
export const productDetailModalPad = fluid1920(64, { min: 16, max: 72 });
export const productDetailModalPadTop = fluid1080(64, { min: 48, max: 72 });
export const productDetailModalColGap = fluid1920(60, { min: 24, max: 64 });
export const productDetailModalMediaColMaxW = fluid1920(555, {
  min: 280,
  max: 560,
});
export const productDetailModalCopyColMaxW = fluid1920(492, {
  min: 280,
  max: 520,
});
export const productDetailModalMainImageMinH = fluid1080(441, {
  min: 200,
  max: 460,
});
export const productDetailModalMainImageMaxH = fluid1080(441, {
  min: 240,
  max: 480,
});
export const productDetailModalThumbW = fluid1920(123, { min: 64, max: 128 });
export const productDetailModalThumbH = fluid1080(127, { min: 64, max: 132 });
export const productDetailModalThumbGap = fluid1920(21, { min: 8, max: 24 });
export const productDetailModalThumbRowGap = fluid1080(34, {
  min: 12,
  max: 36,
});
export const productDetailModalThumbMt = fluid1080(34, { min: 16, max: 36 });
export const productDetailModalRadius = fluid1920(20, { min: 12, max: 22 });
export const productDetailModalSectionGap = fluid1920(37, { min: 20, max: 40 });
export const productDetailModalBlockGap = fluid1920(34, { min: 16, max: 36 });
export const productDetailModalLabelGap = fluid1920(22, { min: 12, max: 24 });
export const productDetailModalPriceRowGap = fluid1920(11, { min: 8, max: 14 });
export const productDetailModalSizeChipGap = fluid1920(18, {
  min: 10,
  max: 20,
});
export const productDetailModalSizeChipPadX = fluid1920(16, {
  min: 12,
  max: 20,
});
export const productDetailModalSizeChipPadY = fluid1080(20, {
  min: 12,
  max: 24,
});
export const productDetailModalChipRadius = fluid1920(12, { min: 8, max: 14 });
export const productDetailModalQtyRowGap = fluid1920(23, { min: 12, max: 28 });
export const productDetailModalQtyInnerGap = fluid1920(58, {
  min: 28,
  max: 60,
});
export const productDetailModalQtyPadX = fluid1920(46.5, { min: 20, max: 48 });
export const productDetailModalQtyPadY = fluid1080(20, { min: 12, max: 24 });
export const productDetailModalCtaPadX = fluid1920(24, { min: 24, max: 24 });
export const productDetailModalCtaPadY = fluid1080(20, { min: 14, max: 24 });
export const productDetailModalMrpFontSize = fluid1920(14, {
  min: 12,
  max: 15,
});
export const productDetailModalCloseOffset = fluid1920(16, { min: 8, max: 20 });
export const productDetailModalCloseIconSize = fluid1920(24, {
  min: 20,
  max: 28,
});

/** Cream shell: default `SiteFooter` outer + most page chrome (`#f3ede3`). */
export const siteFooterShellBgDefault = "#f3ede3";

/** Tan shell on catalog PLP routes — matches promo band + `SiteFooter` (Figma 990:6384). */
export const furnitureCategoryShellBg = "#ccbca6";

/** Rounded top corners for the customizations-page footer shell (Figma 990:1736 — 47px at 1920). */
export const siteFooterCustomizationsTopRadius = fluid1920(47, {
  min: 12,
  max: 47,
});

/** Top padding for the customizations-page footer shell (Figma 990:1736 — 126px at 1920). */
export const siteFooterCustomizationsPadTop = fluid1920(126, {
  min: 48,
  max: 140,
});

/** Scrim behind `Dialog` / `Modal` — `#CCBCA6` @ 40% opacity. */
export const modalBackdropTint = "rgba(204, 188, 166, 0.6)";

/** ──── PDP hero (Figma 990:12569 + 990:12663 + 990:12691/12692) ──── */
export const pdpHeroPadX = fluid1920(128, { min: 20, max: 140 });
export const pdpHeroPadTop = fluid1080(190, { min: 100, max: 210 });
export const pdpHeroPadBottom = fluid1080(100, { min: 48, max: 120 });
export const pdpHeroBreadcrumbToContentGap = fluid1080(60, {
  min: 32,
  max: 60,
});
export const pdpHeroBadgeToTitleGap = fluid1080(32, { min: 32, max: 32 });
export const pdpHeroTitleToDescGap = fluid1080(16, { min: 16, max: 16 });
export const pdpHeroTitleSize = fluid1920(176, { min: 48, max: 200 });
export const pdpHeroDescMaxW = fluid1920(701, { min: 280, max: 720 });
export const pdpHeroBadgePadX = fluid1920(36, { min: 20, max: 40 });
export const pdpHeroBadgePadY = fluid1080(20, { min: 12, max: 24 });
export const pdpHeroBadgeRadius = fluid1920(10, { min: 8, max: 12 });
export const pdpHeroBadgeFontSize = fluid1920(16, { min: 13, max: 17 });
export const pdpHeroBreadcrumbGap = fluid1920(28, { min: 12, max: 32 });

/** PDP hero section height — 1049px in a 1049-tall hero area (Figma artboard). */
export const pdpHeroMinH = fluid1080(1049, { min: 480, max: 1080 });

/**
 * Absolutely positioned product images — Figma coordinates at 1919×1049 artboard.
 * Image LEFT (Layer 006, heroImages[0]): x=-66, y=643, w=1003, h=743 — lower, left half.
 * Image RIGHT (Layer 007, heroImages[1]): x=736, y=426, w=941, h=646 — higher, right half.
 */
export const pdpHeroImgLeftLeft = "-3.4%";
export const pdpHeroImgLeftTop = "61.3%";
export const pdpHeroImgLeftW = "52.3%";

export const pdpHeroImgRightLeft = "38.4%";
export const pdpHeroImgRightTop = "40.6%";
export const pdpHeroImgRightW = "49%";

/** Discover page hero — Figma 1165:401 @ 1920×1446 */
export const discoverHeroMinH = fluid1920(1446, { min: 480, max: 1446 });
export const discoverHeroDescMaxW = fluid1920(922, { min: 280, max: 960 });

/** Discover philosophy band — Figma 1366:2758 @ 1920 */
export const discoverPhilosophyPadX = fluid1920(312, { min: 16, max: 320 });
export const discoverPhilosophyPadTop = fluid1920(126, { min: 48, max: 140 });
export const discoverPhilosophyPadBottom = fluid1920(80, { min: 40, max: 100 });
export const discoverPhilosophyGap = fluid1920(58, { min: 32, max: 64 });
export const discoverPhilosophyTitleSize = fluid1920(68, { min: 32, max: 76 });
export const discoverPhilosophyBodyMaxW = fluid1920(1296, {
  min: 280,
  max: 1296,
});
export const discoverPhilosophyBadgePadX = fluid1920(18, { min: 12, max: 22 });
export const discoverPhilosophyBadgePadY = fluid1920(12, { min: 8, max: 14 });
export const discoverPhilosophyBadgeRadius = fluid1920(10, { min: 8, max: 12 });
export const discoverPhilosophyBadgeMinW = fluid1920(169, {
  min: 140,
  max: 180,
});
export const discoverPhilosophyRugMaxW = fluid1920(1342, {
  min: 320,
  max: 1342,
});
export const discoverPhilosophyRugPadX = fluid1920(289, { min: 16, max: 300 });
/** Tan story band pulls up over the bottom of the philosophy rug — Figma 2699 − 2334 = 365px @ 1920. */
export const discoverPhilosophyRugOverlapIntoStory = fluid1920(365, {
  min: 140,
  max: 365,
});

/** Discover story band — Figma 1366:2746 @ 1920 */
export const discoverStorySectionMinH = fluid1920(1943, {
  min: 900,
  max: 1943,
});
export const discoverStoryPadX = fluid1920(127, { min: 16, max: 140 });
export const discoverStoryIntroPadX = fluid1920(258, { min: 16, max: 280 });
export const discoverStoryPadBottom = fluid1920(120, { min: 48, max: 140 });
export const discoverStoryContentPadTop = fluid1920(157, { min: 32, max: 157 });
export const discoverStoryPortraitW = fluid1920(520, { min: 260, max: 520 });
export const discoverStoryPortraitH = fluid1920(567, { min: 320, max: 567 });
export const discoverStoryPortraitRadius = fluid1920(14, { min: 10, max: 16 });
export const discoverStoryTitleLeft = fluid1920(770, { min: 0, max: 770 });
export const discoverStoryTitleSize = fluid1920(68, { min: 32, max: 76 });
export const discoverStoryTitleMaxW = fluid1920(862, { min: 280, max: 862 });
export const discoverStoryIntroMaxW = fluid1920(542, { min: 280, max: 542 });
export const discoverStorySubheadingSize = fluid1920(42, { min: 24, max: 46 });
export const discoverStoryRightColMaxW = fluid1920(514, { min: 280, max: 514 });
export const discoverStoryTextColGap = fluid1920(32, { min: 20, max: 36 });
export const discoverStoryRugW = fluid1920(831, { min: 280, max: 831 });
export const discoverStoryRugH = fluid1920(584, { min: 220, max: 584 });
export const discoverStoryRugRight = fluid1920(128, { min: 16, max: 140 });
export const discoverStoryRugTop = fluid1920(460, { min: 200, max: 460 });
export const discoverStoryRugRadius = fluid1920(14, { min: 10, max: 16 });
export const discoverStoryBodyTop = fluid1920(831, { min: 400, max: 831 });
/** Visible sofa frame (1366:2786) — masked crop of the lifestyle photo. */
export const discoverStorySofaFrameW = fluid1920(440, { min: 240, max: 440 });
export const discoverStorySofaFrameH = fluid1920(584, { min: 280, max: 584 });
export const discoverStorySofaFrameLeft = fluid1920(521, { min: 16, max: 521 });
/** Row 3 top — sofa frame + meaning block share y=3535 in Figma (1201 from tan top). */
export const discoverStoryRow3Top = fluid1920(1201, { min: 560, max: 1201 });
export const discoverStoryPortraitToBodyGap = fluid1920(107, {
  min: 48,
  max: 120,
});
export const discoverStoryEditorialMinH = fluid1920(1628, {
  min: 720,
  max: 1628,
});
export const discoverStorySofaRadius = fluid1920(14, { min: 10, max: 16 });
export const discoverStoryMeaningLeft = fluid1920(1148, { min: 0, max: 1148 });
/** @deprecated Use discoverStorySofaFrameW — full uncropped asset width in Figma. */
export const discoverStorySofaW = fluid1920(819, { min: 280, max: 819 });
/** @deprecated Use discoverStoryRow3Top — uncropped image top in Figma. */
export const discoverStorySofaTop = fluid1920(934, { min: 440, max: 934 });
/** @deprecated Use discoverStorySofaFrameLeft. */
export const discoverStorySofaLeft = fluid1920(442, { min: 16, max: 442 });
export const discoverStoryMeaningTop = fluid1920(1201, { min: 560, max: 1201 });

/** Discover journey band — Figma 1366:2652 cream section @ 1920, content y=4434–6198 */
export const discoverJourneyPadTop = fluid1920(157, { min: 32, max: 157 });
export const discoverJourneyPadBottom = fluid1920(120, { min: 48, max: 140 });
export const discoverJourneyLabelSize = fluid1920(16, { min: 12, max: 16 });
export const discoverJourneyClosingSize = fluid1920(42, { min: 24, max: 46 });
export const discoverJourneyBodyMaxW = fluid1920(387, { min: 280, max: 387 });
export const discoverJourneyClosingMaxW = fluid1920(1251, {
  min: 280,
  max: 1251,
});
export const discoverJourneyImageRadius = fluid1920(14, { min: 10, max: 16 });
export const discoverJourneySparkleW = fluid1920(87, { min: 48, max: 87 });
export const discoverJourneySparkleH = fluid1920(40, { min: 24, max: 40 });

/** Customizations page hero + how-it-works — Figma 1162:7/8 @ 1920×1080 */
export const customHeroMinH = fluid1080(1010, { min: 420, max: 1010 });
export const customHeroTitleSize = fluid1920(110, { min: 40, max: 120 });
export const customHeroDescMaxW = fluid1920(811, { min: 280, max: 840 });
export const customHeroDescToNoteGap = fluid1080(16, { min: 12, max: 20 });
export const customHowItWorksSectionPadX = fluid1920(127, {
  min: 20,
  max: 140,
});
export const customHowItWorksSectionPadY = fluid1080(167, {
  min: 48,
  max: 180,
});
export const customHowItWorksTitleSize = fluid1920(68, { min: 32, max: 76 });
export const customHowItWorksTitleToCardsGap = fluid1080(112, {
  min: 40,
  max: 120,
});
export const customHowItWorksCardGap = fluid1080(20, { min: 14, max: 24 });
export const customHowItWorksCardPadX = fluid1920(36, { min: 20, max: 40 });
export const customHowItWorksCardPadY = fluid1080(31, { min: 20, max: 36 });
export const customHowItWorksCardRadius = fluid1920(14, { min: 10, max: 16 });
export const customHowItWorksCardMaxW = fluid1920(723, { min: 280, max: 760 });
export const customHowItWorksCardInnerGap = fluid1080(20, { min: 14, max: 24 });
export const customHowItWorksStepFontSize = fluid1920(16, { min: 13, max: 17 });
export const customHowItWorksCardTitleSize = fluid1920(25, {
  min: 18,
  max: 28,
});
export const customHowItWorksPhotoMaxW = fluid1920(834, { min: 260, max: 860 });
export const customHowItWorksColGap = fluid1920(100, { min: 24, max: 120 });

/** Extra space below the hero to accommodate the left image bleeding 337px past the tan area. */
export const pdpHeroImageBleedMargin = fluid1080(337, { min: 160, max: 380 });
export const pdpHeroImageBleedMarginDesc = fluid1080(60, { min: 40, max: 60 });

/** PDP body — lifestyle grid 990:14339 + buy box 990:14514 @ 1920×1080 */
export const pdpBodySectionPadTop = fluid1920(40, { min: 24, max: 56 });
export const pdpBodyColGap = fluid1920(132, { min: 24, max: 132 });
export const pdpBodyGalleryGap = fluid1920(34, { min: 16, max: 40 });
export const pdpBodyGalleryRowMinH = fluid1920(618, { min: 280, max: 680 });
export const pdpBodyImageRadius = fluid1920(14, { min: 10, max: 18 });
export const pdpBodyGalleryMaxW = fluid1920(833, { min: 280, max: 900 });
export const pdpBodyDetailsMaxW = fluid1920(701, { min: 320, max: 701 });
export const pdpBodyBlockGap = fluid1920(40, { min: 24, max: 48 });
/** Label → field (e.g. “Price” → amount) — Figma 990:14526 / 14528 ≈ 33px. */
export const pdpBodyFieldLabelGap = fluid1920(33, { min: 16, max: 36 });
export const pdpBodyLabelGap = fluid1920(22, { min: 16, max: 24 });
/** Between stacked accordions — Figma ≈ 22px. */
export const pdpBodyAccordionListGap = fluid1920(22, { min: 16, max: 24 });
export const pdpBodyPriceSize = fluid1920(42, { min: 28, max: 44 });
export const pdpBodyAccordionRadius = fluid1920(20, { min: 14, max: 22 });
export const pdpBodyAccordionPadX = fluid1920(39, { min: 16, max: 44 });
export const pdpBodyAccordionPadY = fluid1920(28, { min: 18, max: 36 });
export const pdpBodyTitleToBodyGap = fluid1920(22, { min: 16, max: 24 });
export const pdpBodySwatchW = fluid1920(155, { min: 72, max: 160 });
export const pdpBodySwatchH = fluid1920(89, { min: 56, max: 100 });
export const pdpBodySwatchGap = fluid1920(27, { min: 10, max: 28 });
export const pdpBodyBtnRadius = fluid1920(12, { min: 8, max: 14 });
export const pdpBodyQtyRowGap = fluid1920(22, { min: 12, max: 24 });
export const pdpBodyQtyRowMinH = fluid1920(51, { min: 44, max: 56 });
export const pdpBodyMadeToOrderPadX = fluid1920(24, { min: 16, max: 28 });
export const pdpBodyMadeToOrderPadY = fluid1920(16, { min: 12, max: 20 });
export const pdpBodyAccentChipRadius = fluid1920(10, { min: 8, max: 12 });

/** Dimensions diagram — Figma 990:14581–14606 */
export const pdpBodyDimColGap = fluid1920(18, { min: 12, max: 22 });
export const pdpBodyDimChairToLinesGap = fluid1920(43, { min: 28, max: 48 });
export const pdpBodyDimLineToLabelGap = fluid1920(15, { min: 10, max: 18 });
export const pdpBodyDimLineVHeight = fluid1920(190, { min: 140, max: 200 });
export const pdpBodyDimColFrontMaxW = fluid1920(199, { min: 160, max: 220 });
export const pdpBodyDimColCenterW = fluid1920(66, { min: 52, max: 72 });
export const pdpBodyDimColSideMaxW = fluid1920(209, { min: 170, max: 230 });
