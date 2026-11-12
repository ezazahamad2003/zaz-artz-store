import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { GOOGLE_FONTS_HREF } from "@/lib/catalog";

const body = Inter({ variable: "--font-body-sans", subsets: ["latin"] });
const display = DM_Serif_Display({ variable: "--font-display-serif", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "ZAZ ARTZ · Custom printed tees, hoodies & matching sets",
  description:
    "Design your own tees, hoodies, crewnecks and matching sets. AI-powered studio, trending drops for Christmas, New Year, couples, anime, pets and more.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://zaz-artz.azurewebsites.net"),
  openGraph: { title: "ZAZ ARTZ", description: "Custom clothing, designed by you.", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={GOOGLE_FONTS_HREF} />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
