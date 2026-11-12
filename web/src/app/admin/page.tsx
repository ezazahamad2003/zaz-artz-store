"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/lib/types";
import { money } from "@/lib/pricing";
import GarmentMockup from "@/components/GarmentMockup";
import { colorById, garmentById } from "@/lib/catalog";

const STATUSES: Order["status"][] = ["pending_payment", "paid", "in_production", "shipped", "cancelled"];

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let k: string | null = null;
    try { k = sessionStorage.getItem("zaz-admin"); } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (k) setKey(k);
  }, []);

  const load = async (k = key) => {
    setErr(null);
    const res = await fetch("/api/orders", { headers: { "x-admin-key": k } });
    if (!res.ok) { setErr("Wrong key"); setOrders(null); return; }
    sessionStorage.setItem("zaz-admin", k);
    setOrders((await res.json()).orders);
  };

  const setStatus = async (id: string, status: Order["status"]) => {
    await fetch("/api/orders", { method: "PATCH", headers: { "content-type": "application/json", "x-admin-key": key }, body: JSON.stringify({ id, status }) });
    load();
  };

  if (!orders)
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <h1 className="text-5xl">ADMIN</h1>
        <form onSubmit={(e) => { e.preventDefault(); load(); }} className="card mt-6 space-y-3 p-5">
          <input className="input" type="password" placeholder="Admin key" value={key} onChange={(e) => setKey(e.target.value)} />
          {err && <div className="text-sm text-pink">{err}</div>}
          <button className="btn btn-acid w-full">Open orders</button>
        </form>
      </div>
    );

  const revenue = orders.filter((o) => o.status !== "cancelled" && o.status !== "pending_payment").reduce((s, o) => s + o.total, 0);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-5xl">ORDERS</h1>
        <div className="flex gap-4 text-sm">
          <div className="card px-4 py-2"><div className="label mb-0">Orders</div><div className="display text-2xl">{orders.length}</div></div>
          <div className="card px-4 py-2"><div className="label mb-0">Paid revenue</div><div className="display text-2xl text-acid">{money(revenue)}</div></div>
          <div className="card px-4 py-2"><div className="label mb-0">To print</div><div className="display text-2xl">{orders.filter((o) => o.status === "paid").length}</div></div>
        </div>
      </div>
      <ul className="mt-8 space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-mono text-sm">{o.id}</span>
                <span className="ml-3 text-sm text-fg-2">{new Date(o.createdAt).toLocaleString()}</span>
                <div className="text-sm">{o.customer.name} · {o.customer.email} · {o.customer.city}, {o.customer.state}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{money(o.total)}</span>
                <select className="input w-44" value={o.status} onChange={(e) => setStatus(o.id, e.target.value as Order["status"])}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              {o.items.map((i) => (
                <div key={i.id} className="flex items-center gap-2 rounded-xl border border-line p-2 text-xs">
                  <div className="w-14 rounded-lg bg-bg-3"><GarmentMockup garment={i.design.garment} color={i.design.color} layers={i.design.front} className="w-full" /></div>
                  <div>
                    <div className="font-semibold">{i.qty}× {i.name}</div>
                    <div className="text-fg-2">{garmentById(i.design.garment).short} · {colorById(i.design.color).name} · {i.size}</div>
                    {i.design.previewUrl && <a className="text-acid underline" href={i.design.previewUrl} target="_blank">preview</a>}
                    <a className="ml-2 text-acid underline" href={`/api/designs?id=${i.design.id}`} target="_blank">print JSON</a>
                  </div>
                </div>
              ))}
            </div>
            {o.notes && <div className="mt-2 text-xs text-fg-2">Note: {o.notes}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
