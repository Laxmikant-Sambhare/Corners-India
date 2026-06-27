import { subscribeEmailToMarketing } from "../../shopify/newsletter-subscribe.mjs";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let email;
  try {
    const body = JSON.parse(event.body ?? "{}");
    email = body.email;
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid request body." }),
    };
  }

  try {
    await subscribeEmailToMarketing(email);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error:
          err instanceof Error ? err.message : "Newsletter subscribe failed.",
      }),
    };
  }
}
