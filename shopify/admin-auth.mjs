/**
 * Admin API auth — supports direct token or Dev Dashboard client credentials.
 */

let cachedToken = null;
let tokenExpiresAt = 0;

export function loadEnvFromDotenv(readFileSync, join, __dirname) {
  try {
    const raw = readFileSync(join(__dirname, "..", ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
      }
    }
  } catch {
    /* optional */
  }
}

export function getStoreDomain() {
  return (
    process.env.SHOPIFY_STORE_DOMAIN ?? process.env.VITE_SHOPIFY_STORE_DOMAIN
  );
}

async function fetchClientCredentialsToken(domain, clientId, clientSecret) {
  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      json.error_description ??
      json.error ??
      `HTTP ${res.status}`;
    throw new Error(
      `Could not get Admin API token: ${msg}. Is Corners Import installed on this store?`,
    );
  }
  return json;
}

/** Returns a valid Admin API access token (cached ~24h for client credentials). */
export async function getAdminAccessToken() {
  const direct = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();
  if (direct) return direct;

  const domain = getStoreDomain();
  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID?.trim();
  const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET?.trim();

  if (!domain || !clientId || !clientSecret) {
    throw new Error(
      "Set SHOPIFY_ADMIN_ACCESS_TOKEN, or SHOPIFY_ADMIN_CLIENT_ID + SHOPIFY_ADMIN_CLIENT_SECRET + VITE_SHOPIFY_STORE_DOMAIN in .env",
    );
  }

  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const { access_token, expires_in } = await fetchClientCredentialsToken(
    domain,
    clientId,
    clientSecret,
  );
  cachedToken = access_token;
  tokenExpiresAt = Date.now() + (expires_in ?? 86_400) * 1000;
  return access_token;
}

export async function adminGraphql(query, variables = {}) {
  const domain = getStoreDomain();
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${domain}/admin/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  const errors = json.errors;
  if (errors) {
    const list = Array.isArray(errors) ? errors : [errors];
    throw new Error(list.map((e) => e.message ?? String(e)).join("; "));
  }
  if (!json.data) {
    throw new Error(`Admin API returned no data (HTTP ${res.status})`);
  }
  return json.data;
}
