import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/cosmos";
import { money } from "@/lib/pricing";
import GarmentMockup from "@/components/GarmentMockup";
import { colorById, garmentById } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = {
  pending_payment: "Order received · payment pending",
  paid: "Paid · queued for printing",
  in_production: "In production",
  shipped: "Shipped",
  cancelled: "Cancelled",
};

export default async function OrderPage(props: PageProps<"/orders/[id]">) {
  const { id } = await props.params;
  const order = await getOrder(id);
  if (!order) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="label">Order {order.id}</div>
      <h1 className="text-6xl">Thank you, {order.customer.name.split(" ")[0]}.</h1>
      <p className="mt-3 text-fg-2">
        {STATUS[order.status]}. A confirmation goes to {order.customer.email}. Production takes 3 to 5 business days, then tracked shipping.
      </p>
      {order.status === "pending_payment" && (
        <div className="mt-4 rounded-xl border border-acid/40 bg-acid/10 p-4 text-sm">
          We have your order. If you were not redirected to pay, we will email a secure payment link shortly. Nothing prints until payment clears.
        </div>
      )}
      <ul className="mt-8 space-y-3">
        {order.items.map((i) => (
          <li key={i.id} className="card grid grid-cols-[90px_1fr_auto] items-center gap-4 p-3">
            <div className="rounded-xl bg-bg-3 p-1"><GarmentMockup garment={i.design.garment} color={i.design.color} layers={i.design.front} className="w-full" /></div>
            <div>
              <div className="font-semibold">{i.name}</div>
              <div className="text-sm text-fg-2">{garmentById(i.design.garment).name} · {colorById(i.design.color).name} · {i.size} · qty {i.qty}</div>
            </div>
            <div className="font-semibold">{money(i.unitPrice * i.qty)}</div>
          </li>
        ))}
      </ul>
      <dl className="card mt-4 space-y-1 p-5 text-sm">
        <div className="flex justify-between"><dt className="text-fg-2">Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-fg-2">Shipping</dt><dd>{order.shipping === 0 ? "Free" : money(order.shipping)}</dd></div>
        <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd>{money(order.total)}</dd></div>
      </dl>
      <div className="card mt-4 p-5 text-sm text-fg-2">
        <div className="label">Ships to</div>
        {order.customer.name}<br />{order.customer.address1}{order.customer.address2 ? `, ${order.customer.address2}` : ""}<br />
        {order.customer.city}, {order.customer.state} {order.customer.zip} · {order.customer.country}
      </div>
      <Link href="/" className="btn btn-ghost mt-8">Back to the shop</Link>
    </div>
  );
}
