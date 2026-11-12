"use client";

import Link from "next/link";
import { Trash2, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart";
import { money, FREE_SHIPPING_OVER } from "@/lib/pricing";
import GarmentMockup from "@/components/GarmentMockup";
import { colorById, garmentById } from "@/lib/catalog";

export default function CartPage() {
  const cart = useCart();
  if (!cart.ready) return <div className="p-10 text-fg-2">Loading…</div>;
  if (cart.items.length === 0)
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-6xl">YOUR CART IS EMPTY</h1>
        <p className="mt-3 text-fg-2">Go make something worth wearing.</p>
        <Link href="/studio" className="btn btn-acid mt-8"><Sparkles size={16} /> Open the studio</Link>
      </div>
    );
  const groupQty = cart.count;
  const discount = groupQty >= 10 ? cart.subtotal * 0.15 : 0;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-6xl">CART</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-3">
          {cart.items.map((i) => (
            <li key={i.id} className="card grid grid-cols-[110px_1fr_auto] items-center gap-4 p-3">
              <div className="rounded-xl bg-bg-3 p-1">
                <GarmentMockup garment={i.design.garment} color={i.design.color} layers={i.design.front} className="w-full" />
              </div>
              <div>
                <div className="font-semibold">{i.name}</div>
                <div className="text-sm text-fg-2">
                  {garmentById(i.design.garment).name} · {colorById(i.design.color).name} · {i.size}
                  {i.design.back?.length > 0 && " · front + back"}
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="text-fg-2">Qty</span>
                  <input type="number" min={1} max={50} value={i.qty} onChange={(e) => cart.setQty(i.id, Number(e.target.value))} className="input w-20" />
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{money(i.unitPrice * i.qty)}</div>
                <div className="text-xs text-fg-2">{money(i.unitPrice)} each</div>
                <button onClick={() => cart.remove(i.id)} className="mt-3 text-pink" aria-label="Remove"><Trash2 size={16} /></button>
              </div>
            </li>
          ))}
        </ul>
        <aside className="card h-fit p-5">
          <div className="label">Summary</div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-fg-2">Subtotal</dt><dd>{money(cart.subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-acid"><dt>Group order 15% off</dt><dd>-{money(discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-fg-2">Shipping</dt><dd>{cart.shipping === 0 ? "Free" : money(cart.shipping)}</dd></div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><dt>Total</dt><dd>{money(cart.subtotal - discount + cart.shipping)}</dd></div>
          </dl>
          {cart.subtotal < FREE_SHIPPING_OVER && (
            <p className="mt-3 text-xs text-fg-2">Add {money(FREE_SHIPPING_OVER - cart.subtotal)} more for free shipping.</p>
          )}
          {groupQty < 10 && <p className="mt-1 text-xs text-fg-2">Orders of 10+ items get 15% off automatically.</p>}
          <Link href="/checkout" className="btn btn-acid mt-5 w-full">Checkout <ArrowRight size={16} /></Link>
          <Link href="/studio" className="btn btn-ghost mt-2 w-full">Add another design</Link>
        </aside>
      </div>
    </div>
  );
}
