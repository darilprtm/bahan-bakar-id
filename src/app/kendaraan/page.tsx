import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import vehiclesData from '../../data/vehicles.json';
import { CarFront, ArrowRight, GaugeCircle, DatabaseZap } from 'lucide-react';

export const metadata: Metadata = {
    title: "Direktori Rasio BBM Spesifikasi Kendaraan | BahanBakar.id",
    description: "Daftar lengkap hasil uji coba lapangan efisiensi mesin KM/L (Kilometer per Liter) berbagai tipe motor dan mobil standar pabrikan.",
};

export default function VehicleCatalogList() {
    const mobilList = vehiclesData.filter(v => v.type.toLowerCase() === 'mobil');
    const motorList = vehiclesData.filter(v => v.type.toLowerCase() === 'motor');

    const VehicleCard = ({ list, title, icon }: { list: any[], title: string, icon: React.ReactNode }) => (
        <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg border-b-4 border-orange-500">
                    {icon}
                </div>
                <div>
                    <h2 className="text-3xl font-black font-outfit text-slate-900">Katalog {title}</h2>
                    <p className="text-slate-500 font-medium">Data riset konsumsi bahan bakar *Combined Cycle*.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {list.map((vehicle) => (
                    <Link href={`/kendaraan/${vehicle.id}`} key={vehicle.id} className="group">
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-200 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-orange-600 transition-colors pr-4">{vehicle.name}</h3>
                                <div className="bg-slate-100 p-2 rounded-lg text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors flex-shrink-0">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-4 relative z-10">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Efisiensi KML</span>
                                <div className="flex items-center gap-1.5 text-emerald-600 font-black bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                    <GaugeCircle className="w-4 h-4" />
                                    <span>{vehicle.kml} km/l</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center p-3 bg-red-50 text-red-500 rounded-2xl mb-6 shadow-sm border border-red-100">
                    <DatabaseZap className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-outfit font-black text-slate-900 mb-6 tracking-tight">
                    Pusat Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Efisiensi Mesin</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                    Daftar direktori ensiklopedia terbuka yang membedah spesifikasi keiritan KML berbagai lini perakitan kendaraan standar jalan raya Indonesia.
                </p>
            </div>

            <VehicleCard list={mobilList} title="Mobil Penumpang" icon={<CarFront className="w-7 h-7" />} />
            <VehicleCard list={motorList} title="Sepeda Motor" icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="18" r="3" /><circle cx="19" cy="18" r="3" /><path d="M5 15v-3a4 4 0 0 1 4-4h5M12 15l2-4" /></svg>} />

        </div>
    );
}
