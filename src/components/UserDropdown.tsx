import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import {
  fluid1920,
  megaRadius,
  navFontSize,
  navIconSize,
  navMegaMenuMarginTop,
} from "../navDesignTokens";
import { logoutCustomer } from "../shopify/client";
import {
  isCustomerAccountConfigured,
  revokeCustomerToken,
} from "../shopify/customerAccountAuth";
import { useAuthStore } from "../store/authStore";

const PAGE_BG = "#f3ede3";
const ACCENT = "#bc7e5a";
const TAN = "#ccbca6";
const MUTED = "#4b4a4a";
const DARK = "#1a1814";
const BORDER = "rgba(204,188,166,0.45)";

const padX = fluid1920(28, { min: 18, max: 32 });
const padY = fluid1920(24, { min: 16, max: 28 });
const easeOut = [0.32, 0.72, 0, 1] as const;

function buildUserDropdownVariants(reduceMotion: boolean | null) {
  const none = reduceMotion === true;
  return {
    hidden: { opacity: 0, y: none ? 0 : -18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: none
        ? { duration: 0 }
        : {
            y: { type: "spring" as const, stiffness: 420, damping: 34 },
            opacity: { duration: 0.22 },
          },
    },
    exit: {
      opacity: 0,
      y: none ? 0 : -10,
      transition: none ? { duration: 0 } : { duration: 0.18, ease: easeOut },
    },
  };
}

/* ── Avatar trigger button ─────────────────────────────────────────────────── */

type TriggerProps = {
  size?: "medium" | "small";
  open: boolean;
  onToggle: () => void;
};

