/**
 * Shopify Customer Account API — OAuth 2.0 PKCE flow
 *
 * Required env vars:
 *   VITE_SHOPIFY_SHOP_ID                       – numeric shop ID from Admin → Settings → General
 *   VITE_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID    – from Headless sales channel
 *
 * In Shopify Admin → Sales Channels → Headless → Customer Account API:
 *   Add callback URL: http://localhost:5173/auth/callback (dev)
 *                     https://your-domain.com/auth/callback (prod)
 */

import type { CustomerInfo, CustomerOrder } from "../store/authStore";

const SHOP_ID = import.meta.env.VITE_SHOPIFY_SHOP_ID ?? "";
const CLIENT_ID = import.meta.env.VITE_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID ?? "";

/**
 * In dev, Vite proxies `/api/customer-graphql` to Shopify (see vite.config.ts).
 * In production, call the Netlify function directly — the `/api/*` redirect can lose
 * to the SPA catch-all without `force = true`.
 */
const CUSTOMER_API_URL = import.meta.env.DEV
  ? "/api/customer-graphql"
  : "/.netlify/functions/customer-graphql";

const CUSTOMER_ACCOUNT_SCOPE = "openid email customer-account-api:full";

/** Customer Account API tokens are prefixed with `shcat_`. */
export function isCustomerAccountAccessToken(token: string): boolean {
  return token.startsWith("shcat_");
}

/** Shopify expects the raw token in Authorization — not `Bearer …`. */
function customerAccountAuthorization(token: string): string {
  return token.startsWith("Bearer ") ? token.slice(7) : token;
}

export function isCustomerAccountConfigured(): boolean {
  return Boolean(SHOP_ID && CLIENT_ID);
}

// ── PKCE helpers ─────────────────────────────────────────────────────────────

function generateCodeVerifier(length = 64): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("");
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoded = new TextEncoder().encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Build the Shopify OAuth URL and redirect the browser. */
export async function initiateOAuthLogin(redirectAfter = "/"): Promise<void> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = crypto.randomUUID();

  sessionStorage.setItem("corners_pkce_verifier", codeVerifier);
  sessionStorage.setItem("corners_oauth_state", state);
  sessionStorage.setItem("corners_oauth_redirect", redirectAfter);

  const redirectUri = `${window.location.origin}/auth/callback`;

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: CUSTOMER_ACCOUNT_SCOPE,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  window.location.href = `https://shopify.com/authentication/${SHOP_ID}/oauth/authorize?${params}`;
}

