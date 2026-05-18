export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
};

export type ShopifySelectedOption = {
  name: string;
  value: string;
};

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: ShopifySelectedOption[];
  price: ShopifyMoney;
  image: ShopifyImage | null;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  productType: string;
  description: string;
  tags: string[];
  featuredImage: ShopifyImage | null;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  images: { nodes: ShopifyImage[] };
  variants: { nodes: ShopifyVariant[] };
};

export type ShopifyGraphQLResponse<T> = {
  data: T;
  errors?: Array<{ message: string; locations?: unknown }>;
};

export type ProductsQueryData = {
  products: { nodes: ShopifyProduct[] };
};
