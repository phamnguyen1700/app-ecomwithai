import { CartState } from "@/types/cart";
import { create } from "zustand";

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  addToCart: (item) => {
    const cart = get().cartItems;
    const existing = cart.find((i) => i._id === item._id);
    if (existing) {
      set({
        cartItems: cart.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + item.quantity } : i
        ),
      });
    } else {
      set({ cartItems: [...cart, item] });
    }
  },
  removeFromCart: (id) => {
    set({ cartItems: get().cartItems.filter((item) => item._id !== id) });
  },
  updateQuantity: (id, quantity) => {
    set({
      cartItems: get().cartItems.map((item) =>
        item._id === id ? { ...item, quantity } : item
      ),
    });
  },
}));