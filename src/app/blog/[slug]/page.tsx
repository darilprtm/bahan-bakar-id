import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import articlesData from '../../../data/articles.json';
import Link from 'next/link';
import { Calendar, User, Tag, ChevronLeft, BookOpen } from 'lucide-react';

// Next.js static params generation
export async function generateStaticParams() {
    return articlesData.map((article) => ({
        slug: article.slug,
    }));
}

// Dynamic Metadata Setup
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const article = articlesData.find((a) => a.slug === resolvedParams.slug);
    if (!article) return { title: 'Not Found' };

    return {
        title: `${article.title} | BahanBakar.id Blog`,
        description: article.excerpt,
        keywords: article.tags,
    };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const article = articlesData.find((a) => a.slug === resolvedParams.slug);

    if (!article) {
        notFound();
    }

    // Pisahkan konten berdasarkan double newline \n\n agar bisa di-render jadi paragraf
    const paragraphs = article.content.split('\n\n');

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 relative">
            <Link href="/blog" className="inline-flex items-center text-sm font-bold text-orange-500 hover:text-orange-600 mb-10 transition-colors bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
                <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Katalog Artikel
            </Link>

            <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 shadow-sm border border-slate-200">

                {/* Header Metadata Meta */}
                <header className="mb-10 lg:mb-14 border-b border-slate-100 pb-8 lg:pb-10">
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                            {article.category}
                        </span>
                        {article.tags.map((tag, i) => (
                            <span key={i} className="flex items-center text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
                                <Tag className="w-3 h-3 mr-1" /> {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-outfit font-black text-slate-900 leading-tight mb-6 tracking-tight">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-black"><User className="w-4 h-4" /></div>
                            <span className="font-bold text-slate-700">{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                            <Calendar className="w-4 h-4 text-orange-500" />
                            <span>Diterbitkan pada: {article.date}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            <span>{(article.content.split(' ').length / 200).toFixed(0)} Menit Baca</span>
                        </div>
                    </div>
                </header>

                {/* Hero Image */}
                <div className="relative w-full h-64 md:h-[400px] rounded-3xl overflow-hidden mb-12 shadow-sm border border-slate-100">
                    <Image src={article.imageUrl} alt={article.title} fill className="object-cover" priority />
                </div>

                {/* Content Body Rendering */}
                <div className="prose prose-slate prose-lg md:prose-xl prose-orange max-w-none text-slate-700 leading-relaxed font-sans">
                    {paragraphs.map((par, i) => {
                        // Render basic bold syntax (**text**) if present, for simple local markdown
                        const renderBolding = (text: string) => {
                            const parts = text.split(/\*\*(.*?)\*\*/g);
                            return parts.map((part, index) =>
                                index % 2 === 1 ? <strong key={index} className="font-bold text-slate-900">{part}</strong> : part
                            );
                        };

                        return (
                            <p key={i} className="mb-6 whitespace-pre-wrap">
                                {renderBolding(par)}
                            </p>
                        );
                    })}
                </div>

                <div className="mt-16 pt-8 border-t border-slate-200 text-center bg-slate-50 rounded-2xl p-8">
                    <h3 className="font-bold text-slate-900 text-xl font-outfit mb-2">Terima Kasih Telah Membaca</h3>
                    <p className="text-sm text-slate-600">Semoga wawasan teknis ini berguna untuk mengoptimalkan efisiensi kendaraan Anda di jalan. Hak Cipta &copy; BahanBakar.id</p>
                </div>
            </div>
        </article>
    );
}
