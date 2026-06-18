import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/components/ProductCard";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  photo?: string;
  addresses?: any[];
  kycStatus?: string;
  kycDocuments?: any[];
}

interface CartItem extends Product {
  cartQuantity: number;
  unit: "Grams" | "KG" | "Quintal" | "Ton";
}

interface AppState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token: string | null) => void;
  logout: () => void;
  
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, unit?: "Grams" | "KG" | "Quintal" | "Ton") => void;
  removeFromCart: (productId: string, unit: string) => void;
  updateQuantity: (productId: string, quantity: number, unit?: "Grams" | "KG" | "Quintal" | "Ton", oldUnit?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartTotalKG: () => number; // Helper to check if order is bulk
}

const getMultiplier = (unit: string) => {
  switch (unit) {
    case "Grams": return 0.001;
    case "Quintal": return 100;
    case "Ton": return 1000;
    case "KG":
    default: return 1;
  }
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),

      cart: [],
      addToCart: (product, quantity = 1, unit = "KG") => {
        const currentCart = get().cart;
        // Check if item exists with same unit. If it does, increase qty. If not, add new entry.
        const existingItem = currentCart.find((item) => item._id === product._id && item.unit === unit);

        if (existingItem) {
          set({
            cart: currentCart.map((item) =>
              item._id === product._id && item.unit === unit
                ? { ...item, cartQuantity: item.cartQuantity + quantity }
                : item
            ),
          });
        } else {
          set({ cart: [...currentCart, { ...product, cartQuantity: quantity, unit }] });
        }
      },
      removeFromCart: (productId, unit) => {
        set({ cart: get().cart.filter((item) => !(item._id === productId && item.unit === unit)) });
      },
      updateQuantity: (productId, quantity, newUnit, oldUnit) => {
        if (quantity < 1) return;
        const targetUnit = oldUnit || newUnit;
        set({
          cart: get().cart.map((item) => {
            if (item._id === productId && item.unit === targetUnit) {
              return { ...item, cartQuantity: quantity, ...(newUnit ? { unit: newUnit } : {}) };
            }
            return item;
          }),
        });
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + (item.currentPrice * getMultiplier(item.unit) * item.cartQuantity),
          0
        );
      },
      getCartTotalKG: () => {
        return get().cart.reduce(
          (total, item) => total + (item.cartQuantity * getMultiplier(item.unit)),
          0
        );
      },
    }),
    {
      name: "trade-mirchi-storage",
    }
  )
);
