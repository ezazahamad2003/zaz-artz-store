/** Re-encode all generated photos as 1024px JPEG (q82) and re-upload. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import sharp from "sharp";
config({ path: path.resolve(process.cwd(), ".env.local") });
const { uploadBlob } = await import("../src/lib/blob");
const file = path.resolve(process.cwd(), "src/lib/generated-photos.json");
const map: Record<string, string> = JSON.parse(readFileSync(file, "utf8"));
let before = 0, after = 0;
const keys = Object.keys(map).filter((k) => map[k].endsWith(".png"));
let i = 0;
async function worker() {
  while (i < keys.length) {
    const k = keys[i++];
    const res = await fetch(map[k]);
    const png = Buffer.from(await res.arrayBuffer());
    const jpg = await sharp(png).resize(1024, 1024, { fit: "cover" }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    before += png.length; after += jpg.length;
    map[k] = await uploadBlob("products", `photos/${k}.jpg`, jpg, "image/jpeg");
    writeFileSync(file, JSON.stringify(map, null, 2) + "\n");
    console.log(`✓ ${k} ${Math.round(png.length / 1024)}K → ${Math.round(jpg.length / 1024)}K`);
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
console.log(`Done: ${Math.round(before / 1048576)}MB → ${Math.round(after / 1048576)}MB`);
