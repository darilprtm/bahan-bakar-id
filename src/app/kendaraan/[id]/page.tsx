import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import vehiclesData from '../../../data/vehicles.json';
import Link from 'next/link';
import { ChevronLeft, Gauge, Info, Settings, Factory } from 'lucide-react';

export async function generateStaticParams() {
    return vehiclesData.map((v) => ({
        id: v.id,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const vehicle = vehiclesData.find((v) => v.id === resolvedParams.id);
    if (!vehicle) return { title: 'Kendaraan Tidak Ditemukan' };

    return {
        title: `Spesifikasi BBM ${vehicle.name} - ${vehicle.kml} KM/L | BahanBakar.id`,
        description: `Berapa konsumsi bensin ${vehicle.name}? Ulasan komprehensif, fakta efisiensi mesin, dan catatan tingkat konsumsi kilometer per liter (${vehicle.kml} km/l) dari seri ${vehicle.type}.`,
        keywords: [`konsumsi bensin ${vehicle.name}`, `keiritan ${vehicle.name}`, `BBM ${vehicle.name}`, `Spesifikasi ${vehicle.name}`, `Rasio KML ${vehicle.name}`],
    };
}

export default async function VehicleDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const vehicle = vehiclesData.find((v) => v.id === resolvedParams.id);

    if (!vehicle) {
        notFound();
    }

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            <Link href="/kendaraan" className="inline-flex items-center text-sm font-bold text-orange-500 hover:text-orange-600 mb-10 transition-colors bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
                <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Katalog Kendaraan
            </Link>

            <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 shadow-sm border border-slate-200 relative overflow-hidden">
                {/* Dekorasi Visual */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-[100px] -z-0"></div>
                <div className="absolute -top-10 -right-10 opacity-5 z-0">
                    <Factory className="w-64 h-64 text-slate-900" />
                </div>

                <header className="mb-12 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-slate-900 text-white text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm">
                            Kategori: {vehicle.type}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-outfit font-black text-slate-900 leading-tight mb-8">
                        Ulasan Konsumsi Bahan Bakar <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 block mt-2">{vehicle.name}</span>
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Kemampuan KML (Combined)</p>
                                <p className="text-4xl font-black text-emerald-700 font-mono">{vehicle.kml} <span className="text-lg font-bold text-emerald-600 uppercase">Km/L</span></p>
                            </div>
                            <Gauge className="w-12 h-12 text-emerald-300" />
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                                <Settings className="w-5 h-5 text-slate-400" />
                                <h4 className="font-bold text-slate-700">Skor Rating Mesin</h4>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-3 max-w-xs mt-2 overflow-hidden shadow-inner">
                                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full" style={{ width: `${Math.min((vehicle.kml / (vehicle.type === 'motor' ? 65 : 25)) * 100, 100)}%` }}></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3 font-medium">Berdasarkan komparasi kelas kubikasi {vehicle.type.toLowerCase()}.</p>
                        </div>
                    </div>
                </header>

                <div className="prose prose-slate prose-lg md:prose-xl max-w-none text-slate-700 leading-relaxed font-sans relative z-10 border-t border-slate-100 pt-10">
                    <p>
                        Membedah arsitektur peminum bensin, lini produk <strong>{vehicle.name}</strong> tidak dapat diabaikan keberadaannya dalam ranah perebutan takhta efisiensi jalanan aspal di aspal. Menjadi primadona perlintasan pada genre perakitan bentuk {vehicle.type}, jajaran model sasis ini didaulat mampu menyerap atensi calon pembeli berkat prestise hemat biaya kepemilikan.
                    </p>

                    <h3 className="text-2xl font-bold font-outfit text-slate-900 mt-8 mb-4 border-l-4 border-orange-500 pl-4">Akurasi Konsumsi Bensin Aktual</h3>
                    <p>
                        Menurut bank data algoritma kami yang dibrifing dari rata-rata parameter kombinasi lapangan serta jurnal pabrikan rekayasa (Riset Gabungan), sosok rakitan mekanik <strong>{vehicle.name}</strong> terkalibrasi mencantumkan indeks patokan keiritan bBM pada angka <strong>{vehicle.kml} Kilometer untuk setiap kucuran 1 Liter</strong> suplai ron.
                    </p>
                    <p>
                        Sangat patut ditegaskan bahwa indeks torehan angka {vehicle.kml} KM/L ini mencerminkan hasil parameter <em>Eco-Running</em>. Apabila {vehicle.type.toLowerCase()} tersebut dieksploitasi meladeni kondisi kemacetan brutal kota-kota besar (situasi *Stop-and-Go* absolut) atau sering diperintah meregangkan ototnya dengan gaya pijakan pedal gas penuh emosi, angka rentang efisiensinya sangat niscaya menyimpang alias didera reduksi konsumsi melorot hingga pembuangan -15%.
                    </p>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 my-8 flex items-start gap-4">
                        <Info className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-blue-900 mb-1">Catatan Korelasi Kalkulator</h4>
                            <p className="text-blue-800 text-sm md:text-base leading-relaxed">
                                Nilai efisiensi spesifik ini telah ditanam (Hardcoded) ke dalam menu utama <strong>BahanBakar.id Routing Engine</strong>. Anda dapat menguji prakiraan ongkos finansial liburan perjalanan melintasi antar pulau jika mengemudikan instrumen {vehicle.name} ini dengan menggunakan halaman Dashboard utama perutean situs ini.
                            </p>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold font-outfit text-slate-900 mt-8 mb-4 border-l-4 border-orange-500 pl-4">Pesan Pemeliharaan Sasis</h3>
                    <p>
                        Meskipun jantung pengapian standar {vehicle.name} sudah dikunci paten pada nilai {vehicle.kml} km/l, kesehatan nafas kompresi tersebut tak luput dari hukum penyusutan. Servis piranti rem membandel, telat rotasi viskositas oli mesin, abai pada penyumbatan katalisator <em>Exhaust</em>, dan keengganan mengecek tekanan milibar angin roda tapak secara fatal bakal menyabotase kesucian dompet penggunanya.
                    </p>
                </div>

            </div>
        </article>
    );
}
