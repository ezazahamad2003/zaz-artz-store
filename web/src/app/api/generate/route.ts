import { NextResponse } from "next/server";
import { z } from "zod";
import { aiConfigured, generateImage, restyleImage } from "@/lib/ai";
import { uploadBlob, dataUrlToBuffer } from "@/lib/blob";

export const runtime = "nodejs";
export const maxDuration = 120;

const Body = z.object({
  prompt: z.string().max(600).default(""),
  style: z.string().max(300).default(""),
  photo: z.string().max(15_000_000).nullable().optional(),
  darkGarment: z.boolean().optional(),
});

const BLOCKED = /\b(nike|adidas|disney|pokemon|pikachu|naruto|goku|mickey|marvel|batman|spider-?man|hello kitty|gucci|supreme|nazi|swastika)\b/i;

export async function POST(req: Request) {
  if (!aiConfigured()) {
    return NextResponse.json({ error: "AI generation is not configured on this server." }, { status: 503 });
  }
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const { prompt, style, photo } = parsed.data;
  if (BLOCKED.test(prompt)) {
    return NextResponse.json({ error: "We can't print trademarked characters or brands. Describe an original idea instead." }, { status: 422 });
  }
  const full = [prompt, style].filter(Boolean).join(". ");
  try {
    let png: Buffer;
    if (photo) {
      const { buffer } = dataUrlToBuffer(photo);
      png = await restyleImage(
        buffer,
        `Redraw the subject of this photo as an original illustration. ${full || "stylized illustration"}. Keep the likeness recognizable.`,
      );
    } else {
      png = await generateImage(full, { quality: "medium", transparent: true });
    }
    const name = `ai/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.png`;
    const url = await uploadBlob("designs", name, png, "image/png");
    return NextResponse.json({ url, aspect: 1 });
  } catch (e) {
    const msg = (e as Error).message ?? "Generation failed";
    const safety = /safety|content_policy|moderation/i.test(msg);
    return NextResponse.json(
      { error: safety ? "That prompt was blocked by the safety filter. Try different wording." : msg },
      { status: safety ? 422 : 500 },
    );
  }
}
