"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === "/") {
            return pathname === "/" ? "text-orange-600 bg-orange-50" : "text-slate-600 hover:text-orange-500 hover:bg-slate-50";
        }
        return pathname.startsWith(path) ? "text-orange-600 bg-orange-50" : "text-slate-600 hover:text-orange-500 hover:bg-slate-50";
    };

    return (
        <>
            {/* Desktop Menu */}
            <nav className="hidden sm:flex items-center gap-6 font-semibold text-sm text-slate-500">
                <Link href="/" className={`px-4 py-2 rounded-lg transition-colors ${isActive("/")}`}>Kalkulator</Link>
                <Link href="/blog" className={`px-4 py-2 rounded-lg transition-colors ${isActive("/blog")}`}>Blog</Link>
                <Link href="/kendaraan" className={`px-4 py-2 rounded-lg transition-colors ${isActive("/kendaraan")}`}>Database Kendaraan</Link>
            </nav>

            {/* Mobile Hamburger Icon */}
            <button
                className="sm:hidden p-2 text-slate-600 hover:text-orange-600 hover:bg-slate-100 rounded-lg transition-colors z-50"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Dropdown Panel Container */}
            {isOpen && (
                <div className="absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-2xl sm:hidden flex flex-col px-4 py-4 gap-2 font-bold text-slate-700 z-40 animate-in slide-in-from-top-4 duration-200">
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className={`p-4 rounded-xl transition-all ${isActive("/")} border border-transparent`}
                    >
                        🏁 Kalkulator Utama
                    </Link>
                    <Link
                        href="/blog"
                        onClick={() => setIsOpen(false)}
                        className={`p-4 rounded-xl transition-all ${isActive("/blog")} border border-transparent`}
                    >
                        📚 Ensiklopedia BBM / Blog
                    </Link>
                    <Link
                        href="/kendaraan"
                        onClick={() => setIsOpen(false)}
                        className={`p-4 rounded-xl transition-all ${isActive("/kendaraan")} border border-transparent`}
                    >
                        🚗 Database Engine (KML)
                    </Link>
                </div>
            )}
        </>
    );
}
