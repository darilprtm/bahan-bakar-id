import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "BahanBakar.id - Kalkulator Perjalanan & BBM Ekstra Akurat",
  description: "Hitung estimasi biaya bahan bakar minyak rute perjalanan Anda dengan opsi multi-titik yang sangat akurat. Ketahui jarak tempuh dan biaya BBM berbagai kendaraan rute spesifik.",
  keywords: ["kalkulator bbm", "hitung bensin", "biaya perjalanan", "konsumsi bahan bakar kendaraan", "tarif bbm", "jarak tempuh", "rute perjalanan"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} ${mono.variable} font-sans antialiased bg-slate-50 text-slate-700 selection:bg-orange-500 selection:text-white min-h-screen flex flex-col`}
      >
        {/* Background Grid Pattern for Light Theme */}
        <div className="fixed inset-0 z-[-1] opacity-[0.05] pointer-events-none" style={{ backgroundImage: "linear-gradient(#000000 1px, transparent 1px), linear-gradient(90deg, #000000 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>

        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white"><path d="M3 22v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" /><path d="M6 12v-5a3 3 0 0 1 6 0v5" /><path d="M15 12v-3a2 2 0 0 1 4 0v3" /><path d="M12 22v-4" /></svg>
              </div>
              <span className="font-outfit text-2xl font-black tracking-tight text-slate-800 flex items-center">
                BahanBakar<span className="text-orange-500">.id</span>
              </span>
            </div>
            <nav className="hidden sm:flex gap-8 font-semibold text-sm text-slate-500">
              <a href="#" className="hover:text-orange-600 transition-colors">Kalkulator</a>
              <a href="#efisiensi" className="hover:text-orange-600 transition-colors">Database Kendaraan</a>
              <a href="#faq" className="hover:text-orange-600 transition-colors">Tips Hemat</a>
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-white border-t border-slate-200 text-slate-500 py-12 text-sm mt-auto shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <span className="font-outfit text-2xl font-black text-slate-800 mb-4 block">
                BahanBakar<span className="text-orange-500">.id</span>
              </span>
              <p className="max-w-md text-slate-500 leading-relaxed">Kalkulator perjalanan presisi. Menghubungkan teknologi geolokasi dan mesin routing cerdas untuk menakar konsumsi bahan bakar perjalanan Anda secara akurat.</p>
            </div>
            <div>
              <h4 className="text-slate-800 font-bold mb-4 tracking-wide uppercase text-xs">Navigasi Rute</h4>
              <ul className="space-y-3 font-medium">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Kalkulator Utama</a></li>
                <li><a href="#efisiensi" className="hover:text-orange-600 transition-colors">Daftar KML Resmi</a></li>
                <li><a href="#faq" className="hover:text-orange-600 transition-colors">FAQ Otomotif</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-800 font-bold mb-4 tracking-wide uppercase text-xs">Legalitas</h4>
              <ul className="space-y-3 font-medium">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Syarat Penggunaan</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Kontak Kami</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-semibold">
            <p>&copy; {new Date().getFullYear()} Engine Analytics - BahanBakar.id</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
