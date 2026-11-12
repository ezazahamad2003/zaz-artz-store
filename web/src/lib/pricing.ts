import type { Design } from "./types";
import { GARMENTS } from "./catalog";

export const BACK_PRINT_FEE = 8;
export const PLUS_SIZE_FEE = 3;
export const FLAT_SHIPPING = 5.99;
export const FREE_SHIPPING_OVER = 75;

export function garmentPrice(garmentId: string) {
  return GARMENTS.find((g) => g.id === garmentId)?.basePrice ?? 29;
}

export function designPrice(design: Design, size: string, priceDelta = 0) {
  let price = garmentPrice(design.garment) + priceDelta;
  if (design.back && design.back.length > 0) price += BACK_PRINT_FEE;
  if (["2XL", "3XL", "4XL"].includes(size)) price += PLUS_SIZE_FEE;
  return Math.round(price * 100) / 100;
}

export function shippingFor(subtotal: number) {
  return subtotal >= FREE_SHIPPING_OVER || subtotal === 0 ? 0 : FLAT_SHIPPING;
}

export function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
