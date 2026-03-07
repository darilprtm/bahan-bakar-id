import React from 'react';
import { Scale, AlertTriangle, FileText } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Syarat & Ketentuan Layanan | BahanBakar.id",
    description: "Syarat penggunaan (Terms of Service) alat kalkulator BahanBakar.id. Baca dengan teliti aturan penggunaan aset web kami.",
};

export default function TermsOfService() {
    const lastUpdated = "7 Maret 2026";

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-outfit font-black text-slate-900 mb-4 tracking-tight">
                    Syarat & Ketentuan <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Layanan</span>
                </h1>
                <p className="text-slate-500 font-medium">Terakhir Diperbarui: {lastUpdated}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200">
                <div className="prose prose-slate max-w-none">
                    <p className="lead text-lg text-slate-700 font-medium mb-8">
                        Selamat datang di <strong>BahanBakar.id</strong>. Syarat & Ketentuan (selanjutnya disebut "Ketentuan") ini mengatur penggunaan Anda terhadap situs web kami yang terletak di bahan-bakar-id.vercel.app (dan setiap variasinya), yang dikelola oleh Daril Pratomo.
                    </p>

                    <div className="bg-slate-50 border-l-4 border-slate-500 p-5 rounded-r-2xl mb-8">
                        <p className="text-sm font-semibold text-slate-700 m-0 leading-relaxed">
                            Dengan mengakses situs web ini, kami berasumsi bahwa Anda menyetujui syarat dan ketentuan ini secara penuh.
                            Jangan melanjutkan penggunaan BahanBakar.id jika Anda tidak menyetujui semua syarat dan ketentuan yang dinyatakan di halaman ini.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2 flex items-center gap-2">
                        <Scale className="w-5 h-5 text-slate-500" /> 1. Lisensi Penggunaan
                    </h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Kecuali dinyatakan lain, pemberi lisensi BahanBakar.id memiliki hak kekayaan intelektual untuk semua materi di BahanBakar.id.
                        Semua hak kekayaan intelektual memegang hak cipta dilindungi undang-undang. Anda dapat melihat dan/atau mencetak
                        halaman dari bahan-bakar-id.vercel.app untuk penggunaan pribadi Anda sendiri dengan tunduk pada batasan yang ditetapkan
                        dalam syarat dan ketentuan ini.
                    </p>
                    <p className="text-slate-700 font-bold mb-2">Anda dilarang secara ketat untuk:</p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-6">
                        <li>Menerbitkan ulang materi dari situs ini (termasuk republication ke situs web lain).</li>
                        <li>Menjual, menyewakan, atau mensub-lisensikan materi algoritma kalkulasi situs ini.</li>
                        <li>Mereproduksi, menggandakan, atau menyalin materi, kode, dan sumber database BahanBakar.id.</li>
                        <li>Mendistribusikan ulang konten dari BahanBakar.id tanpa atribusi yang jelas.</li>
                        <li><strong>Melakukan aktivitas *Web Scraping*, eksploitasi API otomatis (BOT), atau melakukan injeksi request masal ke mesin *routing* kami.</strong></li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-slate-500" /> 2. Kuota Penggunaan yang Wajar (Fair Use)
                    </h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Layanan peta geolokasi, *autocomplete* pencarian, dan *routing engine* yang disediakan situs ini menanggung beban biaya (API Cost) di belakang layar.
                        Sebagai wujud penggunaan gratis, website ini menerapkan mekanisme perlindungan <em>Rate Limiting</em> dan batas pencarian harian / bulanan secara teknis
                        terhadap setiap perangkat atau peramban klien. Modifikasi kode sistem klien untuk membypass pembatasan ini adalah pelanggaran Ketentuan.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-500" /> 3. Sifat Layanan (Disclaimer of Warranties)
                    </h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Segala informasi, kalkulasi BBM, rekomendasi rute, prediksi waktu durasi perjalanan yang dihasilkan oleh aplikasi kalkulator
                        kami disediakan atas basis <strong>"Sebagaimana Adanya" (AS IS)</strong> untuk kepentingan simulasi dan edukasi.
                        Kami berupaya keras menghubungkan data yang akurat dari uji kombinasi KML pabrikan,
                        namun tidak menjamin sepenuhnya kepresisian mutlak untuk kalkulasi di dunia nyata.
                    </p>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Untuk informasi pelepasan tanggung jawab (sanggahan) hukum selengkapnya yang terkait dengan dampak kerugian materi
                        akibat kalkulasi navigasi rute di jalan, silakan membaca dokumen <a href="/disclaimer" className="text-orange-600 hover:underline font-bold">Sanggahan Hukum (Disclaimer)</a> kami secara terpisah.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2">4. Penghapusan dan Perubahan Ketentuan</h2>
                    <p className="text-slate-700 leading-relaxed mb-8">
                        Kami mencadangkan hak setiap saat dan dalam kebijakannya sendiri untuk meminta Anda menghapus semua tautan atau
                        tautan tertentu apa pun ke situs web kami. Kami berhak mengubah syarat dan ketentuan ini serta kebijakannya secara
                        langsung pada halaman dokumen ini kapan saja, dan dengan terus menggunakan situs web kami, Anda setuju untuk terikat dan mematuhinya.
                    </p>

                    <hr className="border-slate-100 my-8" />

                    <p className="text-slate-500 text-sm text-center">
                        Jika Anda memiliki masalah dengan isi Ketentuan Layanan Web ini, silakan ajukan keluhan tertulis ke <a href="mailto:darilpsr@gmail.com" className="text-orange-500 font-semibold hover:underline">darilpsr@gmail.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
