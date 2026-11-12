import { CosmosClient, type Container } from "@azure/cosmos";
import type { Design, Order } from "./types";

let client: CosmosClient | null = null;

function getClient() {
  const conn = process.env.COSMOS_CONNECTION_STRING;
  if (!conn) return null;
  if (!client) client = new CosmosClient(conn);
  return client;
}

function container(name: "designs" | "orders" | "products"): Container | null {
  const c = getClient();
  if (!c) return null;
  return c.database(process.env.COSMOS_DATABASE ?? "zaz").container(name);
}

/* In-memory fallback so the app still works locally without Cosmos. */
const mem: Record<string, Map<string, unknown>> = {
  designs: new Map(),
  orders: new Map(),
  products: new Map(),
};

export async function saveDesign(design: Design) {
  const c = container("designs");
  const doc = { ...design, pk: "design" };
  if (!c) {
    mem.designs.set(design.id, doc);
    return doc;
  }
  const { resource } = await c.items.upsert(doc);
  return resource as unknown as Design;
}

export async function getDesign(id: string): Promise<Design | null> {
  const c = container("designs");
  if (!c) return (mem.designs.get(id) as Design) ?? null;
  try {
    const { resource } = await c.item(id, "design").read<Design>();
    return resource ?? null;
  } catch {
    return null;
  }
}

export async function saveOrder(order: Order) {
  const c = container("orders");
  if (!c) {
    mem.orders.set(order.id, order);
    return order;
  }
  const { resource } = await c.items.upsert(order);
  return resource as unknown as Order;
}

export async function getOrder(id: string): Promise<Order | null> {
  const c = container("orders");
  if (!c) return (mem.orders.get(id) as Order) ?? null;
  try {
    const { resource } = await c.item(id, "order").read<Order>();
    return resource ?? null;
  } catch {
    return null;
  }
}

export async function listOrders(limit = 100): Promise<Order[]> {
  const c = container("orders");
  if (!c) return [...mem.orders.values()] as Order[];
  const { resources } = await c.items
    .query<Order>({
      query: "SELECT TOP @n * FROM c WHERE c.pk = 'order' ORDER BY c.createdAt DESC",
      parameters: [{ name: "@n", value: limit }],
    })
    .fetchAll();
  return resources;
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  const order = await getOrder(id);
  if (!order) return null;
  order.status = status;
  return saveOrder(order);
}

export async function upsertProducts(docs: Record<string, unknown>[]) {
  const c = container("products");
  if (!c) {
    docs.forEach((d) => mem.products.set(String(d.id), d));
    return docs.length;
  }
  let count = 0;
  for (const d of docs) {
    await c.items.upsert({ ...d, pk: "template" });
    count++;
  }
  return count;
}

export const cosmosConfigured = () => Boolean(process.env.COSMOS_CONNECTION_STRING);
