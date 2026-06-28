import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { FaqAccordionItem, type FaqAccordionEntry } from "./FaqAccordionItem";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import {
  faqAccordionGap,
  faqCategoryGap,
  faqCategoryPillPadX,
  faqCategoryPillPadY,
  faqCategoryPillRadius,
  faqFooterInnerMaxW,
  faqFooterPadX,
  faqFooterPadY,
  faqFooterTitleGap,
  faqFooterTitleSize,
  fluid1920,
} from "../navDesignTokens";

const PAGE_BG = "#f3ede3";
const MUTED = "#4b4a4a";
const ACCENT = "#bc7e5a";
const TAN = "#ccbca6";

const FAQ_CATEGORIES = ["General", "Shipping", "Payment", "Furniture"] as const;
type FaqCategory = (typeof FAQ_CATEGORIES)[number];

const GENERAL_FAQ: FaqAccordionEntry[] = [
  {
    id: "q1",
    question: "What is Corners?",
    answer:
      "Corners is a premium home décor and furniture brand that designs and curates bespoke pieces blending modern contemporary and Japandi aesthetics. Each product is thoughtfully designed to bring comfort, individuality, and emotion into your living space.",
  },
  {
    id: "q2",
    question: "Are Corners’ products handcrafted?",
    answer:
      "Many of our pieces involve hand finishing, upholstery, and detailing by skilled craftspeople. We combine artisan techniques with careful quality control so every item meets our standards before it reaches your home.",
  },
  {
    id: "q3",
    question: "Where are Corners products made?",
    answer:
      "Our collections are designed in-house and produced with trusted manufacturing partners in India, using materials and processes we stand behind. We’re transparent about origin and happy to share more for any product you’re considering.",
  },
  {
    id: "q4",
    question: "Do you take custom orders?",
    answer:
      "Yes, we offer customizations on select pieces—finishes, fabrics, dimensions, and more—depending on the range. Share your brief with our team and we’ll confirm feasibility, timelines, and pricing for you.",
  },
];

/** FAQ accordion (Figma 990:4631). Global footer: `SiteFooter`. */
export function FaqFooterSection() {
  const [category, setCategory] = useState<FaqCategory>("General");
  const [expandedId, setExpandedId] = useState<string | null>("q1");

  const hasContent = category === "General";
  const items = hasContent ? GENERAL_FAQ : [];

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Box
      component="section"
      aria-label="Frequently asked questions"
      sx={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        bgcolor: PAGE_BG,
        backdropFilter: "blur(1.867px)",
        px: faqFooterPadX,
        pt: { xs: 8, md: faqFooterPadY },
        pb: 0,
      }}
    >
      <Box
        sx={{
          maxWidth: faqFooterInnerMaxW,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 2, md: faqFooterTitleGap },
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontFamily: FONT_SURGENA,
            fontWeight: 600,
            fontSize: faqFooterTitleSize,
            lineHeight: 1.2,
            textAlign: "center",
            color: MUTED,
            textTransform: "uppercase",
            px: { xs: 0.5, sm: 0 },
          }}
        >
          Frequently Asked Questions
        </Typography>

        <Box
          role="tablist"
          aria-label="FAQ categories"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, auto)" },
            gap: faqCategoryGap,
            width: "100%",
            maxWidth: { xs: 360, sm: "none" },
            justifyContent: "center",
            justifyItems: { xs: "stretch", sm: "center" },
          }}
        >
          {FAQ_CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <ButtonBase
                key={cat}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setCategory(cat);
                  setExpandedId(cat === "General" ? "q1" : null);
                }}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  px: faqCategoryPillPadX,
                  py: faqCategoryPillPadY,
                  minHeight: { xs: 44, sm: "auto" },
                  borderRadius: faqCategoryPillRadius,
                  border: active ? "none" : `${fluid1920(0.93)} solid ${TAN}`,
                  bgcolor: active ? ACCENT : "transparent",
                  fontFamily: active ? FONT_SURGENA : FONT_NAV,
                  fontWeight: 600,
                  fontSize: fluid1920(14, { min: 12, max: 15 }),
                  lineHeight: 1,
                  color: active ? PAGE_BG : TAN,
                  textTransform: "uppercase",
                  transition: "background-color 0.2s, color 0.2s",
                }}
              >
                {cat}
              </ButtonBase>
            );
          })}
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: faqAccordionGap,
            mt: { xs: 0.5, sm: 0 },
          }}
        >
          {hasContent ? (
            items.map((item) => (
              <FaqAccordionItem
                key={item.id}
                item={item}
                expanded={expandedId === item.id}
                onToggle={() => toggle(item.id)}
              />
            ))
          ) : (
            <Typography
              sx={{
                py: { xs: 3, sm: 4 },
                fontFamily: FONT_NAV,
                fontWeight: 500,
                fontSize: fluid1920(14, { min: 13, max: 16 }),
                lineHeight: 1.5,
                textAlign: "center",
                color: "rgba(75, 74, 74, 0.65)",
              }}
            >
              {category} FAQs are coming soon.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
