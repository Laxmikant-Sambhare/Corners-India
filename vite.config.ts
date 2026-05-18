import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  build: {
    // Raise chunk-size warning threshold — MUI + framer-motion are legitimately large
    chunkSizeWarningLimit: 800,
  },

  ...(mode === "development" && {
    server: {
      port: 5173,
      // Add your ngrok hostname here when testing OAuth callbacks locally
      allowedHosts: ["campfire-hardwood-dyslexia.ngrok-free.dev"],
    },
  }),
}));
