import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import { BrandingProvider } from "./context/BrandingContext";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Aeterna | Memoriales Digitales Premium & Marca Blanca",
  description: "Preserva para siempre la historia y los recuerdos de tus seres queridos en un espacio privado, seguro, elegante y colaborativo. Solución SaaS de marca blanca para empresas funerarias.",
  keywords: ["memorial digital", "marca blanca funerarias", "código qr lápidas", "árbol genealógico", "legado familiar", "aeterna", "tributo virtual"],
  authors: [{ name: "Aeterna Legacy Team" }],
  openGraph: {
    title: "Aeterna | Plataforma de Memoriales Digitales Premium",
    description: "Espacio familiar privado para preservar fotos, audios, cartas y recuerdos eternamente con tecnología de código QR y marca blanca.",
    url: "https://aeterna.app",
    siteName: "Aeterna",
    locale: "es_CL",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${outfit.variable}`} style={{ scrollBehavior: 'smooth' }} data-scroll-behavior="smooth">
      <body className="antialiased">
        <BrandingProvider>
          {children}
        </BrandingProvider>
      </body>
    </html>
  );
}
