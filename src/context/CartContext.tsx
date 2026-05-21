import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { MenuItem } from "../data/menu";

export type CartItem = {
  item: MenuItem;
  quantity: number;
  notes?: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  customer: CustomerInfo;
  status: "Order Received" | "preparing" | "cooking" | "on-the-way" | "delivered";
  createdAt: number;
  estimatedMinutes: number;
};

export type CustomerInfo = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
  paymentMethod: "card" | "cash" | "wallet";
};

type CartState = {
  items: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  activeOrder: Order | null;
};

type CartAction =
  | { type: "ADD_ITEM"; payload: { item: MenuItem; quantity?: number; notes?: string } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART"; payload?: boolean }
  | { type: "TOGGLE_CHECKOUT"; payload?: boolean }
  | { type: "PLACE_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER_STATUS"; payload: Order["status"] }
  | { type: "CLEAR_ORDER" };

const STORAGE_KEY = "takoyaki-cart";
const ORDER_KEY = "takoyaki-order";

const initialState: CartState = {
  items: [],
  isCartOpen: false,
  isCheckoutOpen: false,
  activeOrder: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.item.id === action.payload.item.id);
      const qty = action.payload.quantity ?? 1;
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.item.id === action.payload.item.id
              ? { ...i, quantity: i.quantity + qty, notes: action.payload.notes ?? i.notes }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { item: action.payload.item, quantity: qty, notes: action.payload.notes }],
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.item.id !== action.payload) };
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.item.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.item.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isCartOpen: action.payload ?? !state.isCartOpen, isCheckoutOpen: false };
    case "TOGGLE_CHECKOUT":
      return { ...state, isCheckoutOpen: action.payload ?? !state.isCheckoutOpen, isCartOpen: false };
    case "PLACE_ORDER":
      return { ...state, activeOrder: action.payload, items: [], isCheckoutOpen: false };
    case "UPDATE_ORDER_STATUS":
      if (!state.activeOrder) return state;
      return { ...state, activeOrder: { ...state.activeOrder, status: action.payload } };
    case "CLEAR_ORDER":
      return { ...state, activeOrder: null };
    default:
      return state;
  }
}

type CartContextType = {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);
      const savedOrder = localStorage.getItem(ORDER_KEY);
      return {
        items: savedCart ? JSON.parse(savedCart) : [],
        isCartOpen: false,
        isCheckoutOpen: false,
        activeOrder: savedOrder ? JSON.parse(savedOrder) : null,
      };
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    if (state.activeOrder) {
      localStorage.setItem(ORDER_KEY, JSON.stringify(state.activeOrder));
    } else {
      localStorage.removeItem(ORDER_KEY);
    }
  }, [state.activeOrder]);

  const items: CartItem[] = state.items;
  const itemCount = items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum: number, i: CartItem) => sum + i.item.price * i.quantity, 0);
  const deliveryFee = subtotal > 0 ? (subtotal >= 200 ? 0 : 20) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  return (
    <CartContext.Provider value={{ state, dispatch, itemCount, subtotal, deliveryFee, tax, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
