export const metadata = { title: "How it works · ZAZ ARTZ" };

const SIZES = [
  ["XS", "34-36", "27", "17"],
  ["S", "36-38", "28", "18"],
  ["M", "38-40", "29", "20"],
  ["L", "40-42", "30", "22"],
  ["XL", "42-44", "31", "24"],
  ["2XL", "44-46", "32", "26"],
  ["3XL", "46-48", "33", "28"],
];

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-6xl">HOW IT WORKS</h1>
      <div className="prose-invert mt-8 space-y-10 text-fg-2">
        <section>
          <h2 className="text-3xl text-fg">1. Design</h2>
          <p className="mt-2">
            Start from a trending template and change the words, or open the studio with a blank garment. Add text in 19 fonts,
            upload a photo, or describe an image and the AI draws it as a print graphic. Upload a selfie or pet photo and the
            AI can restyle it as anime, pop art, a renaissance painting and more.
          </p>
        </section>
        <section id="shipping">
          <h2 className="text-3xl text-fg">2. Print & ship</h2>
          <p className="mt-2">
            Every order is printed one at a time in the US within 3 to 5 business days, then shipped tracked. Standard shipping is
            $5.99 and free over $75. Christmas orders placed before December 12 ship by December 20.
          </p>
          <p className="mt-2">
            Because each piece is made for you, we cannot accept returns for a change of mind. Misprints, damage or wrong sizes
            sent by us are reprinted free. Email a photo within 14 days of delivery.
          </p>
        </section>
        <section id="sizing">
          <h2 className="text-3xl text-fg">Size guide (unisex, inches)</h2>
          <table className="mt-3 w-full text-left text-sm">
            <thead className="text-fg">
              <tr><th className="py-2">Size</th><th>Chest</th><th>Length</th><th>Width</th></tr>
            </thead>
            <tbody>
              {SIZES.map(([s, c, l, w]) => (
                <tr key={s} className="border-t border-line"><td className="py-2 font-semibold text-fg">{s}</td><td>{c}</td><td>{l}</td><td>{w}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs">Heavyweight and oversized cuts run roughly one size larger. Size down for a regular fit.</p>
        </section>
        <section id="groups">
          <h2 className="text-3xl text-fg">Group & bulk orders</h2>
          <p className="mt-2">
            Bachelorette weekends, family reunions, team trips, company events. Orders of 10 or more identical designs get 15% off
            automatically at checkout. Need 50+ or screen printing? Email hello@zazartz.com for a quote.
          </p>
        </section>
        <section id="ip">
          <h2 className="text-3xl text-fg">Content policy</h2>
          <p className="mt-2">
            You may only upload artwork, photos and text you own or have permission to print. Our fandom and anime designs are
            original, fan-inspired and unofficial; they do not use licensed characters, logos or trademarks. We refuse orders that
            contain hate speech, explicit content or infringing material, and refund them in full.
          </p>
        </section>
      </div>
    </div>
  );
}
