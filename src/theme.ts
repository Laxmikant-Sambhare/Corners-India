import { createTheme } from "@mui/material/styles";
import { modalBackdropTint } from "./navDesignTokens";

export const theme = createTheme({
  components: {
    MuiModal: {
      defaultProps: {
        slotProps: {
          backdrop: {
            sx: {
              backgroundColor: modalBackdropTint,
            },
          },
        },
      },
    },
  },
  palette: {
    background: {
      default: "#F3EDE3",
      paper: "#ffffff",
    },
    primary: {
      main: "#7c3aed",
    },
    secondary: {
      main: "#0ea5e9",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
