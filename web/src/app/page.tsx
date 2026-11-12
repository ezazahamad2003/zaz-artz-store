import Link from "next/link";
import { ArrowRight, Sparkles, Upload, Truck, Shirt } from "lucide-react";
import { BESTSELLERS, COLLECTIONS, GARMENTS, TEMPLATES, photoFor } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import CollectionCard from "@/components/CollectionCard";
import GarmentMockup from "@/components/GarmentMockup";
import { money } from "@/lib/pricing";

/* eslint-disable @next/next/no-img-element */

function Photo({ k, alt, className }: { k: string; alt: string; className?: string }) {
  const src = photoFor(k);
  if (!src) return <div className={`bg-bg-3 ${className ?? ""}`} />;
  return <img src={src} alt={alt} className={`object-cover ${className ?? ""}`} />;
}

export default function Home() {
  const newest = TEMPLATES.slice(-8).reverse();
  return (
    <div>
      {/* hero */}
      <section className="border-b border-line bg-bg-2">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-[1.05fr_1fr] md:py-20">
          <div>
            <div className="chip border-acid text-acid">Holiday collection · ships by Dec 20</div>
            <h1 className="mt-5 text-6xl leading-[0.98] md:text-7xl">
              Your idea,<br />printed on<br /><span className="text-acid">whatever you wear.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-fg-2">
              Tees, heavyweights, hoodies, crewnecks, joggers, camp shirts and matching pajama sets.
              Type it, upload it, or let the studio draw it. Printed one at a time, in the US.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/studio" className="btn btn-acid text-base"><Sparkles size={18} /> Open the studio</Link>
              <Link href="/collections" className="btn btn-ghost text-base">Shop collections <ArrowRight size={18} /></Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-fg-2">
              <span className="flex items-center gap-2"><Shirt size={16} className="text-acid" /> 10 garments · 17 colors</span>
              <span className="flex items-center gap-2"><Upload size={16} className="text-acid" /> Photo to print in seconds</span>
              <span className="flex items-center gap-2"><Truck size={16} className="text-acid" /> Free shipping over $75</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Photo k="hero-main" alt="Couple in custom crewnecks" className="col-span-2 aspect-[16/10] w-full rounded-2xl" />
            <Photo k="hero-family" alt="Family in matching pajamas" className="aspect-square w-full rounded-2xl" />
            <Photo k="hero-anime" alt="Anime print hoodie" className="aspect-square w-full rounded-2xl" />
          </div>
        </div>
      </section>

      {/* collections */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="label">What is selling right now</div>
            <h2 className="text-5xl">Trending collections</h2>
          </div>
          <Link href="/collections" className="hidden text-sm text-fg-2 hover:text-fg md:block">All collections →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {COLLECTIONS.slice(0, 7).map((c, i) => <CollectionCard key={c.slug} c={c} big={i === 0} />)}
        </div>
      </section>

      {/* bestsellers */}
      <section className="border-y border-line bg-bg-2">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-8">
            <div className="label">Proven layouts, your words</div>
            <h2 className="text-5xl">Bestsellers</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BESTSELLERS.slice(0, 8).map((t) => <ProductCard key={t.slug} template={t} />)}
          </div>
        </div>
      </section>

      {/* new arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="label">Just dropped</div>
            <h2 className="text-5xl">New arrivals</h2>
          </div>
          <span className="hidden text-sm text-fg-2 md:block">{TEMPLATES.length} designs in the catalog</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {newest.map((t) => <ProductCard key={t.slug} template={t} />)}
        </div>
      </section>

      {/* how it works */}
      <section className="border-y border-line bg-bg-2">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2">
          <Photo k="hero-studio" alt="Folded custom tees and hoodies" className="aspect-[4/3] w-full rounded-2xl" />
          <div>
            <h2 className="text-5xl">How it works</h2>
            <ol className="mt-6 space-y-5">
              {[
                ["Pick a blank", "Tee to PJ set, 17 garment colors. Heavyweight and oversized cuts included."],
                ["Make the design", "Start from a template and change the words, type your own, upload a photo, or describe it to the AI."],
                ["See it live", "Front and back preview on the real garment shape. Drag, resize, rotate."],
                ["We print & ship", "Printed on demand in the US in 3 to 5 business days, tracked shipping."],
              ].map(([h, p], i) => (
                <li key={h} className="flex gap-4">
                  <span className="display flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-acid text-lg text-white">{i + 1}</span>
                  <div><div className="font-semibold">{h}</div><p className="text-sm text-fg-2">{p}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* garments */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="label">Start from a blank</div>
            <h2 className="text-5xl">The garments</h2>
          </div>
          <Link href="/garments" className="hidden text-sm text-fg-2 hover:text-fg md:block">Details & sizing →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {GARMENTS.map((g) => (
            <Link key={g.id} href={`/studio?garment=${g.id}`} className="card group p-3 transition hover:border-acid">
              <GarmentMockup garment={g.id} color={g.id === "pj-set" ? "red" : "white"} layers={[]} className="w-full" />
              <div className="mt-2 text-sm font-medium group-hover:text-acid">{g.name}</div>
              <div className="text-xs text-fg-2">from {money(g.basePrice)}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-4">
        <div className="rounded-2xl bg-acid p-10 text-center text-white md:p-16">
          <h2 className="text-5xl md:text-7xl">Surprise someone.</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            A bootleg tee of your partner. The dog as a renaissance duke. Grandma&apos;s name across the family pajamas. It takes about two minutes.
          </p>
          <Link href="/studio" className="btn mt-8 bg-white text-acid hover:bg-bg-2 text-base"><Sparkles size={18} /> Start designing</Link>
        </div>
      </section>
    </div>
  );
}
