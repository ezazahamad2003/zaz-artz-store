"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Design } from "./types";
import { designPrice, shippingFor } from "./pricing";

interface CartCtx {
  items: CartItem[];
  add: (design: Design, size: string, name: string, qty?: number, priceDelta?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  shipping: number;
  total: number;
  count: number;
  ready: boolean;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "zaz-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage once on the client (external system -> state).
    let stored: CartItem[] | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) stored = JSON.parse(raw);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setItems(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const value = useMemo<CartCtx>(() => {
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const shipping = shippingFor(subtotal);
    return {
      items,
      ready,
      add: (design, size, name, qty = 1, priceDelta = 0) =>
        setItems((prev) => [
          ...prev,
          {
            id: `${design.id}-${size}-${Date.now().toString(36)}`,
            design,
            size,
            qty,
            name,
            unitPrice: designPrice(design, size, priceDelta),
          },
        ]),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      setQty: (id, qty) =>
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(50, qty)) } : i)),
        ),
      clear: () => setItems([]),
      subtotal,
      shipping,
      total: subtotal + shipping,
      count: items.reduce((s, i) => s + i.qty, 0),
    };
  }, [items, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
