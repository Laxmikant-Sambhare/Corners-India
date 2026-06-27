import type { CustomerInfo, CustomerOrder } from "../store/authStore";
import type {
  ProductsQueryData,
  CatalogCollectionsQueryData,
  ShopifyGraphQLResponse,
  ShopifyProduct,
} from "./types";
import {
  CART_CREATE,
  GET_CART,
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_ACCESS_TOKEN_DELETE,
  CUSTOMER_CREATE,
  GET_ALL_PRODUCTS,
  GET_CATALOG_COLLECTIONS,
  GET_CUSTOMER,
} from "./queries";

// ── Cart types ─────────────────────────────────────────────────────────────

export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
};

export type CartBuyerIdentityInput = {
  email?: string;
  phone?: string;
  deliveryAddressPreferences?: Array<{
    deliveryAddress: {
      firstName?: string;
      lastName?: string;
      address1?: string;
      address2?: string;
      city?: string;
      province?: string;
      zip?: string;
      country?: string;
      phone?: string;
    };
  }>;
};

type CartCreateData = {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
};

const DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as
  | string
  | undefined;

/** True when both env vars are present — gates all Shopify API calls. */
export const isShopifyConfigured = Boolean(DOMAIN && TOKEN);

function getEndpoint(): string {
  if (!DOMAIN) throw new Error("VITE_SHOPIFY_STORE_DOMAIN is not set in .env");
  return `https://${DOMAIN}/api/2025-01/graphql.json`;
}

async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  if (!TOKEN)
    throw new Error("VITE_SHOPIFY_STOREFRONT_TOKEN is not set in .env");

  const res = await fetch(getEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify Storefront API responded with ${res.status}`);
  }

  const json = (await res.json()) as ShopifyGraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${json.errors[0].message}`);
  }
  return json.data;
}

/** Fetch all products from the Shopify storefront (up to 50). */
export async function fetchAllProducts(): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<ProductsQueryData>(GET_ALL_PRODUCTS, {
    first: 50,
  });
  return data.products.nodes;
}

/** Fetch catalog collection metafields (furniture, rugs, dunari, eira). */
export async function fetchCatalogCollections(): Promise<CatalogCollectionsQueryData> {
  return shopifyFetch<CatalogCollectionsQueryData>(GET_CATALOG_COLLECTIONS);
}

/**
 * Create a Shopify cart with the given line items and optional buyer identity
 * (pre-fills shipping info on the hosted checkout page).
 * Returns the Shopify-hosted checkout URL to redirect the customer to.
 */
export type ShopifyCheckoutSession = {
  checkoutUrl: string;
  cartId: string;
};

export async function createShopifyCart(
  lines: CartLineInput[],
  buyerIdentity?: CartBuyerIdentityInput,
): Promise<ShopifyCheckoutSession> {
  const data = await shopifyFetch<CartCreateData>(CART_CREATE, {
    lines,
    buyerIdentity,
  });
  const cart = data.cartCreate.cart;
  if (!cart) {
    const errs = data.cartCreate.userErrors.map((e) => e.message).join("; ");
    throw new Error(errs || "Shopify cart creation failed");
  }
  return { checkoutUrl: cart.checkoutUrl, cartId: cart.id };
}

/** Returns null when Shopify deleted the cart after checkout completed. */
export async function fetchCartById(
  cartId: string,
): Promise<{ id: string; totalQuantity: number } | null> {
  const data = await shopifyFetch<{ cart: { id: string; totalQuantity: number } | null }>(
    GET_CART,
    { id: cartId },
  );
  return data.cart;
}

// ── Customer auth ──────────────────────────────────────────────────────────

type CustomerUserError = { field: string[] | null; message: string };

type TokenCreateData = {
  customerAccessTokenCreate: {
    customerAccessToken: { accessToken: string; expiresAt: string } | null;
    customerUserErrors: CustomerUserError[];
  };
};

