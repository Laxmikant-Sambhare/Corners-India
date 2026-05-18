import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  Link as RouterLink,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { FONT_NAV, FONT_SURGENA } from "../fonts";
import { fluid1920 } from "../navDesignTokens";
import { CDN_LIFESTYLE } from "../shopify/cdnImages";
import {
  loginCustomer,
  NeedsActivationError,
  registerCustomer,
} from "../shopify/client";
import {
  initiateOAuthLogin,
  isCustomerAccountConfigured,
} from "../shopify/customerAccountAuth";
import { useAuthStore } from "../store/authStore";

const USE_OAUTH = isCustomerAccountConfigured();

const ACCENT = "#bc7e5a";
const PAGE_BG = "#f3ede3";
const DARK = "#1a1814";
const MUTED = "#4b4a4a";
const TAN = "#ccbca6";
const BORDER = "rgba(204,188,166,0.45)";
const PANEL_BG = "#1a1814";

/* ── Shared field styles ── */
const labelSx = {
  fontFamily: FONT_NAV,
  fontWeight: 600,
  fontSize: fluid1920(11, { min: 10, max: 12 }),
  color: MUTED,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  mb: "6px",
  display: "block",
};

const inputSx = {
  width: "100%",
  bgcolor: PAGE_BG,
  border: `1.5px solid ${BORDER}`,
  borderRadius: "10px",
  px: fluid1920(18, { min: 14, max: 20 }),
  py: fluid1920(14, { min: 11, max: 16 }),
  fontFamily: FONT_NAV,
  fontWeight: 400,
  fontSize: fluid1920(14, { min: 13, max: 15 }),
  color: DARK,
  outline: "none",
  transition: "border-color 0.18s",
  boxSizing: "border-box" as const,
  "&:focus": { borderColor: ACCENT },
  "&::placeholder": { color: TAN, opacity: 1 },
};

type Mode = "login" | "register";

