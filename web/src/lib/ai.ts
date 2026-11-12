import { AzureOpenAI } from "openai";

const API_VERSION = "2025-04-01-preview";

function client() {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  if (!endpoint || !apiKey) return null;
  return new AzureOpenAI({ endpoint, apiKey, apiVersion: API_VERSION });
}

export const aiConfigured = () =>
  Boolean(process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY);

const PRINT_SUFFIX =
  " Designed as an isolated t-shirt print graphic: centered subject cut out on a fully transparent background with no backdrop, no glow, no gradient, no mockup, no shirt, no watermark, no text unless asked.";

/** Generate a print graphic. Returns PNG bytes. */
export async function generateImage(
  prompt: string,
  opts: { size?: "1024x1024" | "1024x1536" | "1536x1024"; quality?: "low" | "medium" | "high"; transparent?: boolean } = {},
): Promise<Buffer> {
  const c = client();
  if (!c) throw new Error("Azure OpenAI is not configured");
  const deployment = process.env.AZURE_OPENAI_IMAGE_DEPLOYMENT ?? "zaz-image";
  const res = await c.images.generate({
    model: deployment,
    prompt: prompt + PRINT_SUFFIX,
    n: 1,
    size: opts.size ?? "1024x1024",
    quality: opts.quality ?? "medium",
    output_format: "png",
    background: opts.transparent === false ? "opaque" : "transparent",
  });
  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image returned");
  return Buffer.from(b64, "base64");
}

/** Restyle an uploaded photo (anime me, pet portrait, etc.). Returns PNG bytes. */
export async function restyleImage(image: Buffer, prompt: string): Promise<Buffer> {
  const c = client();
  if (!c) throw new Error("Azure OpenAI is not configured");
  const deployment = process.env.AZURE_OPENAI_IMAGE_DEPLOYMENT ?? "zaz-image";
  const file = new File([new Uint8Array(image)], "photo.png", { type: "image/png" });
  const res = await c.images.edit({
    model: deployment,
    image: file,
    prompt: prompt + PRINT_SUFFIX,
    n: 1,
    size: "1024x1024",
    quality: "medium",
    output_format: "png",
    background: "transparent",
  });
  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image returned");
  return Buffer.from(b64, "base64");
}

/** Slogan / design idea helper using the text deployment. */
export async function ideas(topic: string, count = 6): Promise<string[]> {
  const c = client();
  if (!c) {
    return [
      `${topic} club`,
      `${topic} era`,
      `powered by ${topic}`,
      `${topic} · est. 2026`,
      `certified ${topic} enjoyer`,
      `in my ${topic} phase`,
    ].slice(0, count);
  }
  const deployment = process.env.AZURE_OPENAI_TEXT_DEPLOYMENT ?? "zaz-text";
  const res = await c.chat.completions.create({
    model: deployment,
    messages: [
      {
        role: "system",
        content:
          "You write short, punchy, sellable t-shirt slogans (max 6 words each). Avoid trademarks, brand names and copyrighted character names. Return a JSON array of strings only.",
      },
      { role: "user", content: `Topic: ${topic}. Give ${count} slogans.` },
    ],
    max_completion_tokens: 1500,
    reasoning_effort: "low",
  });
  const text = res.choices[0]?.message?.content ?? "[]";
  try {
    const arr = JSON.parse(text.replace(/```json|```/g, "").trim());
    if (Array.isArray(arr)) return arr.map(String).slice(0, count);
  } catch {
    /* fall through */
  }
  return text
    .split("\n")
    .map((s) => s.replace(/^[-*\d.\s"]+|"$/g, "").trim())
    .filter(Boolean)
    .slice(0, count);
}
