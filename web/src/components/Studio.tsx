"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Type, Upload, Sparkles, Trash2, Copy, ArrowUp, ArrowDown, Wand2, Loader2, ShoppingBag, Check, RotateCcw, Lightbulb,
} from "lucide-react";
import type { Design, GarmentId, ImageLayer, Layer, Side, TextLayer } from "@/lib/types";
import { AI_STYLES, COLORS, FONTS, GARMENTS, colorById, garmentById } from "@/lib/catalog";
import { designPrice, money } from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import { loadStudioDraft } from "@/lib/studio-draft";
import GarmentMockup, { printAreaFor } from "./GarmentMockup";

const uid = () => Math.random().toString(36).slice(2, 9);

function newText(color: string): TextLayer {
  return { id: uid(), type: "text", text: "YOUR TEXT", font: "Bebas Neue", color, x: 0.5, y: 0.4, w: 0.8, rotation: 0, weight: 700 };
}

export default function Studio() {
  const params = useSearchParams();
  const router = useRouter();
  const cart = useCart();

  const [garment, setGarment] = useState<GarmentId>((params.get("garment") as GarmentId) || "tee");
  const [color, setColor] = useState("black");
  const [side, setSide] = useState<Side>("front");
  const [layers, setLayers] = useState<Record<Side, Layer[]>>({ front: [], back: [] });
  const [selected, setSelected] = useState<string | null>(null);
  const [size, setSize] = useState("M");
  const [tab, setTab] = useState<"text" | "upload" | "ai">("text");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiStyle, setAiStyle] = useState(AI_STYLES[0].id);
  const [aiPhoto, setAiPhoto] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<string[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const g = garmentById(garment);
  const c = colorById(color);
  const area = printAreaFor(garment, side);
  const cur = layers[side];
  const sel = cur.find((l) => l.id === selected) ?? null;

  /* load draft from product page (sessionStorage -> state, once) */
  useEffect(() => {
    if (!params.get("draft")) return;
    const d = loadStudioDraft();
    if (!d) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGarment(d.garment);
    setColor(d.color);
    setLayers({ front: d.front, back: d.back ?? [] });
  }, [params]);

  const pickGarment = (id: GarmentId) => {
    setGarment(id);
    const ng = garmentById(id);
    if (!ng.colors.includes(color)) setColor(ng.colors[0]);
    if (!ng.sizes.includes(size)) setSize(ng.sizes.includes("M") ? "M" : ng.sizes[0]);
    if (!ng.hasBack && side === "back") { setSide("front"); setSelected(null); }
  };

  const update = useCallback(
    (id: string, patch: Partial<Layer>) =>
      setLayers((ls) => ({ ...ls, [side]: ls[side].map((l) => (l.id === id ? ({ ...l, ...patch } as Layer) : l)) })),
    [side],
  );
  const addLayer = (l: Layer) => {
    setLayers((ls) => ({ ...ls, [side]: [...ls[side], l] }));
    setSelected(l.id);
  };
  const removeLayer = (id: string) => {
    setLayers((ls) => ({ ...ls, [side]: ls[side].filter((l) => l.id !== id) }));
    setSelected(null);
  };
  const move = (id: string, dir: -1 | 1) =>
    setLayers((ls) => {
      const arr = [...ls[side]];
      const i = arr.findIndex((l) => l.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= arr.length) return ls;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...ls, [side]: arr };
    });

  /* drag to move */
  const drag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number } | null>(null);
  const toSvg = (e: React.PointerEvent | PointerEvent) => {
    const svg = svgRef.current!;
    const r = svg.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 400, y: ((e.clientY - r.top) / r.height) * 480 };
  };
  const onLayerDown = (id: string, e: React.PointerEvent) => {
    const l = cur.find((x) => x.id === id);
    if (!l) return;
    const p = toSvg(e);
    drag.current = { id, sx: p.x, sy: p.y, ox: l.x, oy: l.y };
    const moveH = (ev: PointerEvent) => {
      if (!drag.current) return;
      const q = toSvg(ev);
      const nx = drag.current.ox + (q.x - drag.current.sx) / area.w;
      const ny = drag.current.oy + (q.y - drag.current.sy) / area.h;
      update(drag.current.id, { x: Math.min(1.1, Math.max(-0.1, nx)), y: Math.min(1.1, Math.max(-0.1, ny)) });
    };
    const upH = () => {
      drag.current = null;
      window.removeEventListener("pointermove", moveH);
      window.removeEventListener("pointerup", upH);
    };
    window.addEventListener("pointermove", moveH);
    window.addEventListener("pointerup", upH);
  };

  /* uploads */
  const readFile = (file: File) =>
    new Promise<{ src: string; aspect: number }>((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => {
        const src = String(reader.result);
        const im = new Image();
        im.onload = () => res({ src, aspect: im.height / im.width });
        im.onerror = rej;
        im.src = src;
      };
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  const onUpload = async (file: File) => {
    setError(null);
    const { src, aspect } = await readFile(file);
    addLayer({ id: uid(), type: "image", src, aspect, x: 0.5, y: 0.45, w: 0.8, rotation: 0, source: "upload" });
  };

  /* AI */
  const generate = async () => {
    if (!aiPrompt.trim() && !aiPhoto) return;
    setBusy("Drawing your design…");
    setError(null);
    try {
      const style = AI_STYLES.find((s) => s.id === aiStyle)!;
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, style: style.suffix, photo: aiPhoto, darkGarment: c.dark }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      addLayer({ id: uid(), type: "image", src: data.url, aspect: data.aspect ?? 1, x: 0.5, y: 0.45, w: 0.8, rotation: 0, source: "ai", prompt: aiPrompt });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const getIdeas = async () => {
    setBusy("Thinking…");
    try {
      const res = await fetch("/api/ideas", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ topic: aiPrompt || "custom tee" }) });
      const data = await res.json();
      setIdeas(data.ideas ?? []);
    } finally {
      setBusy(null);
    }
  };

  /* export preview PNG */
  const exportPng = async (): Promise<string | null> => {
    const svg = svgRef.current;
    if (!svg) return null;
    try {
      const clone = svg.cloneNode(true) as SVGSVGElement;
      clone.querySelectorAll("[data-hit]").forEach((n) => n.remove());
      const xml = new XMLSerializer().serializeToString(clone);
      const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
      const canvas = document.createElement("canvas");
      canvas.width = 800; canvas.height = 960;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#1d1d27"; ctx.fillRect(0, 0, 800, 960);
      ctx.drawImage(img, 0, 0, 800, 960);
      URL.revokeObjectURL(url);
      return canvas.toDataURL("image/png");
    } catch {
      return null;
    }
  };

  const design: Design = useMemo(
    () => ({ id: `d_${uid()}`, garment, color, front: layers.front, back: g.hasBack ? layers.back : [], createdAt: new Date().toISOString() }),
    [garment, color, layers, g.hasBack],
  );
  const price = designPrice(design, size);
  const empty = layers.front.length === 0 && layers.back.length === 0;

  const addToCart = async () => {
    if (empty) { setError("Add at least one text or image layer first."); return; }
    setBusy("Saving design…");
    setError(null);
    try {
      const preview = await exportPng();
      const res = await fetch("/api/designs", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ design, preview }) });
      const data = await res.json();
      const saved: Design = res.ok && data.design ? data.design : design;
      cart.add(saved, size, `Custom ${g.name}`);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const textColorDefault = c.dark ? "#ffffff" : "#141416";

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
        <div>
          <div className="label">Design studio</div>
          <h1 className="text-4xl leading-none">Make it yours</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="display text-3xl text-acid">{money(price)}</span>
          <button onClick={addToCart} disabled={!!busy} className="btn btn-acid">
            {busy ? <Loader2 className="animate-spin" size={16} /> : added ? <Check size={16} /> : <ShoppingBag size={16} />}
            {added ? "Added" : "Add to cart"}
          </button>
          <button onClick={() => router.push("/cart")} className="btn btn-ghost">Cart ({cart.count})</button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr_340px]">
        {/* left: garment */}
        <aside className="card space-y-5 p-4">
          <div>
            <div className="label">Garment</div>
            <div className="grid grid-cols-2 gap-1.5">
              {GARMENTS.map((x) => (
                <button key={x.id} onClick={() => pickGarment(x.id)} className={`rounded-lg border px-2 py-1.5 text-left text-xs ${x.id === garment ? "border-acid text-acid" : "border-line text-fg-2 hover:border-fg"}`}>
                  {x.short}<div className="text-[10px] opacity-70">{money(x.basePrice)}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="label">Color · {c.name}</div>
            <div className="flex flex-wrap gap-1.5">
              {COLORS.filter((x) => g.colors.includes(x.id)).map((x) => (
                <button key={x.id} title={x.name} onClick={() => setColor(x.id)} className={`h-7 w-7 rounded-full border-2 ${x.id === color ? "border-acid" : "border-line"}`} style={{ background: x.hex }} />
              ))}
            </div>
          </div>
          <div>
            <div className="label">Size</div>
            <div className="flex flex-wrap gap-1.5">
              {g.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`chip ${s === size ? "border-acid text-acid" : ""}`}>{s}</button>
              ))}
            </div>
          </div>
          {g.hasBack && (
            <div>
              <div className="label">Side</div>
              <div className="flex gap-1.5">
                {(["front", "back"] as Side[]).map((s) => (
                  <button key={s} onClick={() => { setSide(s); setSelected(null); }} className={`chip ${s === side ? "border-acid text-acid" : ""}`}>
                    {s} {layers[s].length > 0 && `· ${layers[s].length}`}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-fg-2/70">Back print adds $8.</p>
            </div>
          )}
          <div>
            <div className="label">Layers ({cur.length})</div>
            <ul className="space-y-1">
              {[...cur].reverse().map((l) => (
                <li key={l.id} className={`flex items-center justify-between gap-1 rounded-lg border px-2 py-1 text-xs ${l.id === selected ? "border-acid" : "border-line"}`}>
                  <button className="flex-1 truncate text-left" onClick={() => setSelected(l.id)}>
                    {l.type === "text" ? `T · ${l.text}` : `IMG · ${l.source}`}
                  </button>
                  <button onClick={() => move(l.id, 1)} title="Bring forward"><ArrowUp size={12} /></button>
                  <button onClick={() => move(l.id, -1)} title="Send back"><ArrowDown size={12} /></button>
                  <button onClick={() => removeLayer(l.id)} title="Delete" className="text-pink"><Trash2 size={12} /></button>
                </li>
              ))}
              {cur.length === 0 && <li className="text-xs text-fg-2/60">No layers yet. Add text, a photo, or generate one.</li>}
            </ul>
          </div>
        </aside>

        {/* center: canvas */}
        <section className="card order-first flex flex-col items-center bg-bg-3 p-4 lg:order-none">
          <GarmentMockup
            svgRef={svgRef}
            garment={garment}
            color={color}
            layers={cur}
            side={side}
            showPrintArea
            selectedId={selected}
            onSelect={setSelected}
            onPointerDownLayer={onLayerDown}
            className="w-full max-w-[560px] touch-none select-none"
          />
          <p className="mt-2 text-xs text-fg-2/70">Drag layers to move. Dashed box is the printable area ({side}).</p>
          {error && <div className="mt-3 rounded-xl border border-pink/50 bg-pink/10 px-3 py-2 text-sm text-pink">{error}</div>}
          {busy && <div className="mt-3 flex items-center gap-2 text-sm text-acid"><Loader2 className="animate-spin" size={14} /> {busy}</div>}
        </section>

        {/* right: tools */}
        <aside className="card p-4">
          <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-bg-3 p-1 text-xs">
            {([["text", Type, "Text"], ["upload", Upload, "Upload"], ["ai", Sparkles, "AI"]] as const).map(([k, Icon, label]) => (
              <button key={k} onClick={() => setTab(k)} className={`flex items-center justify-center gap-1 rounded-lg py-2 ${tab === k ? "bg-acid text-white" : "text-fg-2"}`}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {tab === "text" && (
            <div className="space-y-3">
              <button onClick={() => addLayer(newText(textColorDefault))} className="btn btn-ghost w-full"><Type size={16} /> Add text layer</button>
              {sel?.type === "text" ? (
                <TextEditor layer={sel} onChange={(p) => update(sel.id, p)} />
              ) : (
                <p className="text-xs text-fg-2/70">Select a text layer on the garment to edit it.</p>
              )}
              <div className="border-t border-line pt-3">
                <div className="flex items-center justify-between">
                  <div className="label mb-0">Slogan ideas</div>
                  <button onClick={getIdeas} className="chip hover:border-acid"><Lightbulb size={12} /> Suggest</button>
                </div>
                <input className="input mt-2" placeholder="Topic: dog dad, nurse, 2027 trip…" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {ideas.map((i) => (
                    <button key={i} onClick={() => addLayer({ ...newText(textColorDefault), text: i })} className="chip hover:border-acid">{i}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "upload" && (
            <div className="space-y-3">
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-line p-6 text-center text-sm text-fg-2 hover:border-acid">
                <Upload className="text-acid" />
                Drop a PNG or JPG. Transparent PNGs print best.
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
              </label>
              {sel?.type === "image" && <ImageEditor layer={sel} onChange={(p) => update(sel.id, p)} />}
              <p className="text-[11px] text-fg-2/60">Only upload images you have the right to print. Max 10 MB.</p>
            </div>
          )}

          {tab === "ai" && (
            <div className="space-y-3">
              <div>
                <div className="label">Describe the graphic</div>
                <textarea className="input min-h-[80px]" placeholder="a golden retriever astronaut floating with donuts" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
              </div>
              <div>
                <div className="label">Style</div>
                <div className="flex flex-wrap gap-1.5">
                  {AI_STYLES.map((s) => (
                    <button key={s.id} onClick={() => setAiStyle(s.id)} className={`chip ${s.id === aiStyle ? "border-acid text-acid" : "hover:border-fg"}`}>{s.name}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="label">Optional: restyle a photo (anime me, pet portrait)</div>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-line p-3 text-xs text-fg-2 hover:border-acid">
                  <Upload size={14} className="text-acid" />
                  {aiPhoto ? "Photo attached · click to replace" : "Attach a selfie or pet photo"}
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setAiPhoto((await readFile(f)).src); }} />
                </label>
                {aiPhoto && <button onClick={() => setAiPhoto(null)} className="mt-1 text-[11px] text-pink">remove photo</button>}
              </div>
              <button onClick={generate} disabled={!!busy || (!aiPrompt.trim() && !aiPhoto)} className="btn btn-acid w-full">
                {busy ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />} Generate print
              </button>
              {sel?.type === "image" && <ImageEditor layer={sel} onChange={(p) => update(sel.id, p)} />}
              <p className="text-[11px] text-fg-2/60">Powered by Azure OpenAI. Takes 10 to 30 seconds. No brand logos or copyrighted characters.</p>
            </div>
          )}

          {sel && (
            <div className="mt-4 flex gap-2 border-t border-line pt-3">
              <button onClick={() => addLayer({ ...sel, id: uid(), x: Math.min(1, sel.x + 0.05), y: Math.min(1, sel.y + 0.05) })} className="chip hover:border-fg"><Copy size={12} /> Duplicate</button>
              <button onClick={() => update(sel.id, { rotation: 0, x: 0.5 })} className="chip hover:border-fg"><RotateCcw size={12} /> Center</button>
              <button onClick={() => removeLayer(sel.id)} className="chip text-pink hover:border-pink"><Trash2 size={12} /> Delete</button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] text-fg-2"><span>{label}</span><span>{Math.round(value * 100) / 100}</span></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[var(--acid)]" />
    </div>
  );
}

function TextEditor({ layer, onChange }: { layer: TextLayer; onChange: (p: Partial<TextLayer>) => void }) {
  return (
    <div className="space-y-3 rounded-xl border border-line p-3">
      <textarea className="input" rows={2} value={layer.text} onChange={(e) => onChange({ text: e.target.value })} />
      <div>
        <div className="label">Font</div>
        <div className="grid max-h-40 grid-cols-2 gap-1 overflow-auto pr-1">
          {FONTS.map((f) => (
            <button key={f} onClick={() => onChange({ font: f })} style={{ fontFamily: `'${f}'` }} className={`truncate rounded-lg border px-2 py-1 text-left text-sm ${layer.font === f ? "border-acid text-acid" : "border-line hover:border-fg"}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="label">Fill</div>
          <input type="color" value={layer.color} onChange={(e) => onChange({ color: e.target.value })} className="h-9 w-full rounded-lg border border-line bg-bg-3" />
        </div>
        <div>
          <div className="label">Outline</div>
          <div className="flex gap-1">
            <input type="color" value={layer.stroke ?? "#000000"} onChange={(e) => onChange({ stroke: e.target.value })} className="h-9 flex-1 rounded-lg border border-line bg-bg-3" />
            <button onClick={() => onChange({ stroke: undefined })} className="chip">off</button>
          </div>
        </div>
      </div>
      <Slider label="Width" value={layer.w} min={0.2} max={1.1} step={0.01} onChange={(w) => onChange({ w })} />
      <Slider label="Letter spacing" value={layer.letterSpacing ?? 0} min={-0.05} max={0.5} step={0.01} onChange={(letterSpacing) => onChange({ letterSpacing })} />
      <Slider label="Curve" value={layer.curve ?? 0} min={-1} max={1} step={0.05} onChange={(curve) => onChange({ curve })} />
      <Slider label="Rotate" value={layer.rotation} min={-45} max={45} step={1} onChange={(rotation) => onChange({ rotation })} />
      <div className="flex gap-2">
        <button onClick={() => onChange({ uppercase: !layer.uppercase })} className={`chip ${layer.uppercase ? "border-acid text-acid" : ""}`}>AA</button>
        <button onClick={() => onChange({ italic: !layer.italic })} className={`chip italic ${layer.italic ? "border-acid text-acid" : ""}`}>I</button>
      </div>
    </div>
  );
}

function ImageEditor({ layer, onChange }: { layer: ImageLayer; onChange: (p: Partial<ImageLayer>) => void }) {
  return (
    <div className="space-y-3 rounded-xl border border-line p-3">
      <Slider label="Size" value={layer.w} min={0.1} max={1.2} step={0.01} onChange={(w) => onChange({ w })} />
      <Slider label="Rotate" value={layer.rotation} min={-180} max={180} step={1} onChange={(rotation) => onChange({ rotation })} />
      {layer.prompt && <div className="text-[11px] text-fg-2/70">Prompt: {layer.prompt}</div>}
    </div>
  );
}
