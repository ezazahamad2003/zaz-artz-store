import { NextResponse } from "next/server";
import type { Design, Layer } from "@/lib/types";
import { saveDesign, getDesign } from "@/lib/cosmos";
import { uploadBlob, dataUrlToBuffer } from "@/lib/blob";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Move any inline data: images in layers to blob storage so the design document stays small. */
async function externalize(layers: Layer[], designId: string, side: string): Promise<Layer[]> {
  const out: Layer[] = [];
  for (const l of layers) {
    if (l.type === "image" && l.src.startsWith("data:")) {
      const { buffer, contentType } = dataUrlToBuffer(l.src);
      const ext = contentType.includes("png") ? "png" : "jpg";
      const url = await uploadBlob("uploads", `${designId}/${side}-${l.id}.${ext}`, buffer, contentType);
      out.push({ ...l, src: url });
    } else out.push(l);
  }
  return out;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const design = body?.design as Design | undefined;
  if (!design || !design.garment || !Array.isArray(design.front)) {
    return NextResponse.json({ error: "Invalid design" }, { status: 400 });
  }
  const id = design.id?.startsWith("d_") ? design.id : `d_${Date.now().toString(36)}`;
  const doc: Design = {
    ...design,
    id,
    front: await externalize(design.front, id, "front"),
    back: await externalize(design.back ?? [], id, "back"),
    createdAt: new Date().toISOString(),
  };
  if (typeof body.preview === "string" && body.preview.startsWith("data:image/png")) {
    try {
      const { buffer } = dataUrlToBuffer(body.preview);
      doc.previewUrl = await uploadBlob("designs", `${id}/preview.png`, buffer, "image/png");
    } catch {
      /* preview is best-effort */
    }
  }
  const saved = await saveDesign(doc);
  return NextResponse.json({ design: saved });
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const d = await getDesign(id);
  if (!d) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ design: d });
}
