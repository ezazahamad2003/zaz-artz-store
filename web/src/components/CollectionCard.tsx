import Link from "next/link";
import type { Collection } from "@/lib/types";
import { templatesInCollection } from "@/lib/catalog";

export default function CollectionCard({ c, big }: { c: Collection; big?: boolean }) {
  const count = templatesInCollection(c.slug).length;
  return (
    <Link
      href={`/collections/${c.slug}`}
      className={`card group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:border-fg/40 ${big ? "md:col-span-2 md:row-span-2 md:p-8" : ""}`}
      style={{ background: `linear-gradient(135deg, ${c.accent}22, transparent 60%), var(--bg-2)` }}
    >
      <div className="text-4xl">{c.emoji}</div>
      <div className={`display mt-3 leading-none ${big ? "text-5xl md:text-7xl" : "text-3xl"}`}>{c.name}</div>
      <p className="mt-2 text-sm text-fg-2">{c.tagline}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="chip" style={{ borderColor: c.accent, color: c.accent }}>🔥 {c.trending}</span>
        <span className="chip">{count} designs</span>
        {c.season && <span className="chip">{c.season}</span>}
      </div>
    </Link>
  );
}
