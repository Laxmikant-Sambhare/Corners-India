import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useRouterState } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FONT_NAV } from "../fonts";
import { layoutPaddingX } from "../layoutConstants";
import { subscribeToNewsletter } from "../shopify/client";
import { selectIsLoggedIn, useAuthStore } from "../store/authStore";
import {
  faqAnswerSize,
  faqFooterInnerMaxW,
  faqFooterPadX,
  faqFooterPadY,
  fluid1920,
  footerBandPadX,
  footerBandPadY,
  footerBandRadius,
  footerBrandColMaxW,
  footerColumnGap,
  footerContactColW,
  footerInformationColW,
  footerLinkGap,
  footerLinksClusterMaxW,
  footerLinksRowMaxW,
  footerLogoToTaglineGap,
  footerMainColumnsGap,
  footerNewsletterBtnW,
  footerNewsletterH,
  footerNewsletterInputPadX,
  footerNewsletterInputPadY,
  footerNewsletterPlaceholderColor,
  footerNewsletterRadius,
  footerNewsletterTextBtnGap,
  footerNewsletterTitleToFormGap,
  footerNewsletterToCopyrightGap,
  footerPaymentIconGap,
  footerQuickLinksColW,
  footerSectionHeadingGap,
  footerTaglineToNewsletterGap,
  shopRadius,
  siteFooterShellBgDefault,
} from "../navDesignTokens";
import {
  siteFooterShellBgForPathname,
  siteFooterShellPadTopForPathname,
  siteFooterShellRadiusForPathname,
} from "../catalog/siteFooterCatalog";

const PAGE_BG = siteFooterShellBgDefault;
const FOOTER_BG = "#4b4a4a";

const LOGO_SRC = "/faq-footer/logo.svg";
const NEWSLETTER_SUBMIT_ART_SRC = "/faq-footer/newsletter-btn.svg";
const SOCIAL_ROW_SRC = "/faq-footer/social-row.svg";
const PAY_MC = "/faq-footer/pay-mastercard.svg";
const PAY_UPI = "/faq-footer/pay-upi.svg";
const PAY_RUPAY = "/faq-footer/pay-rupay.svg";
const PAY_VISA = "/faq-footer/pay-visa.svg";

const QUICK_LINKS: { label: string; to: string }[] = [
  { label: "Home", to: "/" },
  { label: "Shop by Category", to: "/category/furniture" },
  { label: "Shop by Theme", to: "/discover" },
  { label: "Limited Collection", to: "/collections/dunari" },
  { label: "Customizations", to: "/customizations" },
  { label: "Discover Corners", to: "/discover" },
  { label: "My Orders", to: "/orders" },
  { label: "Blogs", to: "/about" },
];

const INFO_LINKS: { label: string; to: string }[] = [
  { label: "Shipping Policy", to: "#" },
  { label: "Return & Cancellation Policy", to: "#" },
  { label: "Refund Policy", to: "#" },
  { label: "Privacy Policy", to: "#" },
  { label: "Terms and Conditions", to: "#" },
  { label: "FAQs", to: "#" },
];

const SUPPORT_EMAIL = "support.corners@gmial.com";
const SUPPORT_PHONE = "+91 8665654585";
const SUPPORT_PHONE_HREF = "tel:+918665654585";
const SUPPORT_ADDRESS = "Judges Bunglow Rd, I I M, Vastrapur, Ahmedabad, Gujarat 380015";

function linkSx(compact = false) {
  return {
    fontFamily: FONT_NAV,
    fontWeight: 500,
    fontSize: compact ? 12 : faqAnswerSize,
    lineHeight: 1.4,
    color: PAGE_BG,
    textDecoration: "none",
    display: "block",
    "&:hover": { textDecoration: "underline" },
  } as const;
}

const footerImgContain = {
  objectFit: "contain" as const,
  flexShrink: 0,
};

/**
 * Global site footer (Figma 990:4631 footer card). Rendered at the bottom of every page.
 */
