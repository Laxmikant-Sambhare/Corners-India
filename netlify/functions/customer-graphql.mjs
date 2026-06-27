/**
 * Proxies Customer Account API GraphQL from the browser (avoids CORS).
 * Requires VITE_SHOPIFY_STORE_DOMAIN in Netlify env (runtime).
 */
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const domain = process.env.VITE_SHOPIFY_STORE_DOMAIN?.trim();
  if (!domain) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        errors: [{ message: "VITE_SHOPIFY_STORE_DOMAIN is not configured." }],
      }),
    };
  }

  const auth = event.headers.authorization ?? event.headers.Authorization ?? "";
  if (!auth) {
    return {
      statusCode: 401,
      body: JSON.stringify({ errors: [{ message: "Missing access token." }] }),
    };
  }

  try {
    const discoveryRes = await fetch(
      `https://${domain}/.well-known/customer-account-api`,
    );
    if (!discoveryRes.ok) {
      throw new Error(`Discovery failed (${discoveryRes.status})`);
    }
    const discovery = await discoveryRes.json();
    const graphqlEndpoint = discovery.graphql_api;
    if (!graphqlEndpoint) {
      throw new Error("Customer Account API graphql_api missing from discovery.");
    }

    const upstream = await fetch(graphqlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: event.body,
    });

    const text = await upstream.text();
    return {
      statusCode: upstream.status,
      headers: { "Content-Type": "application/json" },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({
        errors: [
          {
            message:
              err instanceof Error ? err.message : "Customer API proxy failed.",
          },
        ],
      }),
    };
  }
}
