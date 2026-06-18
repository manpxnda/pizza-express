"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";

export type SelectedModifier = {
  groupId: number;
  groupName: string;
  optionId: number;
  name: string;
  price: number;
};

export type CartLine = {
  uid: string;
  itemId: number;
  name: string;
  basePrice: number;
  qty: number;
  modifiers: SelectedModifier[];
  notes?: string;
};

export type OrderType = "pickup" | "delivery";

type CartState = {
  lines: CartLine[];
  locationSlug: string | null;
  orderType: OrderType;
};

type Action =
  | { type: "ADD"; line: CartLine }
  | { type: "REMOVE"; uid: string }
  | { type: "QTY"; uid: string; qty: number }
  | { type: "SET_LOCATION"; slug: string }
  | { type: "SET_ORDER_TYPE"; orderType: OrderType }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; state: CartState };

const initialState: CartState = {
  lines: [],
  locationSlug: null,
  orderType: "pickup",
};

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD":
      return { ...state, lines: [...state.lines, action.line] };
    case "REMOVE":
      return { ...state, lines: state.lines.filter((l) => l.uid !== action.uid) };
    case "QTY":
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.uid === action.uid ? { ...l, qty: Math.max(1, action.qty) } : l
        ),
      };
    case "SET_LOCATION":
      return { ...state, locationSlug: action.slug };
    case "SET_ORDER_TYPE":
      return { ...state, orderType: action.orderType };
    case "CLEAR":
      return { ...state, lines: [] };
    case "HYDRATE":
      return action.state;
    default:
      return state;
  }
}

export function lineTotal(line: CartLine): number {
  const each = line.basePrice + line.modifiers.reduce((s, m) => s + m.price, 0);
  return each * line.qty;
}

const STORAGE_KEY = "pe_cart_v1";

type CartContextValue = {
  state: CartState;
  addLine: (line: CartLine) => void;
  removeLine: (uid: string) => void;
  setQty: (uid: string, qty: number) => void;
  setLocation: (slug: string) => void;
  setOrderType: (orderType: OrderType) => void;
  clear: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", state: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  // Persist on change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const itemCount = state.lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = state.lines.reduce((s, l) => s + lineTotal(l), 0);

  const value: CartContextValue = {
    state,
    addLine: (line) => dispatch({ type: "ADD", line }),
    removeLine: (uid) => dispatch({ type: "REMOVE", uid }),
    setQty: (uid, qty) => dispatch({ type: "QTY", uid, qty }),
    setLocation: (slug) => dispatch({ type: "SET_LOCATION", slug }),
    setOrderType: (orderType) => dispatch({ type: "SET_ORDER_TYPE", orderType }),
    clear: () => dispatch({ type: "CLEAR" }),
    itemCount,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
