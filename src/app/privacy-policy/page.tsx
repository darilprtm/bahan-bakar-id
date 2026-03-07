import React from 'react';
import { Shield, Lock, Eye, Database } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Kebijakan Privasi | BahanBakar.id",
    description: "Kebijakan privasi dan pengelolaan data pengguna di BahanBakar.id. Kami berkomitmen melindungi privasi data navigasi dan analitik Anda.",
};

export default function PrivacyPolicy() {
    const lastUpdated = "7 Maret 2026";

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-outfit font-black text-slate-900 mb-4 tracking-tight">
                    Kebijakan <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Privasi</span>
                </h1>
                <p className="text-slate-500 font-medium">Terakhir Diperbarui: {lastUpdated}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200">
                <div className="prose prose-slate prose-orange max-w-none">
                    <p className="lead text-lg text-slate-700 font-medium mb-8">
                        Di <strong>BahanBakar.id</strong> (dikelola oleh Daril Pratomo), privasi pengunjung kami adalah prioritas utama.
                        Dokumen Kebijakan Privasi ini menguraikan jenis informasi data yang dikumpulkan dan dicatat oleh BahanBakar.id dan bagaimana kami menggunakannya.
                        Jika Anda memiliki pertanyaan tambahan atau memerlukan informasi lebih lanjut tentang Kebijakan Privasi kami, jangan ragu untuk menghubungi kami.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex gap-4 items-start">
                            <Eye className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">Transparansi Data</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">Kami hanya memproses titik koordinat secara *real-time* untuk kebutuhan hitung jarak. Tidak ada log riwayat GPS yang disimpan ke database kami secara permanen.</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex gap-4 items-start">
                            <Database className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">Penyimpanan Lokal</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">Data referensi mobil dan harga BBM dibaca lansung tanpa perlu akun login, memastikan anonimitas pengguna tetap terjaga utuh.</p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2">1. Data Geografis & Layanan Pihak Ketiga</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Aplikasi kalkulator jarak dan rute kami mengandalkan layanan pemetaan terkemuka seperti <strong>Google Maps Platform (Geocoding API, Places API, Directions API)</strong>.
                        Saat Anda memasukkan alamat atau mengaktifkan fitur "GPS Scan" (Geo-location browser), koordinat perangkat Anda dikirimkan kepada penyedia layanan pihak ketiga secara anonim
                        hanya untuk proses kalkulasi jalur geometris di atas peta.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2">2. Log Files (Berkas Log)</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        BahanBakar.id mengikuti prosedur standar menggunakan file log. File-file ini mencatat pengunjung ketika mereka mengunjungi situs web.
                        Semua perusahaan hosting melakukan ini dan merupakan bagian dari analitik layanan hosting.
                        Informasi yang dikumpulkan oleh file log termasuk alamat protokol internet (IP), jenis browser, Internet Service Provider (ISP),
                        tanggal dan waktu kunjungan, merujuk/keluar halaman, dan mungkin jumlah klik. Ini tidak terkait dengan informasi apapun yang
                        dapat diidentifikasi secara pribadi.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2">3. Cookies dan Web Beacons</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Seperti situs web lainnya, BahanBakar.id menggunakan 'cookies'. Cookie ini digunakan untuk menyimpan informasi termasuk preferensi pengunjung,
                        dan halaman di situs web yang pengunjung akses atau kunjungi. Informasi ini digunakan untuk mengoptimalkan pengalaman pengguna
                        dengan menyesuaikan konten halaman web kami berdasarkan jenis browser pengunjung dan/atau informasi lainnya.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2">4. Mitra Periklanan Google AdSense</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Google adalah salah satu vendor pihak ketiga di situs kami. Google juga menggunakan cookie, yang dikenal sebagai DART cookie,
                        untuk menayangkan iklan kepada pengunjung situs kami berdasarkan kunjungan mereka ke www.website.com dan situs lainnya di internet.
                        Namun, pengunjung dapat memilih untuk menolak penggunaan DART cookie dengan mengunjungi Kebijakan Privasi jaringan iklan dan
                        konten Google di URL berikut: <a href="https://policies.google.com/technologies/ads" className="text-orange-500 hover:underline">https://policies.google.com/technologies/ads</a>.
                    </p>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Mitra periklanan pihak ketiga mungkin menggunakan teknologi seperti cookies, JavaScript, atau Web Beacons yang digunakan
                        di masing-masing iklannya dan tautan yang muncul di BahanBakar.id, yang dikirim langsung ke browser pengguna.
                        Mereka secara otomatis menerima alamat IP Anda ketika hal ini terjadi. Teknologi ini digunakan untuk mengukur efektivitas
                        kampanye periklanan mereka dan/atau untuk mempersonalisasi konten iklan yang Anda lihat di situs web yang Anda kunjungi.
                    </p>
                    <p className="text-slate-700 font-medium italic">Catatan: BahanBakar.id tidak memiliki akses ke atau kontrol terhadap cookie ini yang digunakan oleh pengiklan pihak ketiga.</p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2">5. Perlindungan Anak</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Prioritas kami yang lain adalah menambahkan perlindungan untuk anak-anak saat menggunakan internet.
                        BahanBakar.id tidak secara sadar mengumpulkan Informasi Identitas Pribadi apa pun dari anak-anak di bawah usia 13 tahun.
                        Jika Anda merasa bahwa anak Anda memberikan informasi semacam ini di situs web kami, kami sangat menganjurkan Anda untuk segera
                        menghubungi kami dan kami akan melakukan upaya terbaik kami untuk segera menghapus informasi semacam itu dari catatan kami.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2">6. Persetujuan</h2>
                    <p className="text-slate-700 leading-relaxed mb-12">
                        Dengan menggunakan situs web kami (BahanBakar.id), Anda dengan ini menyetujui Kebijakan Privasi kami beserta syarat dan ketentuannya.
                    </p>

                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
                        <Shield className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                        <h3 className="font-bold text-slate-900 mb-2">Punya Pertanyaan tentang Privasi Anda?</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Silakan periksa halaman kontak kami atau hubungi administrator sistem langsung secara transparan.
                        </p>
                        <a href="/contact" className="inline-block bg-white text-orange-600 font-bold px-6 py-2 rounded-xl border border-orange-200 shadow-sm hover:bg-orange-600 hover:text-white transition-colors">
                            Hubungi Administrator
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
