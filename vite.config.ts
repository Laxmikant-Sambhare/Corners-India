import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage } from "node:http";

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

/** Dev-only proxies matching Netlify function paths. */
function shopifyDevProxies(domain: string, env: Record<string, string>): Plugin {
  return {
    name: "shopify-dev-proxies",
    configureServer(server) {
      server.middlewares.use("/api/customer-graphql", async (req, res, next) => {
        if (req.method !== "POST") {
          next();
          return;
        }

        try {
          const auth = req.headers.authorization ?? "";
          const body = await readRequestBody(req);

          const discoveryRes = await fetch(
            `https://${domain}/.well-known/customer-account-api`,
          );
          if (!discoveryRes.ok) {
            throw new Error(`Discovery failed (${discoveryRes.status})`);
          }
          const discovery = (await discoveryRes.json()) as {
            graphql_api?: string;
          };
          if (!discovery.graphql_api) {
            throw new Error("graphql_api missing from discovery response.");
          }

          const upstream = await fetch(discovery.graphql_api, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: auth,
            },
            body,
          });

          const text = await upstream.text();
          res.statusCode = upstream.status;
          res.setHeader("Content-Type", "application/json");
          res.end(text);
        } catch (err) {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              errors: [
                {
                  message:
                    err instanceof Error
                      ? err.message
                      : "Customer API proxy failed.",
                },
              ],
            }),
          );
        }
      });

      server.middlewares.use("/api/newsletter-subscribe", async (req, res, next) => {
        if (req.method !== "POST") {
          next();
          return;
        }

        try {
          for (const [key, value] of Object.entries(env)) {
            if (value && !process.env[key]) process.env[key] = value;
          }

          const body = await readRequestBody(req);
          const { email } = JSON.parse(body || "{}") as { email?: string };
          const { subscribeEmailToMarketing } = await import(
            // @ts-expect-error dev-only dynamic import of server .mjs module
            "./shopify/newsletter-subscribe.mjs"
          );
          await subscribeEmailToMarketing(email);

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true }));
        } catch (err) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error:
                err instanceof Error
                  ? err.message
                  : "Newsletter subscribe failed.",
            }),
          );
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const shopDomain = env.VITE_SHOPIFY_STORE_DOMAIN ?? "";

  return {
    plugins: [
      react(),
      ...(mode === "development" && shopDomain
        ? [shopifyDevProxies(shopDomain, env)]
        : []),
    ],

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
  };
});
