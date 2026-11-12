import { notFound } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { COLLECTIONS, collectionBySlug, templatesInCollection } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/collections/[slug]">) {
  const { slug } = await props.params;
  const c = collectionBySlug(slug);
  return { title: c ? `${c.name} · ZAZ ARTZ` : "Collection" };
}

export default async function CollectionPage(props: PageProps<"/collections/[slug]">) {
  const { slug } = await props.params;
  const c = collectionBySlug(slug);
  if (!c) notFound();
  const items = templatesInCollection(slug);
  return (
    <div>
      <section className="border-b border-line" style={{ background: `linear-gradient(135deg, ${c.accent}26, transparent 55%)` }}>
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="text-5xl">{c.emoji}</div>
          <h1 className="mt-3 text-6xl md:text-8xl">{c.name}</h1>
          <p className="mt-4 max-w-2xl text-fg-2">{c.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="chip" style={{ borderColor: c.accent, color: c.accent }}>🔥 Trending: {c.trending}</span>
            {c.season && <span className="chip">{c.season}</span>}
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t) => (
            <ProductCard key={t.slug} template={t} />
          ))}
          <Link href={`/studio`} className="card flex flex-col items-center justify-center gap-3 p-8 text-center transition hover:border-acid">
            <Sparkles className="text-acid" />
            <div className="font-semibold">Nothing fits? Make your own.</div>
            <div className="text-sm text-fg-2">Open the studio with a blank {c.name.toLowerCase()} canvas.</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
