import { notFound } from "next/navigation";
import { TEMPLATES, templateBySlug, templatesInCollection, collectionBySlug } from "@/lib/catalog";
import ProductConfigurator from "@/components/ProductConfigurator";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const t = templateBySlug(slug);
  return { title: t ? `${t.name} · ZAZ ARTZ` : "Product", description: t?.description };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const t = templateBySlug(slug);
  if (!t) notFound();
  const col = collectionBySlug(t.collection);
  const related = templatesInCollection(t.collection).filter((x) => x.slug !== t.slug).slice(0, 4);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <ProductConfigurator template={t} collectionName={col ? `${col.emoji} ${col.name}` : ""} />
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-4xl">More from {col?.name}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.slug} template={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
