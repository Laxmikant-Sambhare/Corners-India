import type { CustomerInfo, CustomerOrder } from "../store/authStore";
import type {
  ProductsQueryData,
  CatalogCollectionsQueryData,
  ShopifyGraphQLResponse,
  ShopifyProduct,
} from "./types";
import {
  CART_CREATE,
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_ACCESS_TOKEN_DELETE,
  CUSTOMER_CREATE,
  CUSTOMER_UPDATE_MARKETING,
  GET_ALL_PRODUCTS,
  GET_CATALOG_COLLECTIONS,
  GET_CUSTOMER,
  NEWSLETTER_SUBSCRIBE,
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
export async function createShopifyCart(
  lines: CartLineInput[],
  buyerIdentity?: CartBuyerIdentityInput,
): Promise<string> {
  const data = await shopifyFetch<CartCreateData>(CART_CREATE, {
    lines,
    buyerIdentity,
  });
  const cart = data.cartCreate.cart;
  if (!cart) {
    const errs = data.cartCreate.userErrors.map((e) => e.message).join("; ");
    throw new Error(errs || "Shopify cart creation failed");
  }
  return cart.checkoutUrl;
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

type NewsletterSubscribeData = {
  customerCreate: {
    customer: { id: string; email: string; acceptsMarketing: boolean } | null;
    customerUserErrors: Array<{ code: string; field: string[] | null; message: string }>;
  };
};

type CustomerUpdateMarketingData = {
  customerUpdate: {
    customer: { id: string; email: string; acceptsMarketing: boolean } | null;
    customerUserErrors: Array<{ code: string; field: string[] | null; message: string }>;
  };
};

/**
 * Subscribe to Shopify marketing.
 * - If the user is already logged in, pass their `accessToken` — we simply
 *   flip acceptsMarketing on their existing account (no email sent).
 * - If they are a guest, we create a new customer record with
 *   acceptsMarketing = true.
 */
export async function subscribeToNewsletter(
  email: string,
  accessToken?: string | null,
): Promise<void> {
  if (accessToken) {
    const data = await shopifyFetch<CustomerUpdateMarketingData>(
      CUSTOMER_UPDATE_MARKETING,
      { customerAccessToken: accessToken, customer: { acceptsMarketing: true } },
    );
    const errors = data.customerUpdate.customerUserErrors;
    if (errors.length > 0) {
      throw new Error(errors.map((e) => e.message).join("; "));
    }
    return;
  }

  const randomPassword = `NL-${crypto.randomUUID()}-${Date.now()}`;
  const data = await shopifyFetch<NewsletterSubscribeData>(NEWSLETTER_SUBSCRIBE, {
    input: { email, password: randomPassword, acceptsMarketing: true },
  });

  const errors = data.customerCreate.customerUserErrors;

  // Non-blocking: customer is already in Shopify with acceptsMarketing true
  const nonBlocking = new Set(["TAKEN", "CUSTOMER_DISABLED"]);
  const blocking = errors.filter((e) => !nonBlocking.has(e.code));
  if (blocking.length > 0) {
    throw new Error(blocking.map((e) => e.message).join("; "));
  }
}
