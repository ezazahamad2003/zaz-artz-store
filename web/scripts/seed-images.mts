/**
 * Generates the AI artwork for every template that declares an aiPrompt,
 * uploads it to the `products` blob container and writes the URL map to
 * src/lib/generated-images.json. Re-run only for missing keys.
 *
 *   npx tsx scripts/seed-images.mts            # missing only
 *   npx tsx scripts/seed-images.mts --force    # regenerate all
 *   npx tsx scripts/seed-images.mts slug1 slug2
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { config } from "dotenv";
config({ path: path.resolve(process.cwd(), ".env.local") });

const { TEMPLATES } = await import("../src/lib/catalog");
const { generateImage } = await import("../src/lib/ai");
const { uploadBlob } = await import("../src/lib/blob");

const file = path.resolve(process.cwd(), "src/lib/generated-images.json");
const map: Record<string, string> = JSON.parse(readFileSync(file, "utf8"));
const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));

const todo = TEMPLATES.filter((t) => t.aiPrompt && (force || !map[t.slug]) && (only.length === 0 || only.includes(t.slug)));
console.log(`Generating ${todo.length} artworks…`);

for (const t of todo) {
  const started = Date.now();
  try {
    const transparent = !/pattern|panel|grid|painting|portrait of a french/i.test(t.aiPrompt!);
    const png = await generateImage(t.aiPrompt!, { quality: "medium", transparent });
    const url = await uploadBlob("products", `${t.slug}.png`, png, "image/png");
    map[t.slug] = url;
    writeFileSync(file, JSON.stringify(map, null, 2) + "\n");
    console.log(`✓ ${t.slug} (${Math.round((Date.now() - started) / 1000)}s)`);
  } catch (e) {
    console.error(`✗ ${t.slug}: ${(e as Error).message}`);
  }
}
console.log("Done.");
