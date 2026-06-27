import { adminGraphql } from "./admin-auth.mjs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CUSTOMER_CREATE = `
  mutation NewsletterCustomerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const GET_CUSTOMER_BY_EMAIL = `
  query NewsletterCustomerByEmail($query: String!) {
    customers(first: 1, query: $query) {
      edges {
        node {
          id
          email
        }
      }
    }
  }
`;

const UPDATE_EMAIL_MARKETING = `
  mutation NewsletterEmailMarketingConsent($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer {
        id
        email
      }
      userErrors {
        field
        message
      }
    }
  }
`;

function marketingConsentInput() {
  return {
    marketingState: "SUBSCRIBED",
    marketingOptInLevel: "SINGLE_OPT_IN",
  };
}

function formatUserErrors(userErrors) {
  return (userErrors ?? []).map((e) => e.message).join("; ");
}

function isEmailTakenError(userErrors) {
  return (userErrors ?? []).some((e) =>
    /already been taken|already exists|email.*taken/i.test(e.message ?? ""),
  );
}

async function findCustomerIdByEmail(email) {
  const data = await adminGraphql(GET_CUSTOMER_BY_EMAIL, {
    query: `email:${email}`,
  });
  return data.customers?.edges?.[0]?.node?.id ?? null;
}

async function updateMarketingConsent(customerId) {
  const data = await adminGraphql(UPDATE_EMAIL_MARKETING, {
    input: {
      customerId,
      emailMarketingConsent: marketingConsentInput(),
    },
  });
  const errors = formatUserErrors(
    data.customerEmailMarketingConsentUpdate?.userErrors,
  );
  if (errors) throw new Error(errors);
}

/**
 * Subscribe an email to Shopify Email marketing without creating a login account.
 * Uses Admin API — same outcome as the Liquid theme newsletter form ("No account").
 */
export async function subscribeEmailToMarketing(rawEmail) {
  const email = rawEmail?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  const createData = await adminGraphql(CUSTOMER_CREATE, {
    input: {
      email,
      emailMarketingConsent: marketingConsentInput(),
    },
  });

  const createResult = createData.customerCreate;
  const createErrors = createResult?.userErrors ?? [];

  if (createResult?.customer?.id) return;

  if (!isEmailTakenError(createErrors)) {
    const msg = formatUserErrors(createErrors);
    if (msg) throw new Error(msg);
    throw new Error("Could not subscribe to the newsletter.");
  }

  const customerId = await findCustomerIdByEmail(email);
  if (!customerId) {
    throw new Error("Could not subscribe to the newsletter.");
  }

  await updateMarketingConsent(customerId);
}
