import React from 'react';
import { Mail, MapPin, MessageSquare, Info } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Hubungi Kami | BahanBakar.id",
    description: "Formulir portal kontak untuk urusan bisnis (Adverts), bugs report, dan pengajuan kerjasama perihal Web App BahanBakar.id.",
};

export default function Contact() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-outfit font-black text-slate-900 mb-4 tracking-tight">
                    Hubungi <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Developer</span>
                </h1>
                <p className="text-slate-500 font-medium">BahanBakar.id Transparansi & Kerjasama (Contact Us)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Kolom Info Kiri */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b pb-3">
                            <Info className="text-blue-500 w-5 h-5" /> Informasi Publik
                        </h3>

                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="bg-orange-50 p-2 rounded-lg border border-orange-100 mt-[-4px]">
                                    <Mail className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Entitas / Surel Resmi</p>
                                    <p className="text-slate-800 font-bold block">darilpsr@gmail.com</p>
                                    <p className="text-sm text-slate-500 mt-0.5">a.n Daril Pratomo</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 mt-[-4px]">
                                    <MapPin className="w-5 h-5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Zona Operasional</p>
                                    <p className="text-slate-800 font-bold block">INDONESIA</p>
                                    <p className="text-sm text-slate-500 mt-0.5">Pengembangan Aplikasi Independen</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <p className="text-xs text-slate-500 leading-relaxed text-center">
                                Portal komunikasi ini dibuka seluas-luasnya spesifik bagi permintaan penghapusan Data Cache,
                                Penawaran Iklan, maupun Laporan Bugs Kesalahan Perhitungan.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Kolom Form Kanan */}
                <div className="md:col-span-3">
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 h-full flex flex-col justify-center text-center">
                        <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">Tinggalkan Pesan Tiket</h2>
                        <p className="text-slate-600 mb-8 max-w-sm mx-auto">Untuk saat ini, infrastruktur persuratan form aplikasi sedang ditangguhkan. Sila klik tombol integrasi surel kilat di bawah.</p>

                        <a
                            href="mailto:darilpsr@gmail.com?subject=Tanya%20Terkait%20BahanBakar.id&body=Halo%20Mas%20Daril,%0D%0A"
                            className="mx-auto w-full md:w-auto inline-flex items-center justify-center gap-3 bg-slate-900 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-slate-900/20 hover:bg-orange-600 hover:shadow-orange-500/30 transition-all active:scale-95"
                        >
                            <Mail className="w-5 h-5" /> Tulis E-Mail Sekarang
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
