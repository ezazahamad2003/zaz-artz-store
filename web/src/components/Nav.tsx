"use client";

import Link from "next/link";
import { ShoppingBag, Sparkles, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import { COLLECTIONS } from "@/lib/catalog";

export default function Nav() {
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <div className="bg-acid text-white text-xs font-semibold tracking-wide overflow-hidden">
        <div className="marquee py-1.5">
          {[0, 1].map((k) => (
            <span key={k} className="flex gap-10 pr-10">
              <span>FREE SHIPPING OVER $75</span>
              <span>CHRISTMAS ORDERS SHIP BY DEC 20 · ORDER BEFORE DEC 12</span>
              <span>AI STUDIO: TURN ANY PHOTO INTO A PRINT</span>
              <span>GROUP ORDERS 10+ GET 15% OFF</span>
              <span>NEW YEAR 2027 CREW TEES LIVE</span>
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="display text-2xl leading-none tracking-wide md:text-3xl">
          ZAZ<span className="text-acid">ARTZ</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-fg-2 md:flex">
          <Link href="/collections" className="hover:text-fg">Collections</Link>
          <Link href="/collections/christmas" className="hover:text-fg">Christmas</Link>
          <Link href="/collections/couples" className="hover:text-fg">Couples</Link>
          <Link href="/collections/anime" className="hover:text-fg">Anime</Link>
          <Link href="/garments" className="hover:text-fg">Blanks</Link>
          <Link href="/how-it-works" className="hover:text-fg">How it works</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/studio" className="btn btn-acid hidden md:inline-flex">
            <Sparkles size={16} /> Design yours
          </Link>
          <Link href="/cart" className="btn btn-ghost relative px-3">
            <ShoppingBag size={18} />
            {ready && count > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-pink px-1.5 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <button className="btn btn-ghost px-3 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line bg-bg-2 px-4 py-4 md:hidden">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/studio" onClick={() => setOpen(false)} className="col-span-2 btn btn-acid">
              <Sparkles size={16} /> Design yours
            </Link>
            {COLLECTIONS.map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`} onClick={() => setOpen(false)} className="rounded-xl border border-line px-3 py-2 text-fg-2">
                {c.emoji} {c.name}
              </Link>
            ))}
            <Link href="/garments" onClick={() => setOpen(false)} className="rounded-xl border border-line px-3 py-2 text-fg-2">👕 Blanks</Link>
            <Link href="/how-it-works" onClick={() => setOpen(false)} className="rounded-xl border border-line px-3 py-2 text-fg-2">❓ How it works</Link>
          </div>
        </div>
      )}
    </header>
  );
}
