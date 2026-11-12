import { NextResponse } from "next/server";
import { ideas } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const topic = String(body.topic ?? "").slice(0, 120) || "custom tee";
  try {
    return NextResponse.json({ ideas: await ideas(topic) });
  } catch (e) {
    return NextResponse.json({ ideas: [], error: (e as Error).message }, { status: 500 });
  }
}
