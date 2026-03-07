import React from 'react';
import { AlertOctagon, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Sanggahan (Disclaimer) | BahanBakar.id",
    description: "Sanggahan hukum terkait tingkat keakuratan hasil prediksi pengeluaran bensin, bahan bakar minyak, dan jarak tempuh navigasi di aplikasi BahanBakar.id.",
};

export default function Disclaimer() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-outfit font-black text-slate-900 mb-4 tracking-tight">
                    Sanggahan <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Akurasi</span>
                </h1>
                <p className="text-slate-500 font-medium">(Disclaimer Akurasi Kalkulasi BBM)</p>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200">

                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-10 flex flex-col md:flex-row gap-6 items-start">
                    <AlertOctagon className="w-12 h-12 text-red-500 flex-shrink-0" />
                    <div>
                        <h2 className="text-xl font-black text-slate-900 mb-2">Notice Pelepasan Tanggung Jawab Hukum</h2>
                        <p className="text-slate-700 leading-relaxed text-sm">
                            Semua informasi yang ada di situs web ini (bahan-bakar-id.vercel.app) diterbitkan dengan itikad baik
                            dan hanya untuk tujuan informasi umum dan simulasi kasar (estimasi) semata. <strong>BahanBakar.id</strong> tidak memberikan
                            garansi absolut mengenai kelengkapan, keandalan, dan keakuratan empiris dari hasil nilai kalkulator matematis ini.
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    <section>
                        <h3 className="text-xl font-bold text-slate-900 border-l-4 border-orange-500 pl-4 mb-3">
                            1. Deviasi Aktual Bahan Bakar (BBM)
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            Setiap hasil jarak, liter BBM yang harus dibakar, dan biaya finansial yang dihasilkan mesin kami adalah hasil perkalian statis algoritma berdasar rasio
                            KML (Kilometer per Liter) uji laboratorium standar yang beredar di Internet. Di jalan aspal, konsumsi asli Anda **sangat amat mungkin meleset (deviasi)** karena faktor-faktor luar kendali, termasuk:
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <li className="flex gap-2 text-sm text-slate-600 items-start">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>Tekanan angin ban yang bocor / tidak merata</span>
                            </li>
                            <li className="flex gap-2 text-sm text-slate-600 items-start">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>Gaya mengemudi agresif pengemudi (Throttle bukaan gas penuh)</span>
                            </li>
                            <li className="flex gap-2 text-sm text-slate-600 items-start">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>Kemacetan ekstrim / rute Stop-and-Go</span>
                            </li>
                            <li className="flex gap-2 text-sm text-slate-600 items-start">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>Penggunaan AC kompresor mekanikal di suhu terik panas</span>
                            </li>
                            <li className="flex gap-2 text-sm text-slate-600 items-start">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>Beban kargo kendaraan harian (Jumlah penumpang, kardus atap)</span>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-slate-900 border-l-4 border-orange-500 pl-4 mb-3">
                            2. Kesalahan Titik Rute GPS / Google Maps
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            Sistem visualisasi kami dibentuk di atas penyedia layanan pihak ketiga (Google Maps Directions). Apabila terdapat rute yang dialihkan,
                            penutupan jalan, gang buntu, akses eksklusif tol pribadi, atau portal perumahan dalam kenyataan asli, itu sama sekali berada di luar
                            kekuasaan dan tanggung jawab kontrol aplikasi BahanBakar.id.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-slate-900 border-l-4 border-orange-500 pl-4 mb-3">
                            3. Kerugian Risiko Finansial
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base font-medium">
                            Tindakan apa pun yang Anda lakukan atas informasi maupun ekspektasi output layar monitor yang Anda temukan di situs web ini,
                            <strong>sepenuhnya merupakan risiko dan tanggung jawab komando pengemudi sendiri.</strong> BahanBakar.id maupun pengelolanya
                            (Daril Pratomo) tidak bertanggung jawab atas kerugian finansial, mesin yang rusak, atau kejadian kehabisan Bahan Bakar di tengah jalan raya mana pun.
                        </p>
                    </section>

                </div>

                <div className="mt-12 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-500 text-sm">Persetujuan atas Disclaimer/Sanggahan ini dinyatakan saat sesi browser Anda dibuka pada url aplikasi ini.</p>
                </div>

            </div>
        </div>
    );
}
