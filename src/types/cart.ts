export type CartItem = {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type CartState = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
};