export function SiteFooter() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const customer = useAuthStore((s) => s.customer);
  const loggedIn = useAuthStore(selectIsLoggedIn);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const address = loggedIn ? (customer?.email ?? "") : email.trim();
      if (!address) {
        setStatus("idle");
        return;
      }
      await subscribeToNewsletter(address);
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <Box
      component="footer"
      aria-label="Site footer"
      sx={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        bgcolor: siteFooterShellBgForPathname(pathname),
        borderRadius: siteFooterShellRadiusForPathname(pathname),
        px: { xs: layoutPaddingX.xs, sm: layoutPaddingX.sm, md: faqFooterPadX },
        pt: {
          xs: 3,
          sm: 4,
          md: siteFooterShellPadTopForPathname(pathname),
        },
        pb: { xs: 3, sm: 4, md: faqFooterPadY },
      }}
    >
      <Box
        sx={{
          width: "100%",
          bgcolor: FOOTER_BG,
          borderRadius: { xs: shopRadius, md: footerBandRadius },
          px: { xs: 2, sm: 2.5, md: footerBandPadX },
          py: { xs: 2.5, sm: 3, md: footerBandPadY },
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: { xs: "stretch", lg: "flex-start" },
            justifyContent: { lg: "flex-start" },
            gap: { xs: 2.5, sm: 3, md: 8, lg: footerMainColumnsGap },
            maxWidth: faqFooterInnerMaxW,
            mx: "auto",
          }}
        >
          {/* Brand + newsletter */}
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: "100%", lg: footerBrandColMaxW },
              maxWidth: { xs: "100%", lg: footerBrandColMaxW },
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, md: footerNewsletterToCopyrightGap },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, md: footerTaglineToNewsletterGap },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 0, md: footerLogoToTaglineGap },
                }}
              >
                <Box
                  component="img"
                  src={LOGO_SRC}
                  alt="Corners India"
                  sx={{
                    width: "100%",
                    maxWidth: { xs: 148, sm: 180, md: fluid1920(266.933, { min: 200, max: 280 }) },
                    height: "auto",
                    display: "block",
                    ...footerImgContain,
                    objectPosition: "left top",
                    alignSelf: { xs: "center", md: "flex-start" },
                  }}
                />
                <Typography
                  sx={{
                    display: { xs: "none", md: "block" },
                    fontFamily: FONT_NAV,
                    fontWeight: 500,
                    fontSize: faqAnswerSize,
                    lineHeight: 1.4,
                    color: PAGE_BG,
                  }}
                >
                  Our furniture is crafted using high-quality materials such as
                  solid wood, premium upholstery, durable metals, and
                  eco-friendly options.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 1, md: footerNewsletterTitleToFormGap },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 600,
                    fontSize: { xs: 14, sm: 15, md: fluid1920(22, { min: 18, max: 24 }) },
                    lineHeight: 1.2,
                    color: PAGE_BG,
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  Subscribe to newsletter
                </Typography>
                <NewsletterForm
                  status={status}
                  errorMsg={errorMsg}
                  email={email}
                  loggedIn={loggedIn}
                  customerEmail={customer?.email}
                  inputRef={inputRef}
                  onEmailChange={(value) => {
                    setEmail(value);
                    if (status === "error") setStatus("idle");
                  }}
                  onSubmit={handleNewsletterSubmit}
                />
              </Box>
            </Box>

            {/* Mobile: contact — how customers reach us */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                flexDirection: "column",
                gap: 1.25,
                pt: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 600,
                  fontSize: 11,
                  lineHeight: 1.2,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: PAGE_BG,
                  textAlign: "center",
                  opacity: 0.9,
                }}
              >
                Contact us
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                <Typography
                  component="a"
                  href={`mailto:${SUPPORT_EMAIL}`}
                  sx={{ ...linkSx(true), textAlign: "center" }}
                >
                  {SUPPORT_EMAIL}
                </Typography>
                <Typography
                  component="a"
                  href={SUPPORT_PHONE_HREF}
                  sx={{ ...linkSx(true), textAlign: "center" }}
                >
                  {SUPPORT_PHONE}
                </Typography>
                <Typography
                  sx={{
                    ...linkSx(true),
                    textAlign: "center",
                    maxWidth: 280,
                    opacity: 0.82,
                    lineHeight: 1.5,
                  }}
                >
                  {SUPPORT_ADDRESS}
                </Typography>
              </Box>

              <Box
                component="img"
                src={SOCIAL_ROW_SRC}
                alt="Follow Corners on social media"
                sx={{
                  width: 132,
                  height: "auto",
                  aspectRatio: "154.933 / 23.3333",
                  display: "block",
                  mx: "auto",
                  mt: 0.5,
                  ...footerImgContain,
                  objectPosition: "center",
                  opacity: 0.95,
                }}
              />
            </Box>
          </Box>

          {/* Desktop: full link columns */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flex: 1,
              flexDirection: "column",
              alignItems: { md: "flex-end" },
              gap: fluid1920(32),
              minWidth: 0,
              width: { lg: "auto" },
              maxWidth: { lg: footerLinksClusterMaxW },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { md: "row" },
                flexWrap: { md: "nowrap" },
                gap: footerColumnGap,
                justifyContent: { lg: "flex-end" },
                width: "100%",
                maxWidth: { lg: footerLinksRowMaxW },
                alignSelf: { lg: "flex-end" },
              }}
            >
              <Box sx={{ width: { lg: footerQuickLinksColW }, flexShrink: 0 }}>
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 600,
                    fontSize: fluid1920(14, { min: 12, max: 15 }),
                    lineHeight: 1.2,
                    color: PAGE_BG,
                    textTransform: "uppercase",
                    mb: footerSectionHeadingGap,
                  }}
                >
                  Quick Links
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: footerLinkGap,
                  }}
                >
                  {QUICK_LINKS.map((l) => (
                    <Typography
                      key={l.label}
                      component={RouterLink}
                      to={l.to}
                      sx={linkSx()}
                    >
                      {l.label}
                    </Typography>
                  ))}
                </Box>
              </Box>

              <Box sx={{ width: { lg: footerInformationColW }, flexShrink: 0 }}>
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 600,
                    fontSize: fluid1920(14, { min: 12, max: 15 }),
                    lineHeight: 1.2,
                    color: PAGE_BG,
                    textTransform: "uppercase",
                    mb: footerSectionHeadingGap,
                  }}
                >
                  Information
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: footerLinkGap,
                  }}
                >
                  {INFO_LINKS.map((l) => (
                    <Typography
                      key={l.label}
                      component="a"
                      href={l.to}
                      sx={linkSx()}
                    >
                      {l.label}
                    </Typography>
                  ))}
                </Box>
              </Box>

              <Box
                sx={{
                  width: { lg: footerContactColW },
                  maxWidth: { lg: footerContactColW },
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 600,
                    fontSize: fluid1920(14, { min: 12, max: 15 }),
                    lineHeight: 1.2,
                    color: PAGE_BG,
                    textTransform: "uppercase",
                    mb: footerSectionHeadingGap,
                  }}
                >
                  Contact us
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: footerLinkGap,
                    mb: fluid1920(31.733),
                  }}
                >
                  <Typography
                    component="a"
                    href={`mailto:${SUPPORT_EMAIL}`}
                    sx={linkSx()}
                  >
                    {SUPPORT_EMAIL}
                  </Typography>
                  <Typography
                    component="a"
                    href={SUPPORT_PHONE_HREF}
                    sx={linkSx()}
                  >
                    {SUPPORT_PHONE}
                  </Typography>
                  <Typography sx={linkSx()}>
                    Judges Bunglow Rd, I I M, Vastrapur,
                    <br />
                    Ahmedabad, Gujarat 380015
                  </Typography>
                </Box>
                <Box
                  component="img"
                  src={SOCIAL_ROW_SRC}
                  alt=""
                  sx={{
                    width: fluid1920(154.933, { min: 140, max: 180 }),
                    height: "auto",
                    aspectRatio: "154.933 / 23.3333",
                    display: "block",
                    ...footerImgContain,
                    objectPosition: "left center",
                    alignSelf: "flex-start",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "nowrap",
            width: "100%",
            maxWidth: faqFooterInnerMaxW,
            mx: "auto",
            minWidth: 0,
            mt: { xs: 2.5, sm: 3, md: fluid1920(46.667) },
            pt: { xs: 2, md: 0 },
            borderTop: { xs: "1px solid rgba(243, 237, 227, 0.12)", md: "none" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 1.25, sm: 2 },
            overflowX: { xs: "visible", sm: "auto" },
          }}
        >
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 600,
              fontSize: { xs: 10, sm: 11, md: fluid1920(14, { min: 12, max: 15 }) },
              lineHeight: 1.2,
              color: PAGE_BG,
              textTransform: "uppercase",
              flexShrink: 0,
              textAlign: { xs: "center", sm: "left" },
              opacity: { xs: 0.85, md: 1 },
            }}
          >
            <Box component="span" sx={{ display: { xs: "inline", md: "none" } }}>
              © 2025 Corners
            </Box>
            <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>
              © 2025 Corners. all rights reserved.
            </Box>
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "nowrap",
              alignItems: "center",
              justifyContent: { xs: "center", sm: "flex-end" },
              gap: { xs: 1, md: footerPaymentIconGap },
              flexShrink: 0,
              opacity: { xs: 0.9, md: 1 },
            }}
          >
            {[
              { src: PAY_MC, w: 28.933, h: 23.333, alt: "Mastercard" },
              { src: PAY_UPI, w: 67.2, h: 23.333, alt: "UPI" },
              { src: PAY_RUPAY, w: 78, h: 24, alt: "RuPay" },
              { src: PAY_VISA, w: 74.667, h: 24.267, alt: "Visa" },
            ].map((p) => (
              <Box
                key={p.src}
                component="img"
                src={p.src}
                alt={p.alt}
                sx={{
                  height: {
                    xs: fluid1920(p.h, { min: 14, max: 18 }),
                    md: fluid1920(p.h, { min: 18, max: 28 }),
                  },
                  width: "auto",
                  maxWidth: {
                    xs: fluid1920(p.w, { min: 36, max: 56 }),
                    md: fluid1920(p.w, { min: 48, max: p.w }),
                  },
                  display: "block",
                  ...footerImgContain,
                  objectPosition: "center",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function NewsletterForm({
  status,
  errorMsg,
  email,
  loggedIn,
  customerEmail,
  inputRef,
  onEmailChange,
  onSubmit,
}: {
  status: "idle" | "loading" | "success" | "error";
  errorMsg: string;
  email: string;
  loggedIn: boolean;
  customerEmail?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  if (status === "success") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          height: { xs: 44, md: footerNewsletterH },
          px: footerNewsletterInputPadX,
          bgcolor: PAGE_BG,
          borderRadius: footerNewsletterRadius,
        }}
      >
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            bgcolor: "#bc7e5a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
            <path
              d="M1 4L4 7L10 1"
              stroke="#f3ede3"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: fluid1920(13, { min: 11, max: 14 }),
            color: footerNewsletterPlaceholderColor,
          }}
        >
          You're subscribed!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 44, md: footerNewsletterH },
        borderRadius: footerNewsletterRadius,
        overflow: "hidden",
        bgcolor: PAGE_BG,
      }}
    >
      <Box
        ref={inputRef}
        component="input"
        name="email"
        type="email"
        value={loggedIn ? (customerEmail ?? "") : email}
        readOnly={loggedIn}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (loggedIn) return;
          onEmailChange(e.target.value);
        }}
        placeholder={status === "error" ? errorMsg || "Try again" : "Enter your email"}
        autoComplete="email"
        disabled={status === "loading"}
        sx={{
          position: "relative",
          zIndex: 1,
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
          border: status === "error" ? "1.5px solid #e07070" : 0,
          outline: "none",
          bgcolor: "transparent",
          pl: { xs: 1.5, md: footerNewsletterInputPadX },
          pr: `calc(${footerNewsletterBtnW} + ${footerNewsletterTextBtnGap})`,
          pt: footerNewsletterInputPadY,
          pb: footerNewsletterInputPadY,
          fontFamily: FONT_NAV,
          fontWeight: 600,
          fontSize: { xs: 12, md: fluid1920(14, { min: 12, max: 15 }) },
          lineHeight: "normal",
          color: status === "error" ? "#e07070" : footerNewsletterPlaceholderColor,
          borderRadius: footerNewsletterRadius,
          "&::placeholder": {
            color: status === "error" ? "#e07070" : footerNewsletterPlaceholderColor,
            opacity: 1,
          },
        }}
      />
      <ButtonBase
        type="submit"
        disableRipple
        aria-label="Subscribe"
        disabled={status === "loading"}
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 2,
          width: footerNewsletterBtnW,
          height: "100%",
          p: 0,
          m: 0,
          minWidth: 0,
          borderRadius: 0,
          bgcolor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          opacity: status === "loading" ? 0.6 : 1,
        }}
      >
        {status === "loading" ? (
          <Box sx={{ pr: footerNewsletterInputPadX }}>
            <CircularProgress size={16} sx={{ color: "#bc7e5a" }} />
          </Box>
        ) : (
          <Box
            component="img"
            src={NEWSLETTER_SUBMIT_ART_SRC}
            alt=""
            sx={{
              height: "100%",
              width: "auto",
              maxWidth: footerNewsletterBtnW,
              ...footerImgContain,
              objectPosition: "right center",
            }}
          />
        )}
      </ButtonBase>
    </Box>
  );
}
