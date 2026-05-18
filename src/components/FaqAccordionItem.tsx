import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import { FONT_NAV } from "../fonts";
import {
  faqAccordionPadX,
  faqAccordionPadYCollapsed,
  faqAccordionPadYExpanded,
  faqAccordionRadius,
  faqAnswerSize,
  faqQuestionSize,
  fluid1920,
} from "../navDesignTokens";

const MUTED = "#4b4a4a";
const ACCENT = "#bc7e5a";
const TAN = "#ccbca6";

const CHEVRON = "/faq-footer/chevron.svg";
const CHEVRON_MUTED = "/faq-footer/chevron-muted.svg";

export type FaqAccordionEntry = {
  id: string;
  question: string;
  answer?: string;
};

export type FaqAccordionItemProps = {
  item: FaqAccordionEntry;
  expanded: boolean;
  onToggle: () => void;
};

/**
 * Single FAQ accordion row: question header, optional expandable answer, chevron.
 */
export function FaqAccordionItem({
  item,
  expanded,
  onToggle,
}: FaqAccordionItemProps) {
  const hasAnswer = Boolean(item.answer);

  return (
    <Box
      sx={{
        width: "100%",
        border: `${fluid1920(0.93)} solid ${
          expanded && hasAnswer ? ACCENT : TAN
        }`,
        borderRadius: faqAccordionRadius,
        px: faqAccordionPadX,
        pt:
          expanded && hasAnswer
            ? faqAccordionPadYExpanded
            : faqAccordionPadYCollapsed,
        pb:
          expanded && hasAnswer
            ? faqAccordionPadYExpanded
            : faqAccordionPadYCollapsed,
        transition: "border-color 0.2s",
      }}
    >
      <ButtonBase
        disableRipple
        onClick={() => hasAnswer && onToggle()}
        aria-expanded={hasAnswer ? expanded : undefined}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          textAlign: "left",
          py: 0,
          px: 0,
          cursor: hasAnswer ? "pointer" : "default",
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: faqQuestionSize,
            lineHeight: 1.2,
            color: MUTED,
            textTransform: "uppercase",
            flex: 1,
            minWidth: 0,
          }}
        >
          {item.question}
        </Typography>
        <Box
          component="img"
          src={expanded && hasAnswer ? CHEVRON : CHEVRON_MUTED}
          alt=""
          sx={{
            width: fluid1920(22.4, { min: 18, max: 26 }),
            height: fluid1920(11.2, { min: 9, max: 14 }),
            flexShrink: 0,
            objectFit: "contain",
            transform: expanded && hasAnswer ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
            opacity: hasAnswer ? 1 : 0.85,
          }}
        />
      </ButtonBase>
      {hasAnswer && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 500,
              fontSize: faqAnswerSize,
              lineHeight: 1.4,
              color: MUTED,
              maxWidth: fluid1920(961, { min: 280, max: 960 }),
              mt: fluid1920(31.733),
              pr: { xs: 0, sm: fluid1920(28) },
            }}
          >
            {item.answer}
          </Typography>
        </Collapse>
      )}
    </Box>
  );
}