type CustomerCreateData = {
  customerCreate: {
    customer: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    } | null;
    customerUserErrors: CustomerUserError[];
  };
};

type GetCustomerData = {
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    orders: {
      nodes: Array<{
        id: string;
        orderNumber: number;
        processedAt: string;
        statusUrl: string;
        fulfillmentStatus: string;
        totalPrice: { amount: string; currencyCode: string };
      }>;
    };
  } | null;
};

/** Log in with email + password. Returns token info + basic customer data. */
export async function loginCustomer(
  email: string,
  password: string,
): Promise<{
  token: string;
  expiresAt: string;
  customer: CustomerInfo;
  orders: CustomerOrder[];
}> {
  const data = await shopifyFetch<TokenCreateData>(
    CUSTOMER_ACCESS_TOKEN_CREATE,
    {
      input: { email, password },
    },
  );
  const result = data.customerAccessTokenCreate;
  if (!result.customerAccessToken) {
    const raw = result.customerUserErrors.map((e) => e.message).join("; ");
    let msg = raw || "Invalid email or password.";
    if (raw.toLowerCase().includes("unidentified")) {
      msg =
        "Account not found or password incorrect. " +
        "If you just registered, open the activation email from Shopify and click the link to set your password — then sign in here.";
    }
    throw new Error(msg);
  }
  const { accessToken, expiresAt } = result.customerAccessToken;
  const { customer, orders } = await getCustomer(accessToken);
  return { token: accessToken, expiresAt, customer, orders };
}

/**
 * Register a new customer. Throws a special `NeedsActivationError` if the
 * account was created but Shopify requires email verification before login.
 */
export class NeedsActivationError extends Error {
  readonly email: string;
  constructor(email: string) {
    super("needs_activation");
    this.name = "NeedsActivationError";
    this.email = email;
  }
}

export async function registerCustomer(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<{
  token: string;
  expiresAt: string;
  customer: CustomerInfo;
  orders: CustomerOrder[];
}> {
  const data = await shopifyFetch<CustomerCreateData>(CUSTOMER_CREATE, {
    input: { firstName, lastName, email, password },
  });
  const result = data.customerCreate;
  if (!result.customer) {
    const msg = result.customerUserErrors.map((e) => e.message).join("; ");
    throw new Error(msg || "Could not create account.");
  }
  // Shopify sends an activation email — the account cannot be used until the
  // customer clicks the link. Attempt login and surface a clear message if it
  // isn't activated yet.
  try {
    return await loginCustomer(email, password);
  } catch {
    throw new NeedsActivationError(email);
  }
}

/** Fetch customer details + recent orders using a valid access token. */
export async function getCustomer(
  token: string,
): Promise<{ customer: CustomerInfo; orders: CustomerOrder[] }> {
  const data = await shopifyFetch<GetCustomerData>(GET_CUSTOMER, {
    customerAccessToken: token,
  });
  if (!data.customer) throw new Error("Session expired. Please log in again.");
  const { id, email, firstName, lastName, orders } = data.customer;
  return {
    customer: { id, email, firstName, lastName },
    orders: orders.nodes,
  };
}

/** Invalidate the access token on Shopify's side. */
export async function logoutCustomer(token: string): Promise<void> {
  await shopifyFetch(CUSTOMER_ACCESS_TOKEN_DELETE, {
    customerAccessToken: token,
  }).catch(() => {
    /* ignore — we clear local state regardless */
  });
}

// ── Newsletter ──────────────────────────────────────────────────────────────

const NEWSLETTER_SUBSCRIBE_URL = import.meta.env.DEV
  ? "/api/newsletter-subscribe"
  : "/.netlify/functions/newsletter-subscribe";

/** Subscribe to Shopify Email marketing (no account / activation email). */
export async function subscribeToNewsletter(email: string): Promise<void> {
  const res = await fetch(NEWSLETTER_SUBSCRIBE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });

  const json = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    throw new Error(json.error ?? "Could not subscribe to the newsletter.");
  }
}
