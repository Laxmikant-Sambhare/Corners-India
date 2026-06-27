import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CustomerInfo = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type CustomerOrder = {
  id: string;
  orderNumber: number;
  processedAt: string;
  statusUrl: string;
  fulfillmentStatus: string;
  totalPrice: { amount: string; currencyCode: string };
};

type AuthStore = {
  accessToken: string | null;
  expiresAt: string | null;
  customer: CustomerInfo | null;
  recentOrders: CustomerOrder[];
  setAuth: (token: string, expiresAt: string, customer: CustomerInfo, orders?: CustomerOrder[]) => void;
  setCustomer: (customer: CustomerInfo, orders?: CustomerOrder[]) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

/** Use with `useAuthStore(selectIsLoggedIn)` so components re-render on logout. */
export function selectIsLoggedIn(state: {
  accessToken: string | null;
  expiresAt: string | null;
}): boolean {
  if (!state.accessToken) return false;
  if (state.expiresAt && new Date(state.expiresAt) < new Date()) return false;
  return true;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      expiresAt: null,
      customer: null,
      recentOrders: [],

      setAuth(token, expiresAt, customer, orders = []) {
        set({ accessToken: token, expiresAt, customer, recentOrders: orders });
      },

      setCustomer(customer, orders = []) {
        set({ customer, recentOrders: orders });
      },

      logout() {
        set({ accessToken: null, expiresAt: null, customer: null, recentOrders: [] });
      },

      isLoggedIn() {
        return selectIsLoggedIn(get());
      },
    }),
    { name: "corners-auth" },
  ),
);
