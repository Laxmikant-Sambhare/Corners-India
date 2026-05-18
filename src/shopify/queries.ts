// ── Customer auth ──────────────────────────────────────────────────────────

export const CUSTOMER_ACCESS_TOKEN_CREATE = `
  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

export const CUSTOMER_CREATE = `
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

export const NEWSLETTER_SUBSCRIBE = `
  mutation NewsletterSubscribe($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        acceptsMarketing
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const CUSTOMER_UPDATE_MARKETING = `
  mutation CustomerUpdateMarketing($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        email
        acceptsMarketing
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_DELETE = `
  mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      userErrors {
        field
        message
      }
    }
  }
`;

export const GET_CUSTOMER = `
  query GetCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      orders(first: 5, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          orderNumber
          processedAt
          statusUrl
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export const CART_CREATE = `
  mutation CartCreate(
    $lines: [CartLineInput!]!
    $buyerIdentity: CartBuyerIdentityInput
  ) {
    cartCreate(input: { lines: $lines, buyerIdentity: $buyerIdentity }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const GET_ALL_PRODUCTS = `
  query GetAllProducts($first: Int!) {
    products(first: $first) {
      nodes {
        id
        title
        handle
        productType
        description
        tags
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 8) {
          nodes {
            url
            altText
          }
        }
        variants(first: 30) {
          nodes {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;
