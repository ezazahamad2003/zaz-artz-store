import Link from "next/link";
import { COLLECTIONS } from "@/lib/catalog";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-bg-2">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="display text-4xl">ZAZ<span className="text-acid">ARTZ</span></div>
          <p className="mt-3 text-sm text-fg-2">
            Custom printed clothing, designed by you, printed on demand and shipped from the US.
          </p>
          <p className="mt-4 text-xs text-fg-2/70">
            Fan-inspired designs are unofficial and not affiliated with any studio, network or brand.
            Do not upload artwork you do not have the rights to print.
          </p>
        </div>
        <div>
          <div className="label">Collections</div>
          <ul className="space-y-1.5 text-sm text-fg-2">
            {COLLECTIONS.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`} className="hover:text-fg">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="label">Shop</div>
          <ul className="space-y-1.5 text-sm text-fg-2">
            <li><Link href="/studio" className="hover:text-fg">Design studio</Link></li>
            <li><Link href="/garments" className="hover:text-fg">Blank garments</Link></li>
            <li><Link href="/how-it-works" className="hover:text-fg">How it works</Link></li>
            <li><Link href="/how-it-works#sizing" className="hover:text-fg">Size guide</Link></li>
            <li><Link href="/how-it-works#groups" className="hover:text-fg">Group & bulk orders</Link></li>
          </ul>
        </div>
        <div>
          <div className="label">Help</div>
          <ul className="space-y-1.5 text-sm text-fg-2">
            <li><a href="mailto:hello@zazartz.com" className="hover:text-fg">hello@zazartz.com</a></li>
            <li><Link href="/how-it-works#shipping" className="hover:text-fg">Shipping & returns</Link></li>
            <li><Link href="/how-it-works#ip" className="hover:text-fg">Content policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-fg-2/60">
        © {new Date().getFullYear()} ZAZ ARTZ · Built on Microsoft Azure
      </div>
    </footer>
  );
}
