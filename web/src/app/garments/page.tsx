import Link from "next/link";
import { GARMENTS, COLORS } from "@/lib/catalog";
import GarmentMockup from "@/components/GarmentMockup";
import { money } from "@/lib/pricing";

export const metadata = { title: "Blank garments · ZAZ ARTZ" };

export default function GarmentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="label">Start from a blank</div>
      <h1 className="text-6xl">THE GARMENTS</h1>
      <p className="mt-3 max-w-2xl text-fg-2">
        Every piece is printed on demand with water-based direct-to-garment or DTF transfer inks, cured for wash durability.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {GARMENTS.map((g) => (
          <div key={g.id} className="card grid gap-4 p-5 sm:grid-cols-[180px_1fr]">
            <div className="rounded-xl bg-bg-3 p-2">
              <GarmentMockup garment={g.id} color={g.id === "pj-set" ? "red" : "pepper"} layers={[]} className="w-full" />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <h2 className="text-3xl">{g.name}</h2>
                <span className="display text-2xl text-acid">{money(g.basePrice)}</span>
              </div>
              <p className="mt-1 text-sm text-fg-2">{g.description}</p>
              <div className="mt-2 text-xs text-fg-2">{g.fabric}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {g.colors.map((cid) => {
                  const c = COLORS.find((x) => x.id === cid)!;
                  return <span key={cid} title={c.name} className="h-5 w-5 rounded-full border border-line" style={{ background: c.hex }} />;
                })}
              </div>
              <div className="mt-3 text-xs text-fg-2">Sizes: {g.sizes.join(" · ")}</div>
              <Link href={`/studio?garment=${g.id}`} className="btn btn-ghost mt-4">Design on this</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
