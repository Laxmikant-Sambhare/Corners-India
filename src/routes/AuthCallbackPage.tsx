import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import { fluid1920 } from "../navDesignTokens";
import { handleOAuthCallback } from "../shopify/customerAccountAuth";
import { useAuthStore } from "../store/authStore";

const ACCENT = "#bc7e5a";
const DARK = "#1a1814";
const MUTED = "#4b4a4a";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const errorParam = params.get("error");
    const errorDesc = params.get("error_description");

    if (errorParam) {
      setError(errorDesc ?? errorParam);
      return;
    }

    if (!code || !state) {
      setError("Missing OAuth parameters. Please try signing in again.");
      return;
    }

    handleOAuthCallback(code, state)
      .then(({ customer, orders, accessToken, expiresAt, redirectTo }) => {
        setAuth(accessToken, expiresAt, customer, orders);
        void navigate({ to: redirectTo as "/" });
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Authentication failed. Please try again.",
        );
      });
  }, [navigate, setAuth]);

  if (error) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        gap={fluid1920(20, { min: 16, max: 24 })}
        sx={{ py: fluid1920(80, { min: 56, max: 96 }), textAlign: "center" }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: "rgba(192,57,43,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            sx={{ width: 28, height: 28 }}
          >
            <circle cx="12" cy="12" r="9" stroke="#c0392b" strokeWidth="1.5" />
            <path
              d="M12 7v5M12 16h.01"
              stroke="#c0392b"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </Box>
        </Box>
        <Stack gap="6px" alignItems="center">
          <Typography
            sx={{
              fontFamily: FONT_SURGENA,
              fontWeight: 600,
              fontSize: fluid1920(26, { min: 20, max: 30 }),
              color: DARK,
            }}
          >
            Sign-in failed
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 400,
              fontSize: fluid1920(14, { min: 13, max: 15 }),
              color: MUTED,
              maxWidth: 380,
              lineHeight: 1.6,
            }}
          >
            {error}
          </Typography>
        </Stack>
        <Box
          component="button"
          type="button"
          onClick={() => void navigate({ to: "/login" })}
          sx={{
            bgcolor: ACCENT,
            color: "#f3ede3",
            border: "none",
            cursor: "pointer",
            fontFamily: FONT_NAV,
            fontWeight: 700,
            fontSize: fluid1920(13, { min: 12, max: 14 }),
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            px: fluid1920(28, { min: 20, max: 32 }),
            py: fluid1920(13, { min: 10, max: 15 }),
            borderRadius: "10px",
            "&:hover": { opacity: 0.9 },
          }}
        >
          Try again
        </Box>
      </Stack>
    );
  }

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      gap="16px"
      sx={{ py: fluid1920(100, { min: 72, max: 120 }) }}
    >
      <CircularProgress sx={{ color: ACCENT }} size={36} thickness={3} />
      <Typography
        sx={{
          fontFamily: FONT_NAV,
          fontWeight: 500,
          fontSize: fluid1920(14, { min: 13, max: 15 }),
          color: MUTED,
          letterSpacing: "0.02em",
        }}
      >
        Signing you in…
      </Typography>
    </Stack>
  );
}
