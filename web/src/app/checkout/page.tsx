"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/pricing";

const F = ["name", "email", "phone", "address1", "address2", "city", "state", "zip"] as const;
const LABELS: Record<(typeof F)[number], string> = {
  name: "Full name", email: "Email", phone: "Phone (optional)", address1: "Address", address2: "Apt / suite (optional)", city: "City", state: "State", zip: "ZIP",
};

export default function CheckoutPage() {
  const cart = useCart();
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({ country: "US" });
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!cart.ready) return <div className="p-10 text-fg-2">Loading…</div>;
  if (cart.items.length === 0) {
    router.replace("/cart");
    return null;
  }
  const discount = cart.count >= 10 ? cart.subtotal * 0.15 : 0;
  const total = cart.subtotal - discount + cart.shipping;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ customer: form, items: cart.items, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not place order");
      cart.clear();
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      else router.push(`/orders/${data.orderId}`);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-6xl">CHECKOUT</h1>
      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="card p-6">
          <div className="label">Shipping details</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {F.map((k) => (
              <div key={k} className={k === "address1" || k === "address2" || k === "email" ? "sm:col-span-2" : ""}>
                <label className="mb-1 block text-xs text-fg-2">{LABELS[k]}</label>
                <input
                  className="input"
                  type={k === "email" ? "email" : "text"}
                  required={!["phone", "address2"].includes(k)}
                  value={form[k] ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                  autoComplete={k === "name" ? "name" : k === "email" ? "email" : k === "zip" ? "postal-code" : k}
                />
              </div>
            ))}
            <div>
              <label className="mb-1 block text-xs text-fg-2">Country</label>
              <select className="input" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-fg-2">Order notes (optional)</label>
              <textarea className="input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Gift? Deadline? Anything we should know." />
            </div>
          </div>
          {error && <div className="mt-4 rounded-xl border border-pink/50 bg-pink/10 px-3 py-2 text-sm text-pink">{error}</div>}
        </div>
        <aside className="card h-fit p-5">
          <div className="label">Order</div>
          <ul className="space-y-1 text-sm">
            {cart.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-2"><span className="truncate text-fg-2">{i.qty}× {i.name} ({i.size})</span><span>{money(i.unitPrice * i.qty)}</span></li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
            {discount > 0 && <div className="flex justify-between text-acid"><dt>Group 15% off</dt><dd>-{money(discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-fg-2">Shipping</dt><dd>{cart.shipping === 0 ? "Free" : money(cart.shipping)}</dd></div>
            <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd>{money(total)}</dd></div>
          </dl>
          <button type="submit" disabled={busy} className="btn btn-acid mt-5 w-full">
            {busy ? <Loader2 className="animate-spin" size={16} /> : <Lock size={16} />} Place order · {money(total)}
          </button>
          <p className="mt-3 text-[11px] text-fg-2/70">
            Payment is handled securely by Stripe. If card payment is temporarily unavailable, we confirm the order and email you a payment link.
          </p>
        </aside>
      </form>
    </div>
  );
}
