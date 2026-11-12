import type { Design } from "./types";

const KEY = "zaz-studio-draft";

export function saveStudioDraft(d: Design) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    /* ignore */
  }
}

export function loadStudioDraft(): Design | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Design) : null;
  } catch {
    return null;
  }
}
