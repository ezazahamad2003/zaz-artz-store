import { NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import type { CartItem, Order } from "@/lib/types";
import { saveOrder, listOrders, updateOrderStatus } from "@/lib/cosmos";
import { designPrice, shippingFor } from "@/lib/pricing";

export const runtime = "nodejs";
export const maxDuration = 60;

const Customer = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  address1: z.string().min(3).max(120),
  address2: z.string().max(120).optional(),
  city: z.string().min(1).max(80),
  state: z.string().min(1).max(40),
  zip: z.string().min(3).max(12),
  country: z.string().min(2).max(2).default("US"),
});

function isAdmin(req: Request) {
  const key = process.env.ADMIN_KEY;
  if (!key) return false;
  const url = new URL(req.url);
  return req.headers.get("x-admin-key") === key || url.searchParams.get("key") === key;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const customer = Customer.safeParse(body?.customer);
  const items = body?.items as CartItem[] | undefined;
  if (!customer.success || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }
  // Recompute prices server-side; never trust the client.
  const priced: CartItem[] = items.slice(0, 50).map((i) => ({
    ...i,
    qty: Math.max(1, Math.min(50, Number(i.qty) || 1)),
    unitPrice: designPrice(i.design, i.size),
  }));
  const subtotal = priced.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const groupQty = priced.reduce((s, i) => s + i.qty, 0);
  const discount = groupQty >= 10 ? Math.round(subtotal * 0.15 * 100) / 100 : 0;
  const shipping = shippingFor(subtotal - discount);
  const total = Math.round((subtotal - discount + shipping) * 100) / 100;
  const id = `ZZ-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

  const order: Order = {
    id,
    pk: "order",
    status: "pending_payment",
    items: priced,
    subtotal: Math.round((subtotal - discount) * 100) / 100,
    shipping,
    total,
    customer: customer.data,
    notes: typeof body?.notes === "string" ? body.notes.slice(0, 500) : undefined,
    createdAt: new Date().toISOString(),
  };

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  if (stripeKey) {
    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: order.customer.email,
      line_items: [
        ...priced.map((i) => ({
          quantity: i.qty,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(i.unitPrice * 100),
            product_data: { name: `${i.name} · ${i.size}`, images: i.design.previewUrl ? [i.design.previewUrl] : [] },
          },
        })),
        ...(shipping > 0
          ? [{ quantity: 1, price_data: { currency: "usd", unit_amount: Math.round(shipping * 100), product_data: { name: "Shipping" } } }]
          : []),
      ],
      ...(discount > 0
        ? { discounts: [{ coupon: (await stripe.coupons.create({ percent_off: 15, duration: "once", name: "Group order 15%" })).id }] }
        : {}),
      metadata: { orderId: id },
      success_url: `${site}/orders/${id}?paid=1`,
      cancel_url: `${site}/checkout?cancelled=1`,
    });
    order.stripeSessionId = session.id;
    await saveOrder(order);
    return NextResponse.json({ orderId: id, checkoutUrl: session.url });
  }

  await saveOrder(order);
  return NextResponse.json({ orderId: id, checkoutUrl: null });
}

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ orders: await listOrders() });
}

export async function PATCH(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const statuses: Order["status"][] = ["pending_payment", "paid", "in_production", "shipped", "cancelled"];
  if (!body.id || !statuses.includes(body.status)) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const o = await updateOrderStatus(body.id, body.status);
  return NextResponse.json({ order: o });
}
