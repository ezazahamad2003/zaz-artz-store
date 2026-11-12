/**
 * Generates a photorealistic product photo for every template (and a few
 * hero/lifestyle shots), uploads to the `products` container and writes the
 * URL map to src/lib/generated-photos.json.
 *
 *   npx tsx scripts/seed-photos.mts            # missing only
 *   npx tsx scripts/seed-photos.mts --force    # regenerate all
 *   npx tsx scripts/seed-photos.mts slug1 slug2
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { config } from "dotenv";
config({ path: path.resolve(process.cwd(), ".env.local") });

const { TEMPLATES, GARMENTS, colorById, fillTemplate } = await import("../src/lib/catalog");
const { generateImage } = await import("../src/lib/ai");
const { uploadBlob } = await import("../src/lib/blob");
type Template = (typeof TEMPLATES)[number];

const file = path.resolve(process.cwd(), "src/lib/generated-photos.json");
const map: Record<string, string> = JSON.parse(readFileSync(file, "utf8"));
const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));
const CONCURRENCY = 3;

const GARMENT_WORDS: Record<string, string> = {
  tee: "classic cotton t-shirt",
  "heavy-tee": "heavyweight boxy garment-dyed t-shirt with a vintage wash",
  "oversized-tee": "oversized drop-shoulder streetwear t-shirt",
  longsleeve: "long sleeve cotton t-shirt",
  hoodie: "heavyweight pullover hoodie with kangaroo pocket",
  crewneck: "relaxed fleece crewneck sweatshirt",
  "zip-hoodie": "full-zip fleece hoodie",
  joggers: "fleece jogger sweatpants",
  "camp-shirt": "short sleeve camp collar button-up shirt",
  "pj-set": "matching long sleeve pajama set (top and pants)",
};

const SCENES = [
  "flat lay on a white linen surface, soft natural window light, gentle shadow",
  "hanging on a natural wooden hanger against a warm off-white plaster wall, soft daylight",
  "worn by a person photographed from the shoulders down (no face visible) against a clean white studio backdrop, soft diffused light",
  "folded neatly on a light oak table next to a small ceramic cup, overhead shot, bright and airy",
  "flat lay on a pale grey concrete surface, soft shadow, editorial product photography",
];

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

function describe(t: Template) {
  const g = GARMENTS.find((x) => x.id === t.garment)!;
  const c = colorById(t.color);
  const defaults = Object.fromEntries((t.placeholders ?? []).map((p) => [p.key, p.default]));
  const layers = fillTemplate(t.front, defaults);
  const texts = layers.filter((l) => l.type === "text").map((l) => (l.type === "text" ? `"${l.uppercase ? l.text.toUpperCase() : l.text}" (in ${l.font} style lettering, ${l.color === "#ffffff" ? "white" : l.color === "#141416" ? "black" : "colored " + l.color})` : ""));
  const art = t.aiPrompt ? `an illustration of ${t.aiPrompt.replace(/,? ?(plain transparent background|no text|t-shirt print|sticker style[^,]*|thick white outline)/gi, "").trim()}` : "";
  const parts = [art, texts.length ? `the text ${texts.join(" above ")}` : ""].filter(Boolean).join(", and below it ");
  const scene = SCENES[hash(t.slug) % SCENES.length];
  return `Professional e-commerce product photograph of a ${c.name.toLowerCase().replace(/ \(.*\)/, "")} ${GARMENT_WORDS[g.id]}, ${scene}. The garment is printed on the chest with ${parts}. The printed text must be spelled exactly as given. Photorealistic, crisp fabric texture, shot on a full-frame camera with a 50mm lens, shallow depth of field, color-accurate, catalog quality. No mannequin, no extra props with text, no watermark.`;
}

const EXTRA: { key: string; prompt: string }[] = [
  { key: "hero-main", prompt: "Editorial lifestyle photograph of a young couple laughing on a city rooftop at golden hour, both wearing custom printed crewneck sweatshirts in off-white and deep red with simple script lettering, natural light, 85mm lens, candid, warm tones, photorealistic" },
  { key: "hero-studio", prompt: "Overhead flat lay of several folded custom printed t-shirts and hoodies in red, white, cream and black on a white linen surface, with a pair of scissors and a sketchbook, soft daylight, editorial product photography, photorealistic" },
  { key: "hero-family", prompt: "Cozy living-room photograph of two adults in matching red and cream Christmas pajama sets sitting by a decorated tree with mugs of cocoa, soft warm lamp light, candid, 35mm lens, photorealistic" },
  { key: "hero-anime", prompt: "Street style photograph of a young person from the shoulders down wearing a black heavyweight hoodie with a colorful original anime character print on the chest, Tokyo night street bokeh behind, 50mm lens, photorealistic" },
];

const jobs: { key: string; prompt: string }[] = [
  ...EXTRA.map((e) => ({ key: e.key, prompt: e.prompt })),
  ...TEMPLATES.map((t) => ({ key: t.slug, prompt: describe(t) })),
].filter((j) => (force || !map[j.key]) && (only.length === 0 || only.includes(j.key)));

console.log(`Generating ${jobs.length} photos with concurrency ${CONCURRENCY}…`);
let i = 0;
let ok = 0;
async function worker() {
  while (i < jobs.length) {
    const job = jobs[i++];
    const started = Date.now();
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const png = await generateImage(job.prompt, { quality: "medium", transparent: false });
        const url = await uploadBlob("products", `photos/${job.key}.png`, png, "image/png");
        map[job.key] = url;
        writeFileSync(file, JSON.stringify(map, null, 2) + "\n");
        ok++;
        console.log(`✓ ${job.key} (${Math.round((Date.now() - started) / 1000)}s) [${ok}/${jobs.length}]`);
        break;
      } catch (e) {
        const msg = (e as Error).message;
        console.error(`✗ ${job.key} attempt ${attempt}: ${msg.slice(0, 120)}`);
        if (attempt < 3) await new Promise((r) => setTimeout(r, 20000 * attempt));
      }
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`Done. ${ok}/${jobs.length} photos.`);
