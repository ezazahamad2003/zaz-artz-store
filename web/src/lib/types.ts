export type GarmentId =
  | "tee"
  | "heavy-tee"
  | "oversized-tee"
  | "longsleeve"
  | "hoodie"
  | "crewneck"
  | "zip-hoodie"
  | "joggers"
  | "camp-shirt"
  | "pj-set";

export interface Garment {
  id: GarmentId;
  name: string;
  short: string;
  description: string;
  fabric: string;
  basePrice: number;
  colors: string[]; // color ids
  sizes: string[];
  hasBack: boolean;
}

export interface GarmentColor {
  id: string;
  name: string;
  hex: string;
  dark: boolean;
}

export type LayerType = "text" | "image";

export interface BaseLayer {
  id: string;
  type: LayerType;
  /** center x/y as fraction (0-1) of the print area */
  x: number;
  y: number;
  /** width as fraction of print area width */
  w: number;
  rotation: number;
}

export interface TextLayer extends BaseLayer {
  type: "text";
  text: string;
  font: string;
  color: string;
  weight?: number;
  letterSpacing?: number;
  stroke?: string;
  uppercase?: boolean;
  italic?: boolean;
  curve?: number; // -1..1 arc amount
}

export interface ImageLayer extends BaseLayer {
  type: "image";
  src: string;
  /** aspect ratio h/w, used to size the image */
  aspect: number;
  source: "upload" | "ai" | "template";
  prompt?: string;
}

export type Layer = TextLayer | ImageLayer;

export interface Design {
  id: string;
  garment: GarmentId;
  color: string;
  front: Layer[];
  back: Layer[];
  createdAt: string;
  templateSlug?: string;
  previewUrl?: string;
}

export type Side = "front" | "back";

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  emoji: string;
  trending: string;
  season?: string;
}

export interface Placeholder {
  key: string;
  label: string;
  default: string;
  maxLength?: number;
}

export interface Template {
  slug: string;
  name: string;
  collection: string;
  description: string;
  tags: string[];
  garment: GarmentId;
  color: string;
  front: Layer[];
  back?: Layer[];
  placeholders?: Placeholder[];
  /** optional AI image to generate at seed time */
  aiPrompt?: string;
  bestseller?: boolean;
  priceDelta?: number;
}

export interface CartItem {
  id: string;
  design: Design;
  size: string;
  qty: number;
  name: string;
  unitPrice: number;
}

export interface Order {
  id: string;
  pk: string;
  status: "pending_payment" | "paid" | "in_production" | "shipped" | "cancelled";
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  notes?: string;
  createdAt: string;
  stripeSessionId?: string;
}
