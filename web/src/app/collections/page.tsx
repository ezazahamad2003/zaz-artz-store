import { COLLECTIONS } from "@/lib/catalog";
import CollectionCard from "@/components/CollectionCard";

export const metadata = { title: "Collections · ZAZ ARTZ" };

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="label">Researched, not guessed</div>
      <h1 className="text-6xl">COLLECTIONS</h1>
      <p className="mt-3 max-w-2xl text-fg-2">
        Ten genres built from what is actually selling in custom apparel this season: matching holiday sets,
        bootleg couple tees, AI anime portraits, pet parents, nostalgia and group orders.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {COLLECTIONS.map((c) => (
          <CollectionCard key={c.slug} c={c} />
        ))}
      </div>
    </div>
  );
}
