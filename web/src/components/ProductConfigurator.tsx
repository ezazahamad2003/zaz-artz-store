"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Upload, ShoppingBag } from "lucide-react";
import type { Design, GarmentId, Layer, Template } from "@/lib/types";
import { COLORS, GARMENTS, colorById, fillTemplate, garmentById, photoFor } from "@/lib/catalog";
import { designPrice, money, BACK_PRINT_FEE } from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import GarmentMockup from "./GarmentMockup";
import { saveStudioDraft } from "@/lib/studio-draft";

function newId() {
  return `d_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export default function ProductConfigurator({ template, collectionName }: { template: Template; collectionName: string }) {
  const router = useRouter();
  const cart = useCart();
  const [garmentId, setGarmentId] = useState(template.garment);
  const [color, setColor] = useState(template.color);
  const [size, setSize] = useState("M");
  const [side, setSide] = useState<"front" | "back">("front");
  const photo = photoFor(template.slug);
  const [view, setView] = useState<"photo" | "preview">(photo ? "photo" : "preview");
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries((template.placeholders ?? []).map((p) => [p.key, p.default])),
  );
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  const garment = garmentById(garmentId);
  const needsPhoto = template.front.some((l) => l.type === "image" && l.source === "upload");

  const applyUploads = (layers: Layer[]): Layer[] =>
    layers.map((l) => (l.type === "image" && l.source === "upload" && uploads[l.id] ? { ...l, src: uploads[l.id], source: "upload" } : l));

  const front = useMemo(() => applyUploads(fillTemplate(template.front, values)), [template, values, uploads]); // eslint-disable-line react-hooks/exhaustive-deps
  const back = useMemo(() => (template.back ? applyUploads(fillTemplate(template.back, values)) : []), [template, values, uploads]); // eslint-disable-line react-hooks/exhaustive-deps

  const design: Design = useMemo(
    () => ({ id: newId(), garment: garmentId, color, front, back: garment.hasBack ? back : [], createdAt: new Date().toISOString(), templateSlug: template.slug }),
    [garmentId, color, front, back, garment.hasBack, template.slug],
  );
  const price = designPrice(design, size, template.priceDelta);

  const onUpload = (layerId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result);
      const im = new Image();
      im.onload = () => setUploads((u) => ({ ...u, [layerId]: src }));
      im.src = src;
    };
    reader.readAsDataURL(file);
  };

  const addToCart = () => {
    cart.add(design, size, template.name, 1, template.priceDelta);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const openInStudio = () => {
    saveStudioDraft(design);
    router.push("/studio?draft=1");
  };

  const availableColors = COLORS.filter((c) => garment.colors.includes(c.id));
  const pickGarment = (id: GarmentId) => {
    setGarmentId(id);
    const ng = garmentById(id);
    if (!ng.colors.includes(color)) setColor(ng.colors[0]);
    if (!ng.sizes.includes(size)) setSize(ng.sizes.includes("M") ? "M" : ng.sizes[0]);
    if (!ng.hasBack) setSide("front");
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="sticky top-28 space-y-3">
          <div className="card overflow-hidden bg-bg-3">
            {view === "photo" && photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={template.name} className="aspect-square w-full object-cover" />
            ) : (
              <div className="p-6"><GarmentMockup garment={garmentId} color={color} layers={side === "front" ? front : back} side={side} className="w-full" /></div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {photo && (
              <button onClick={() => setView("photo")} className={`chip ${view === "photo" ? "border-acid text-acid" : ""}`}>Product photo</button>
            )}
            <button onClick={() => { setView("preview"); setSide("front"); }} className={`chip ${view === "preview" && side === "front" ? "border-acid text-acid" : ""}`}>Live preview · front</button>
            {garment.hasBack && (template.back?.length ?? 0) > 0 && (
              <button onClick={() => { setView("preview"); setSide("back"); }} className={`chip ${view === "preview" && side === "back" ? "border-acid text-acid" : ""}`}>Live preview · back</button>
            )}
          </div>
          <p className="text-center text-xs text-fg-2/70">The live preview updates as you personalize. Photo shows the default wording.</p>
        </div>
      </div>

      <div>
        <div className="text-sm text-fg-2">{collectionName}</div>
        <h1 className="mt-1 text-5xl leading-none md:text-6xl">{template.name}</h1>
        <p className="mt-3 text-fg-2">{template.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {template.tags.map((t) => <span key={t} className="chip">{t}</span>)}
        </div>

        <div className="mt-6 flex items-baseline gap-3">
          <span className="display text-5xl text-acid">{money(price)}</span>
          {back.length > 0 && <span className="text-sm text-fg-2">includes back print (+{money(BACK_PRINT_FEE)})</span>}
        </div>

        {(template.placeholders?.length ?? 0) > 0 && (
          <div className="card mt-8 p-5">
            <div className="label">Personalize</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {template.placeholders!.map((p) => (
                <div key={p.key}>
                  <label className="mb-1 block text-xs text-fg-2">{p.label}</label>
                  <input className="input" maxLength={p.maxLength ?? 30} value={values[p.key] ?? ""} onChange={(e) => { setView("preview"); setValues((v) => ({ ...v, [p.key]: e.target.value })); }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {needsPhoto && (
          <div className="card mt-4 p-5">
            <div className="label">Your photo</div>
            {template.front.filter((l) => l.type === "image" && l.source === "upload").map((l) => (
              <label key={l.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-line p-4 text-sm text-fg-2 hover:border-acid">
                <Upload size={18} className="text-acid" />
                {uploads[l.id] ? "Photo added. Click to replace." : "Upload a JPG or PNG. High-res, good light, face visible."}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(l.id, e.target.files[0])} />
              </label>
            ))}
            <p className="mt-2 text-xs text-fg-2/70">Want it redrawn as anime, pop art or a painting? Open in the studio and use AI restyle.</p>
          </div>
        )}

        <div className="mt-6">
          <div className="label">Garment</div>
          <div className="flex flex-wrap gap-2">
            {GARMENTS.filter((g) => g.id !== "pj-set" || template.garment === "pj-set").map((g) => (
              <button key={g.id} onClick={() => pickGarment(g.id)} className={`chip hover:border-fg ${g.id === garmentId ? "border-acid text-acid" : ""}`}>
                {g.short} · {money(g.basePrice)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="label">Color · {colorById(color).name}</div>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((c) => (
              <button key={c.id} title={c.name} onClick={() => setColor(c.id)} className={`h-8 w-8 rounded-full border-2 ${c.id === color ? "border-acid" : "border-line"}`} style={{ background: c.hex }} />
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="label">Size</div>
          <div className="flex flex-wrap gap-2">
            {garment.sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)} className={`chip hover:border-fg ${s === size ? "border-acid text-acid" : ""}`}>{s}</button>
            ))}
          </div>
          <Link href="/how-it-works#sizing" className="mt-2 inline-block text-xs text-fg-2 underline">Size guide</Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={addToCart} className="btn btn-acid text-base">
            {added ? <><Check size={18} /> Added</> : <><ShoppingBag size={18} /> Add to cart · {money(price)}</>}
          </button>
          <button onClick={openInStudio} className="btn btn-ghost text-base">
            <Sparkles size={18} /> Customize further
          </button>
        </div>
        <p className="mt-3 text-xs text-fg-2/70">Printed on demand in 3 to 5 business days. Free US shipping over $75.</p>
      </div>
    </div>
  );
}
