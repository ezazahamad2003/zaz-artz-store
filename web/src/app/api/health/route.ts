import { NextResponse } from "next/server";
import { cosmosConfigured } from "@/lib/cosmos";
import { blobConfigured } from "@/lib/blob";
import { aiConfigured } from "@/lib/ai";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    cosmos: cosmosConfigured(),
    blob: blobConfigured(),
    ai: aiConfigured(),
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    time: new Date().toISOString(),
  });
}