/** Exchange the OAuth callback code for tokens + customer data. */
export async function handleOAuthCallback(
  code: string,
  state: string,
): Promise<{
  customer: CustomerInfo;
  orders: CustomerOrder[];
  accessToken: string;
  expiresAt: string;
  redirectTo: string;
}> {
  const storedState = sessionStorage.getItem("corners_oauth_state");
  const codeVerifier = sessionStorage.getItem("corners_pkce_verifier");
  const redirectTo = sessionStorage.getItem("corners_oauth_redirect") ?? "/";

  sessionStorage.removeItem("corners_pkce_verifier");
  sessionStorage.removeItem("corners_oauth_state");
  sessionStorage.removeItem("corners_oauth_redirect");

  if (!codeVerifier)
    throw new Error("PKCE verifier missing. Please try again.");
  if (state !== storedState)
    throw new Error("Invalid OAuth state. Please sign in again.");

  const redirectUri = `${window.location.origin}/auth/callback`;

  const tokenRes = await fetch(
    `https://shopify.com/authentication/${SHOP_ID}/oauth/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    },
  );

  if (!tokenRes.ok) {
    const text = await tokenRes.text().catch(() => "");
    throw new Error(`Token exchange failed: ${text || tokenRes.status}`);
  }

  const tokens = (await tokenRes.json()) as {
    access_token: string;
    expires_in: number;
    id_token?: string;
    refresh_token?: string;
  };

  const { access_token, expires_in, id_token } = tokens;
  const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

  const { customer, orders } = await fetchCustomerProfile(
    access_token,
    id_token,
  );

  return { customer, orders, accessToken: access_token, expiresAt, redirectTo };
}

/** Parse basic customer info from the JWT id_token (no extra API call needed). */
function parseIdToken(idToken: string): Partial<CustomerInfo> {
  try {
    const payload = idToken.split(".")[1];
    if (!payload) return {};
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as Record<string, unknown>;
    return {
      id: (decoded.sub as string) ?? "",
      email: (decoded.email as string) ?? "",
      firstName:
        (decoded.given_name as string) ??
        (decoded.name as string)?.split(" ")[0] ??
        "",
      lastName:
        (decoded.family_name as string) ??
        (decoded.name as string)?.split(" ").slice(1).join(" ") ??
        "",
    };
  } catch {
    return {};
  }
}

/** Fetch the logged-in customer's profile + recent orders via Customer Account API. */
export async function fetchCustomerProfile(
  accessToken: string,
  idToken?: string,
): Promise<{
  customer: CustomerInfo;
  orders: CustomerOrder[];
}> {
  // Try to extract basic profile from id_token JWT first (no extra round-trip)
  const fromToken = idToken ? parseIdToken(idToken) : {};

  // Attempt Customer Account GraphQL for full profile + orders
  try {
    const query = `
      query {
        customer {
          id
          firstName
          lastName
          emailAddress { emailAddress }
          orders(first: 5, sortKey: PROCESSED_AT, reverse: true) {
            nodes {
              id
              number
              processedAt
              statusPageUrl
              totalPrice { amount currencyCode }
              fulfillments(first: 1) { nodes { status } }
            }
          }
        }
      }
    `;

    const res = await fetch(CUSTOMER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: customerAccountAuthorization(accessToken),
      },
      body: JSON.stringify({ query }),
    });

    const json = (await res.json()) as {
      data?: {
        customer?: {
          id: string;
          firstName: string;
          lastName: string;
          emailAddress?: { emailAddress: string };
          orders: {
            nodes: Array<{
              id: string;
              number: number;
              processedAt: string;
              statusPageUrl: string;
              totalPrice: { amount: string; currencyCode: string };
              fulfillments: { nodes: Array<{ status: string }> };
            }>;
          };
        };
      };
    };

    const c = json?.data?.customer;
    if (c) {
      return {
        customer: {
          id: c.id,
          email: c.emailAddress?.emailAddress ?? fromToken.email ?? "",
          firstName: c.firstName ?? fromToken.firstName ?? "",
          lastName: c.lastName ?? fromToken.lastName ?? "",
        },
        orders: c.orders.nodes.map((o) => ({
          id: o.id,
          orderNumber: o.number,
          processedAt: o.processedAt,
          statusUrl: o.statusPageUrl,
          fulfillmentStatus: o.fulfillments.nodes[0]?.status ?? "UNFULFILLED",
          totalPrice: o.totalPrice,
        })),
      };
    }
  } catch {
    // Fall through to id_token data
  }

  // Fallback: use whatever we got from the id_token
  if (!fromToken.id && !fromToken.email) {
    throw new Error("Could not fetch customer profile.");
  }
  return {
    customer: {
      id: fromToken.id ?? "",
      email: fromToken.email ?? "",
      firstName: fromToken.firstName ?? "",
      lastName: fromToken.lastName ?? "",
    },
    orders: [],
  };
}

// ── Detailed order types ──────────────────────────────────────────────────────

export type TrackingInfo = {
  number: string | null;
  url: string | null;
  company: string | null;
};

export type OrderFulfillment = {
  status: string;
  tracking: TrackingInfo[];
};

export type OrderLineItem = {
  id: string;
  title: string;
  quantity: number;
  imageUrl: string | null;
  imageAlt: string | null;
  price: { amount: string; currencyCode: string };
  variantTitle: string | null;
};

export type OrderDetail = {
  id: string;
  orderNumber: number;
  processedAt: string;
  cancelledAt: string | null;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: { amount: string; currencyCode: string };
  subtotalPrice: { amount: string; currencyCode: string } | null;
  totalShippingPrice: { amount: string; currencyCode: string } | null;
  totalTaxPrice: { amount: string; currencyCode: string } | null;
  fulfillments: OrderFulfillment[];
  lineItems: OrderLineItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string | null;
    city: string;
    province: string | null;
    country: string;
    zip: string;
  } | null;
};

/** Fetch full order list with tracking + line items via Customer Account API. */
export async function fetchCustomerOrders(
  accessToken: string,
  first = 10,
): Promise<OrderDetail[]> {
  const query = `
    query CustomerOrders($first: Int!) {
      customer {
        orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
          nodes {
            id
            number
            processedAt
            cancelledAt
            financialStatus
            fulfillmentStatus
            totalPrice { amount currencyCode }
            subtotal { amount currencyCode }
            totalShipping { amount currencyCode }
            totalTax { amount currencyCode }
            shippingAddress {
              firstName lastName
              address1 address2
              city province country zip
            }
            lineItems(first: 20) {
              nodes {
                id
                title
                quantity
                variantTitle
                price { amount currencyCode }
                image { url altText }
              }
            }
            fulfillments(first: 5) {
              nodes {
                status
                trackingInformation {
                  number
                  url
                  company
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch(CUSTOMER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: customerAccountAuthorization(accessToken),
    },
    body: JSON.stringify({ query, variables: { first } }),
  });

  const json = (await res.json()) as {
    data?: {
      customer?: {
        orders: {
          nodes: Array<{
            id: string;
            number: number;
            processedAt: string;
            cancelledAt: string | null;
            financialStatus: string;
            fulfillmentStatus: string;
            totalPrice: { amount: string; currencyCode: string };
            subtotal: { amount: string; currencyCode: string } | null;
            totalShipping: { amount: string; currencyCode: string } | null;
            totalTax: { amount: string; currencyCode: string } | null;
            shippingAddress: {
              firstName: string;
              lastName: string;
              address1: string;
              address2: string | null;
              city: string;
              province: string | null;
              country: string;
              zip: string;
            } | null;
            lineItems: {
              nodes: Array<{
                id: string;
                title: string;
                quantity: number;
                variantTitle: string | null;
                price: { amount: string; currencyCode: string };
                image: { url: string; altText: string | null } | null;
              }>;
            };
            fulfillments: {
              nodes: Array<{
                status: string;
                trackingInformation: Array<{
                  number: string | null;
                  url: string | null;
                  company: string | null;
                }>;
              }>;
            };
          }>;
        };
      };
    };
    errors?: Array<{ message: string }>;
  };

  if (json?.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "Could not load orders.");
  }

  const nodes = json?.data?.customer?.orders?.nodes ?? [];
  return nodes.map((o) => ({
    id: o.id,
    orderNumber: o.number,
    processedAt: o.processedAt,
    cancelledAt: o.cancelledAt ?? null,
    financialStatus: o.financialStatus,
    fulfillmentStatus: o.fulfillmentStatus,
    totalPrice: o.totalPrice,
    subtotalPrice: o.subtotal ?? null,
    totalShippingPrice: o.totalShipping ?? null,
    totalTaxPrice: o.totalTax ?? null,
    shippingAddress: o.shippingAddress ?? null,
    lineItems: o.lineItems.nodes.map((li) => ({
      id: li.id,
      title: li.title,
      quantity: li.quantity,
      variantTitle: li.variantTitle ?? null,
      price: li.price,
      imageUrl: li.image?.url ?? null,
      imageAlt: li.image?.altText ?? null,
    })),
    fulfillments: o.fulfillments.nodes.map((f) => ({
      status: f.status,
      tracking: f.trackingInformation,
    })),
  }));
}

/** Revoke the customer access token (logout). */
export async function revokeCustomerToken(accessToken: string): Promise<void> {
  await fetch(`https://shopify.com/authentication/${SHOP_ID}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: CLIENT_ID, token: accessToken }),
  }).catch(() => {});
}
