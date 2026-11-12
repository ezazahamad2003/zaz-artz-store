import Link from "next/link";
import type { Template } from "@/lib/types";
import { fillTemplate, garmentById, collectionBySlug, photoFor } from "@/lib/catalog";
import { money } from "@/lib/pricing";
import GarmentMockup from "./GarmentMockup";

export default function ProductCard({ template }: { template: Template }) {
  const defaults = Object.fromEntries((template.placeholders ?? []).map((p) => [p.key, p.default]));
  const layers = fillTemplate(template.front, defaults);
  const garment = garmentById(template.garment);
  const col = collectionBySlug(template.collection);
  const photo = photoFor(template.slug);
  return (
    <Link href={`/products/${template.slug}`} className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-bg-3">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={template.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="p-4"><GarmentMockup garment={template.garment} color={template.color} layers={layers} className="h-auto w-full" /></div>
        )}
        {template.bestseller && (
          <span className="absolute left-3 top-3 rounded-full bg-acid px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white">Bestseller</span>
        )}
        {template.placeholders && template.placeholders.length > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-fg">Personalize</span>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs text-fg-2">{col?.name} · {garment.short}</div>
        <div className="mt-1 font-medium leading-tight group-hover:text-acid">{template.name}</div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-fg-2">from</span>
          <span className="font-semibold">{money(garment.basePrice + (template.priceDelta ?? 0))}</span>
        </div>
      </div>
    </Link>
  );
}