/* ── Left brand panel ── */
function BrandPanel() {
  return (
    <Box
      sx={{
        display: { xs: "none", lg: "flex" },
        flexDirection: "column",
        justifyContent: "space-between",
        width: "46%",
        flexShrink: 0,
        bgcolor: PANEL_BG,
        borderRadius: "24px",
        p: fluid1920(56, { min: 36, max: 64 }),
        position: "relative",
        overflow: "hidden",
        minHeight: { lg: "calc(100vh - 120px)" },
      }}
    >
      {/* Subtle texture overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 70%, rgba(188,126,90,0.18) 0%, transparent 65%), radial-gradient(ellipse at 80% 20%, rgba(204,188,166,0.10) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <Box
        component="img"
        src="/nav/logo.svg"
        alt="Corners"
        sx={{
          width: "auto",
          height: fluid1920(160, { min: 80, max: 100 }),
          filter: "brightness(0) invert(1)",
          opacity: 0.9,
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Decorative circle */}
      <Box
        sx={{
          position: "absolute",
          width: fluid1920(480, { min: 300, max: 560 }),
          height: fluid1920(480, { min: 300, max: 560 }),
          borderRadius: "50%",
          border: "1px solid rgba(204,188,166,0.12)",
          bottom: "-20%",
          right: "-20%",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: fluid1920(320, { min: 200, max: 380 }),
          height: fluid1920(320, { min: 200, max: 380 }),
          borderRadius: "50%",
          border: "1px solid rgba(204,188,166,0.08)",
          bottom: "-8%",
          right: "-8%",
          pointerEvents: "none",
        }}
      />

      {/* Quote block */}
      <Stack
        gap={fluid1920(24, { min: 16, max: 28 })}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Box
          sx={{
            width: fluid1920(40, { min: 28, max: 44 }),
            height: "2px",
            bgcolor: ACCENT,
            borderRadius: "1px",
          }}
        />
        <Typography
          sx={{
            fontFamily: FONT_SURGENA,
            fontWeight: 600,
            fontSize: fluid1920(34, { min: 24, max: 38 }),
            color: PAGE_BG,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          Every corner
          <br />
          tells a story.
        </Typography>
        <Typography
          sx={{
            fontFamily: FONT_NAV,
            fontWeight: 400,
            fontSize: fluid1920(14, { min: 13, max: 15 }),
            color: "rgba(243,237,227,0.55)",
            lineHeight: 1.7,
            maxWidth: 320,
          }}
        >
          Handcrafted furniture that brings warmth, intention, and quiet beauty
          into your home.
        </Typography>

        <Stack
          direction="row"
          gap="10px"
          alignItems="center"
          sx={{ mt: fluid1920(8) }}
        >
          {[
            CDN_LIFESTYLE["discover-product-1"],
            CDN_LIFESTYLE["discover-product-2"],
            CDN_LIFESTYLE["discover-product-4"],
          ].map((src, i) => (
            <Box
              key={src}
              component="img"
              src={src}
              alt=""
              sx={{
                width: fluid1920(56, { min: 44, max: 64 }),
                height: fluid1920(56, { min: 44, max: 64 }),
                borderRadius: "10px",
                objectFit: "cover",
                opacity: i === 0 ? 1 : i === 1 ? 0.7 : 0.45,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          ))}
          <Typography
            sx={{
              fontFamily: FONT_NAV,
              fontWeight: 500,
              fontSize: fluid1920(12, { min: 11, max: 13 }),
              color: "rgba(243,237,227,0.4)",
              ml: "4px",
            }}
          >
            +8 pieces
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

/* ════════════════════════════════════════════════════════
   Main page
════════════════════════════════════════════════════════ */
export function LoginPage() {
  const navigate = useNavigate();
  // `next` query param: where to redirect after login
  const search = useSearch({ strict: false }) as { next?: string };
  const redirectTo = (search?.next as string) || "/";

  const setAuth = useAuthStore((s) => s.setAuth);
  const [mode, setMode] = useState<Mode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activationEmail, setActivationEmail] = useState<string | null>(null);

  /* Login fields */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  /* Register-extra fields */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function switchMode(m: Mode) {
    setMode(m);
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
    }

    setIsLoading(true);
    try {
      const result =
        mode === "login"
          ? await loginCustomer(email, password)
          : await registerCustomer(firstName, lastName, email, password);

      setAuth(result.token, result.expiresAt, result.customer, result.orders);
      void navigate({ to: redirectTo });
    } catch (err) {
      if (err instanceof NeedsActivationError) {
        setActivationEmail(err.email);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  /* ── Activation needed screen ── */
  if (activationEmail) {
    return (
      <Box
        sx={{
          minHeight: { lg: "calc(100vh - 80px)" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 4, lg: 0 },
        }}
      >
        <Stack
          alignItems="center"
          gap={fluid1920(24, { min: 18, max: 28 })}
          sx={{
            maxWidth: 460,
            textAlign: "center",
            p: fluid1920(48, { min: 32, max: 56 }),
            bgcolor: "rgba(204,188,166,0.14)",
            border: `1.5px solid ${BORDER}`,
            borderRadius: "20px",
          }}
        >
          {/* Envelope icon */}
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              bgcolor: "rgba(188,126,90,0.12)",
              border: `1.5px solid rgba(188,126,90,0.25)`,
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
              sx={{ width: 34, height: 34 }}
            >
              <rect
                x="2"
                y="4"
                width="20"
                height="16"
                rx="2"
                stroke={ACCENT}
                strokeWidth="1.5"
              />
              <path
                d="M2 8l10 7 10-7"
                stroke={ACCENT}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </Box>
          </Box>

          <Stack gap="8px">
            <Typography
              sx={{
                fontFamily: FONT_SURGENA,
                fontWeight: 600,
                fontSize: fluid1920(30, { min: 22, max: 34 }),
                color: DARK,
                lineHeight: 1.1,
              }}
            >
              Check your inbox
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 400,
                fontSize: fluid1920(14, { min: 13, max: 15 }),
                color: MUTED,
                lineHeight: 1.65,
              }}
            >
              We've sent an activation email to{" "}
              <Box component="span" sx={{ color: DARK, fontWeight: 600 }}>
                {activationEmail}
              </Box>
              . Open that email, click the link, and{" "}
              <strong>set your password</strong>. Once done, come back here to
              sign in with your email and new password.
            </Typography>
          </Stack>

          <ButtonBase
            type="button"
            onClick={() => {
              setActivationEmail(null);
              setMode("login");
              setEmail(activationEmail ?? "");
              setPassword("");
            }}
            sx={{
              bgcolor: ACCENT,
              color: PAGE_BG,
              fontFamily: FONT_NAV,
              fontWeight: 700,
              fontSize: fluid1920(13, { min: 12, max: 14 }),
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              px: fluid1920(32, { min: 22, max: 36 }),
              py: fluid1920(14, { min: 11, max: 16 }),
              borderRadius: "12px",
              "&:hover": { opacity: 0.9 },
            }}
          >
            Go to Sign In
          </ButtonBase>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: { lg: "calc(100vh - 80px)" },
        display: "flex",
        alignItems: { lg: "center" },
        py: { xs: 2, lg: 0 },
      }}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        gap={fluid1920(40, { min: 28, max: 48 })}
        sx={{ width: "100%", alignItems: { lg: "stretch" } }}
      >
        {/* ── Left brand panel ── */}
        <BrandPanel />

        {/* ── Right form col ── */}
        <Stack
          sx={{
            flex: 1,
            minWidth: 0,
            justifyContent: "center",
            px: { xs: 0, lg: fluid1920(24, { min: 0, max: 32 }) },
            maxWidth: { lg: 480 },
          }}
        >
          {/* Mobile logo */}
          <Box
            component="img"
            src="/nav/logo.svg"
            alt="Corners"
            sx={{
              display: { xs: "block", lg: "none" },
              width: 120,
              height: "auto",
              mb: fluid1920(32, { min: 24, max: 40 }),
            }}
          />

          {/* Header */}
          <Stack gap="6px" sx={{ mb: fluid1920(36, { min: 24, max: 40 }) }}>
            <Typography
              component="h1"
              sx={{
                fontFamily: FONT_SURGENA,
                fontWeight: 600,
                fontSize: fluid1920(42, { min: 28, max: 48 }),
                color: DARK,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              {USE_OAUTH ? "Welcome." : mode === "login" ? "Welcome back." : "Create account."}
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_NAV,
                fontWeight: 400,
                fontSize: fluid1920(14, { min: 13, max: 15 }),
                color: MUTED,
              }}
            >
              {USE_OAUTH
                ? "Sign in or create an account to track your orders and check out faster."
                : mode === "login"
                  ? "Sign in to track your orders and check out faster."
                  : "Join Corners to save your details and track your orders."}
            </Typography>
          </Stack>

          {/* ── OAuth panel (New Customer Accounts) ── */}
          {USE_OAUTH && (
            <Stack gap={fluid1920(16, { min: 12, max: 18 })}>
              <ButtonBase
                type="button"
                onClick={() => void initiateOAuthLogin(redirectTo)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  width: "100%",
                  bgcolor: DARK,
                  color: PAGE_BG,
                  py: fluid1920(15, { min: 12, max: 17 }),
                  borderRadius: "12px",
                  fontFamily: FONT_NAV,
                  fontWeight: 700,
                  fontSize: fluid1920(13, { min: 12, max: 14 }),
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  "&:hover": { opacity: 0.85 },
                  transition: "opacity 0.15s",
                }}
              >
                {/* Shopify bag icon */}
                <Box
                  component="svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  sx={{ width: 18, height: 18, flexShrink: 0 }}
                >
                  <path
                    d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 6h18M16 10a4 4 0 01-8 0"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </Box>
                Continue with Shopify
              </ButtonBase>

              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 400,
                  fontSize: fluid1920(12, { min: 11, max: 13 }),
                  color: TAN,
                  textAlign: "center",
                  lineHeight: 1.55,
                }}
              >
                You'll be taken to Shopify's secure login page, then brought back here.
              </Typography>

              <Stack direction="row" alignItems="center" gap="12px">
                <Box sx={{ flex: 1, height: "1px", bgcolor: BORDER }} />
                <Typography
                  sx={{ fontFamily: FONT_NAV, fontWeight: 400, fontSize: "12px", color: TAN }}
                >
                  or
                </Typography>
                <Box sx={{ flex: 1, height: "1px", bgcolor: BORDER }} />
              </Stack>

              <ButtonBase
                component={RouterLink}
                to="/"
                sx={{
                  width: "100%",
                  py: fluid1920(14, { min: 11, max: 16 }),
                  borderRadius: "12px",
                  border: `1.5px solid ${BORDER}`,
                  fontFamily: FONT_NAV,
                  fontWeight: 600,
                  fontSize: fluid1920(13, { min: 12, max: 14 }),
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: MUTED,
                  bgcolor: "transparent",
                  "&:hover": { borderColor: ACCENT, color: ACCENT },
                  transition: "all 0.15s",
                }}
              >
                Continue as Guest
              </ButtonBase>

              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 400,
                  fontSize: fluid1920(12, { min: 11, max: 13 }),
                  color: TAN,
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                By signing in you agree to our{" "}
                <Box
                  component="a"
                  href="#"
                  sx={{
                    color: ACCENT,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Terms & Privacy Policy
                </Box>
                .
              </Typography>
            </Stack>
          )}

          {/* ── Classic email/password form (shown only when OAuth is NOT configured) ── */}
          {!USE_OAUTH && (
            <>
          {/* Mode tabs */}
          <Stack
            direction="row"
            gap="0"
            sx={{
              mb: fluid1920(32, { min: 22, max: 36 }),
              bgcolor: "rgba(204,188,166,0.18)",
              borderRadius: "12px",
              p: "4px",
              border: `1px solid ${BORDER}`,
            }}
          >
            {(["login", "register"] as Mode[]).map((m) => (
              <ButtonBase
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                sx={{
                  flex: 1,
                  py: "10px",
                  borderRadius: "9px",
                  fontFamily: FONT_NAV,
                  fontWeight: 600,
                  fontSize: fluid1920(13, { min: 12, max: 14 }),
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  transition: "all 0.18s",
                  bgcolor: mode === m ? PAGE_BG : "transparent",
                  color: mode === m ? DARK : TAN,
                  boxShadow:
                    mode === m ? "0 1px 4px rgba(26,24,20,0.08)" : "none",
                }}
              >
                {m === "login" ? "Sign In" : "Register"}
              </ButtonBase>
            ))}
          </Stack>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack gap={fluid1920(18, { min: 14, max: 20 })}>
              {mode === "register" && (
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  gap={fluid1920(14, { min: 10, max: 16 })}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      component="label"
                      htmlFor="firstName"
                      sx={labelSx}
                    >
                      First Name
                    </Typography>
                    <Box
                      component="input"
                      id="firstName"
                      type="text"
                      placeholder="Arjun"
                      value={firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFirstName(e.target.value)
                      }
                      required
                      autoComplete="given-name"
                      sx={inputSx}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      component="label"
                      htmlFor="lastName"
                      sx={labelSx}
                    >
                      Last Name
                    </Typography>
                    <Box
                      component="input"
                      id="lastName"
                      type="text"
                      placeholder="Sharma"
                      value={lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLastName(e.target.value)
                      }
                      required
                      autoComplete="family-name"
                      sx={inputSx}
                    />
                  </Box>
                </Stack>
              )}

              <Box>
                <Typography component="label" htmlFor="email" sx={labelSx}>
                  Email Address
                </Typography>
                <Box
                  component="input"
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                  autoComplete="email"
                  sx={inputSx}
                />
              </Box>

              <Box>
                <Typography component="label" htmlFor="password" sx={labelSx}>
                  Password
                </Typography>
                <Box
                  component="input"
                  id="password"
                  type="password"
                  placeholder={
                    mode === "register" ? "Min. 8 characters" : "Your password"
                  }
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  sx={inputSx}
                />
              </Box>

              {mode === "register" && (
                <Box>
                  <Typography
                    component="label"
                    htmlFor="confirmPassword"
                    sx={labelSx}
                  >
                    Confirm Password
                  </Typography>
                  <Box
                    component="input"
                    id="confirmPassword"
                    type="password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setConfirmPassword(e.target.value)
                    }
                    required
                    autoComplete="new-password"
                    sx={inputSx}
                  />
                </Box>
              )}

              {/* Error */}
              {error && (
                <Box
                  sx={{
                    bgcolor: "rgba(192,57,43,0.06)",
                    border: "1px solid rgba(192,57,43,0.18)",
                    borderRadius: "10px",
                    px: "14px",
                    py: "11px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONT_NAV,
                      fontWeight: 500,
                      fontSize: fluid1920(13, { min: 12, max: 14 }),
                      color: "#c0392b",
                      lineHeight: 1.5,
                    }}
                  >
                    {error}
                  </Typography>
                </Box>
              )}

              {/* Submit */}
              <ButtonBase
                type="submit"
                disabled={isLoading}
                sx={{
                  mt: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  bgcolor: ACCENT,
                  color: PAGE_BG,
                  py: fluid1920(15, { min: 12, max: 17 }),
                  borderRadius: "12px",
                  fontFamily: FONT_NAV,
                  fontWeight: 700,
                  fontSize: fluid1920(13, { min: 12, max: 14 }),
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  opacity: isLoading ? 0.7 : 1,
                  "&:hover": { opacity: isLoading ? 0.7 : 0.92 },
                  transition: "opacity 0.15s",
                }}
              >
                {isLoading && (
                  <CircularProgress size={14} sx={{ color: PAGE_BG }} />
                )}
                {isLoading
                  ? mode === "login"
                    ? "Signing in…"
                    : "Creating account…"
                  : mode === "login"
                    ? "Sign In"
                    : "Create Account"}
              </ButtonBase>

              {/* Divider + back to home */}
              <Stack direction="row" alignItems="center" gap="12px">
                <Box sx={{ flex: 1, height: "1px", bgcolor: BORDER }} />
                <Typography
                  sx={{
                    fontFamily: FONT_NAV,
                    fontWeight: 400,
                    fontSize: fluid1920(12, { min: 11, max: 13 }),
                    color: TAN,
                  }}
                >
                  or
                </Typography>
                <Box sx={{ flex: 1, height: "1px", bgcolor: BORDER }} />
              </Stack>

              <ButtonBase
                component={RouterLink}
                to="/"
                sx={{
                  width: "100%",
                  py: fluid1920(14, { min: 11, max: 16 }),
                  borderRadius: "12px",
                  border: `1.5px solid ${BORDER}`,
                  fontFamily: FONT_NAV,
                  fontWeight: 600,
                  fontSize: fluid1920(13, { min: 12, max: 14 }),
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: MUTED,
                  bgcolor: "transparent",
                  "&:hover": { borderColor: ACCENT, color: ACCENT },
                  transition: "all 0.15s",
                }}
              >
                Continue as Guest
              </ButtonBase>

              <Typography
                sx={{
                  fontFamily: FONT_NAV,
                  fontWeight: 400,
                  fontSize: fluid1920(12, { min: 11, max: 13 }),
                  color: TAN,
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                By signing in you agree to our{" "}
                <Box
                  component="a"
                  href="#"
                  sx={{
                    color: ACCENT,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Terms & Privacy Policy
                </Box>
                .
              </Typography>
            </Stack>
          </Box>
          </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
