import { Suspense } from "react";
import Studio from "@/components/Studio";

export const metadata = { title: "Design Studio · ZAZ ARTZ" };

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="p-10 text-fg-2">Loading studio…</div>}>
      <Studio />
    </Suspense>
  );
}