export function UserAvatarButton({ size = "medium", open, onToggle }: TriggerProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const loggedIn = isLoggedIn();
  const avatarSize = size === "medium" ? 34 : 28;

  /* Not logged in — plain icon → /login */
  if (!loggedIn) {
    return (
      <IconButton
        component={RouterLink}
        to="/login"
        type="button"
        aria-label="Sign in"
        size={size}
        sx={{
          ...(size === "medium" ? { minWidth: 44, minHeight: 44, p: 1 } : { p: 0.75 }),
          color: "#4b4a4a",
          "& img": { display: "block", height: size === "medium" ? 20 : navIconSize, width: "auto" },
        }}
      >
        <Box component="img" src="/nav/user.svg" alt="" aria-hidden />
      </IconButton>
    );
  }

  /* Logged in — avatar button */
  return (
    <IconButton
      type="button"
      aria-label="Account menu"
      aria-expanded={open}
      size={size}
      onClick={onToggle}
      sx={{
        ...(size === "medium" ? { minWidth: 44, minHeight: 44, p: "5px" } : { p: "4px" }),
      }}
    >
      <Box
        sx={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: "50%",
          background: open
            ? `radial-gradient(circle at 35% 35%, #c98a62, #a06844)`
            : `radial-gradient(circle at 35% 35%, #d4916a, ${ACCENT})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.18s",
          boxShadow: open
            ? `0 0 0 2px ${ACCENT}, 0 2px 8px rgba(188,126,90,0.35)`
            : `0 0 0 1.5px rgba(188,126,90,0.25)`,
        }}
      >
        <Box
          component="img"
          src="/nav/user.svg"
          alt=""
          aria-hidden
          sx={{
            width: avatarSize * 0.58,
            height: avatarSize * 0.58,
            filter: "brightness(0) invert(1)",
            opacity: 0.95,
            display: "block",
          }}
        />
      </Box>
    </IconButton>
  );
}

/* ── Dropdown panel (rendered at AppNavbar level, like CartDropdown) ────────── */

type PanelProps = { onClose: () => void };

export function UserDropdownPanel({ onClose }: PanelProps) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const variants = buildUserDropdownVariants(reduceMotion);

  const customer = useAuthStore((s) => s.customer);
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);

  const displayName = customer
    ? `${customer.firstName} ${customer.lastName}`.trim()
    : "Account";

  async function handleLogout() {
    onClose();
    if (accessToken) {
      if (isCustomerAccountConfigured()) {
        await revokeCustomerToken(accessToken);
      } else {
        await logoutCustomer(accessToken);
      }
    }
    logout();
    void navigate({ to: "/" });
  }

  return (
    <Box
      component={motion.div}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      sx={{
        position: "absolute",
        right: 0,
        top: "100%",
        mt: navMegaMenuMarginTop,
        width: fluid1920(300, { min: 240, max: 320 }),
        maxWidth: "calc(100vw - 32px)",
        bgcolor: PAGE_BG,
        borderRadius: megaRadius,
        boxShadow: "0 24px 56px rgba(0,0,0,0.1)",
        zIndex: 20,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        gap="12px"
        sx={{ px: padX, pt: padY, pb: fluid1920(16, { min: 12, max: 18 }) }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, #d4916a, ${ACCENT})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src="/nav/user.svg"
            alt=""
            aria-hidden
            sx={{ width: 20, height: 20, filter: "brightness(0) invert(1)", opacity: 0.95, display: "block" }}
          />
        </Box>
        <Stack gap="1px" sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: FONT_SURGENA,
              fontWeight: 600,
              fontSize: fluid1920(16, { min: 14, max: 17 }),
              color: DARK,
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayName}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 400,
              fontSize: navFontSize,
              color: TAN,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {customer?.email}
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ borderColor: BORDER, mx: padX }} />

      {/* Nav links */}
      <Stack sx={{ px: "8px", py: "8px" }}>
        {[
          {
            label: "My Orders",
            to: "/orders",
            icon: (
              <Box component="svg" viewBox="0 0 20 20" fill="none" aria-hidden sx={{ width: 16, height: 16 }}>
                <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
                <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </Box>
            ),
          },
          {
            label: "Track Delivery",
            to: "/orders",
            icon: (
              <Box component="svg" viewBox="0 0 20 20" fill="none" aria-hidden sx={{ width: 16, height: 16 }}>
                <path d="M3 7h10v9H3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M13 9l4 2v5h-4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <circle cx="6" cy="17" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="15" cy="17" r="1.5" stroke="currentColor" strokeWidth="1.2" />
              </Box>
            ),
          },
        ].map(({ label, to, icon }) => (
          <ButtonBase
            key={label}
            component={RouterLink}
            to={to}
            onClick={onClose}
            sx={{
              px: fluid1920(16, { min: 12, max: 18 }),
              py: "10px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "flex-start",
              width: "100%",
              fontFamily: FONT_NAV,
              fontWeight: 500,
              fontSize: navFontSize,
              color: MUTED,
              "&:hover": { bgcolor: "rgba(204,188,166,0.22)", color: DARK },
              transition: "background 0.12s",
            }}
          >
            <Box sx={{ color: ACCENT, flexShrink: 0 }}>{icon}</Box>
            {label}
          </ButtonBase>
        ))}
      </Stack>

      <Divider sx={{ borderColor: BORDER, mx: padX }} />

      {/* Sign out */}
      <Stack sx={{ px: padX, py: fluid1920(16, { min: 12, max: 18 }) }}>
        <ButtonBase
          type="button"
          onClick={handleLogout}
          sx={{
            width: "100%",
            py: "11px",
            borderRadius: "10px",
            border: `1.5px solid rgba(192,57,43,0.18)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontFamily: FONT_NAV,
            fontWeight: 600,
            fontSize: navFontSize,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: "rgba(192,57,43,0.75)",
            "&:hover": { bgcolor: "rgba(192,57,43,0.06)", borderColor: "#c0392b", color: "#c0392b" },
            transition: "all 0.14s",
          }}
        >
          <Box component="svg" viewBox="0 0 20 20" fill="none" aria-hidden sx={{ width: 15, height: 15, flexShrink: 0 }}>
            <path d="M7 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3M13 14l4-4-4-4M17 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </Box>
          Sign Out
        </ButtonBase>
      </Stack>
    </Box>
  );
}

/* ── Legacy default export kept for any existing imports ─────────────────── */
export { UserAvatarButton as UserDropdown };
