import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import {
  FaqAccordionItem,
  type FaqAccordionEntry,
} from "./FaqAccordionItem";
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
  const [category, setCategory] =
    useState<(typeof FAQ_CATEGORIES)[number]>("General");
  const [expandedId, setExpandedId] = useState<string | null>("q1");

  const items =
    category === "General"
      ? GENERAL_FAQ
      : GENERAL_FAQ.map((q) => ({ ...q, answer: undefined }));

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
        pt: faqFooterPadY,
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
          gap: faqFooterTitleGap,
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT_SURGENA,
            fontWeight: 600,
            fontSize: faqFooterTitleSize,
            lineHeight: 1.2,
            textAlign: "center",
            color: MUTED,
            textTransform: "uppercase",
          }}
        >
          Frequently Ask Questions
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: faqCategoryGap,
          }}
        >
          {FAQ_CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <ButtonBase
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setExpandedId("q1");
                }}
                sx={{
                  px: faqCategoryPillPadX,
                  py: faqCategoryPillPadY,
                  borderRadius: faqCategoryPillRadius,
                  border: active ? "none" : `${fluid1920(0.93)} solid ${TAN}`,
                  bgcolor: active ? ACCENT : "transparent",
                  fontFamily: active ? FONT_SURGENA : FONT_NAV,
                  fontWeight: 600,
                  fontSize: fluid1920(14, { min: 12, max: 15 }),
                  lineHeight: "normal",
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
          }}
        >
          {items.map((item) => (
            <FaqAccordionItem
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
