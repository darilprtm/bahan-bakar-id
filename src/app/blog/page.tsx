import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import articlesData from '../../data/articles.json';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: "Ensiklopedia Otomotif & Blog | BahanBakar.id",
    description: "Kumpulan artikel edukatif, panduan hemat BBM, rahasia perawatan mesin kendaraan, dan jurnal navigasi geospasial dari tim spesialis BahanBakar.id.",
};

export default function BlogIndex() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">

            {/* Subtle Glow Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none z-0"></div>

            <div className="text-center mb-16 relative z-10">
                <h1 className="text-4xl md:text-6xl font-outfit font-black text-slate-900 tracking-tight mb-4 drop-shadow-sm">
                    Ensiklopedia <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Otomotif</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                    Dapatkan wawasan teknis mendalam tentang mesin, efisiensi bahan bakar, dan gaya mengemudi berkelanjutan di jurnal artikel kami.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {articlesData.map((article) => (
                    <Link href={`/blog/${article.slug}`} key={article.id} className="group">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-200 hover:-translate-y-2">

                            <div className="h-56 w-full bg-slate-100 flex items-center justify-center relative overflow-hidden group-hover:bg-orange-50 transition-colors">
                                <Image src={article.imageUrl} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-slate-700 shadow-sm z-20">
                                    {article.category}
                                </span>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <h2 className="text-xl font-bold font-outfit text-slate-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                                    {article.title}
                                </h2>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                                    {article.excerpt}
                                </p>

                                <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {article.date}</span>
                                    </div>
                                    <span className="flex items-center text-orange-500 font-bold group-hover:translate-x-1 transition-transform">
                                        Baca <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
