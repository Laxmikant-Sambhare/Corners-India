import Button from "@mui/material/Button";
import { Link as RouterLink, useRouterState } from "@tanstack/react-router";
import { FONT_NAV } from "../fonts";
import { navFontSize } from "../navDesignTokens";

const ACCENT = "#bc7e5a";
const MUTED = "#4b4a4a";

type Props = {
  to: string;
  children: string;
};

export function NavbarTextLink({ to, children }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = pathname === to;

  return (
    <Button
      component={RouterLink}
      to={to}
      variant="text"
      sx={{
        fontFamily: FONT_NAV,
        textTransform: "uppercase",
        fontSize: { xs: "0.75rem", sm: navFontSize },
        fontWeight: 600,
        lineHeight: 1,
        minWidth: "auto",
        px: { xs: 0.75, sm: 1 },
        py: { xs: 0.5, sm: 0 },
        flexShrink: 0,
        color: active ? ACCENT : MUTED,
        "&:hover": {
          bgcolor: active
            ? "rgba(188, 126, 90, 0.08)"
            : "rgba(75, 74, 74, 0.06)",
        },
      }}
    >
      {children}
    </Button>
  );
}
