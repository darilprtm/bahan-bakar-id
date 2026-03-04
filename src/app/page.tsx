"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Search, MapPin, Plus, Trash2, Fuel, Car, Navigation, AlertCircle, RefreshCw, Crosshair, ArrowUpDown, ChevronDown, Activity, DollarSign, Clock } from "lucide-react";
import vehiclesData from "@/data/vehicles.json";
import fuelsData from "@/data/fuels.json";
import { motion, AnimatePresence } from "framer-motion";

// Lazy load Leaflet Map
const MapDisplay = dynamic(() => import("@/components/MapDisplay"), { ssr: false, loading: () => <div className="w-full h-full bg-[#131B2B] animate-pulse rounded-3xl flex items-center justify-center text-slate-500 border border-slate-800">Menyinkronkan GPS...</div> });

interface Waypoint {
  id: string;
  query: string;
  label: string;
  lat: number | null;
  lon: number | null;
  isSearching: boolean;
  searchResults: any[];
}

export default function Home() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([
    { id: "wp-origin", query: "", label: "", lat: null, lon: null, isSearching: false, searchResults: [] },
    { id: "wp-dest", query: "", label: "", lat: null, lon: null, isSearching: false, searchResults: [] }
  ]);

  const [selectedVehicle, setSelectedVehicle] = useState(vehiclesData[0].id);
  const [customKml, setCustomKml] = useState<string>("");

  const [selectedFuel, setSelectedFuel] = useState(fuelsData[1].id);
  const [customPrice, setCustomPrice] = useState<string>(fuelsData[1].price.toString());

  const [isCalculating, setIsCalculating] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

  const [result, setResult] = useState<{
    distanceKm: number;
    durationMins: number;
    fuelNeededLiter: number;
    totalCost: number;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState("");

  const addWaypoint = () => {
    setWaypoints([...waypoints, { id: `wp-${Date.now()}`, query: "", label: "", lat: null, lon: null, isSearching: false, searchResults: [] }]);
  };

  const removeWaypoint = (id: string) => {
    if (waypoints.length <= 2) return;
    setWaypoints(waypoints.filter(w => w.id !== id));
    setResult(null);
    setRouteCoordinates([]);
  };

  const swapWaypoints = (idx1: number, idx2: number) => {
    const newWp = [...waypoints];
    const temp = newWp[idx1];
    newWp[idx1] = newWp[idx2];
    newWp[idx2] = temp;
    setWaypoints(newWp);
    setResult(null);
    setRouteCoordinates([]);
  };

  const useCurrentLocation = (idx: number) => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolokasi tidak didukung oleh browser Anda.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();

          const newWaypoints = [...waypoints];
          newWaypoints[idx].query = data.display_name || "Lokasi Anda Saat Ini";
          newWaypoints[idx].label = data.display_name || "Lokasi Anda Saat Ini";
          newWaypoints[idx].lat = latitude;
          newWaypoints[idx].lon = longitude;
          newWaypoints[idx].searchResults = [];
          setWaypoints(newWaypoints);

          setResult(null);
          setRouteCoordinates([]);
        } catch (err) {
          setErrorMsg("Gagal mendapatkan nama jalan dari koordinat Anda.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        setErrorMsg("Gagal mengakses lokasi. Pastikan izin lokasi (GPS) diaktifkan di browser/perangkat Anda.");
      }
    );
  };

  const handleSearch = async (idx: number, query: string) => {
    const newWaypoints = [...waypoints];
    newWaypoints[idx].query = query;
    newWaypoints[idx].label = query;
    newWaypoints[idx].lat = null;
    newWaypoints[idx].lon = null;
    setWaypoints(newWaypoints);

    if (query.length < 3) {
      newWaypoints[idx].searchResults = [];
      setWaypoints([...newWaypoints]);
      return;
    }

    newWaypoints[idx].isSearching = true;
    setWaypoints([...newWaypoints]);

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id&limit=5`);
      const data = await res.json();
      const updatedWp = [...waypoints];
      updatedWp[idx].searchResults = data;
      updatedWp[idx].isSearching = false;
      setWaypoints(updatedWp);
    } catch (err) {
      const updatedWp = [...waypoints];
      updatedWp[idx].isSearching = false;
      setWaypoints(updatedWp);
    }
  };

  const selectLocation = (wpIdx: number, resultItem: any) => {
    const newWaypoints = [...waypoints];
    newWaypoints[wpIdx].query = resultItem.display_name;
    newWaypoints[wpIdx].label = resultItem.display_name;
    newWaypoints[wpIdx].lat = parseFloat(resultItem.lat);
    newWaypoints[wpIdx].lon = parseFloat(resultItem.lon);
    newWaypoints[wpIdx].searchResults = [];
    setWaypoints(newWaypoints);
    setResult(null);
    setRouteCoordinates([]);
  };

  const calculateRoute = async () => {
    setErrorMsg("");

    const currentFuelPrice = parseFloat(customPrice) || 0;
    const currentVehicleData = selectedVehicle === "custom"
      ? { name: "Kendaraan Kustom", kml: parseFloat(customKml) || 0 }
      : vehiclesData.find(v => v.id === selectedVehicle) || vehiclesData[0];

    const validPoints = waypoints.filter(w => w.lat !== null && w.lon !== null);
    if (validPoints.length < 2) {
      setErrorMsg("Harap pastikan minimal ada 2 titik lokasi (Asal dan Tujuan) yang sudah dicari dari dropdown.");
      return;
    }
    if (selectedVehicle === "custom" && (!customKml || parseFloat(customKml) <= 0)) {
      setErrorMsg("Harap masukkan angka efisiensi BBM (km/liter) manual yang valid.");
      return;
    }
    if (!currentFuelPrice || currentFuelPrice <= 0) {
      setErrorMsg("Harap masukkan harga BBM yang valid.");
      return;
    }

    setIsCalculating(true);

    try {
      const coordString = validPoints.map(p => `${p.lon},${p.lat}`).join(";");
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;

      const res = await fetch(osrmUrl);
      const data = await res.json();

      if (data.code !== "Ok") throw new Error(data.message || "Gagal mengambil rute aktual jalan tol/jalan umum.");

      const route = data.routes[0];
      const distanceKm = route.distance / 1000;
      const durationMins = Math.round(route.duration / 60);

      const kml = currentVehicleData.kml;
      const fuelNeededLiter = distanceKm / kml;
      const totalCost = fuelNeededLiter * currentFuelPrice;

      setResult({ distanceKm, durationMins, fuelNeededLiter, totalCost });

      const coords = route.geometry.coordinates.map((c: any[]) => [c[1], c[0]]);
      setRouteCoordinates(coords);

    } catch (err: any) {
      setErrorMsg("Titik tujuan mungkin dipisahkan lautan. Rute OSRM gagal.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">

      {/* Glow Effects Behind UI */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl md:text-6xl font-outfit font-black text-white tracking-tight mb-4 drop-shadow-lg">
          Kalkulasi Navigasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Presisi</span>.
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
          Dashboard pintar untuk memproyeksikan jarak, durasi waktu, dan beban biaya bahan bakar kendaraan Anda tanpa meleset.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[760px] relative z-10 block">

        {/* LEFT PANEL : DASHBOARD CONTROLS */}
        <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">

          {errorMsg && (
            <div className="p-4 bg-red-950/50 text-red-400 rounded-2xl flex items-start gap-3 border border-red-500/20 shadow-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {/* Navigasi Control */}
          <div className="dashboard-panel p-6">
            <h2 className="text-sm font-black font-outfit text-slate-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <Crosshair className="text-orange-500 w-4 h-4" /> Radar Waypoint
            </h2>

            <div className="space-y-4">
              <AnimatePresence>
                {waypoints.map((wp, idx) => (
                  <motion.div
                    key={wp.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <div className="flex gap-4 relative z-10">

                      {/* Timeline Node */}
                      <div className="flex flex-col items-center mt-3 z-20">
                        <div className={`w-4 h-4 rounded-full border-4 shadow-[0_0_15px_rgba(0,0,0,0.5)] ${idx === 0 ? 'border-orange-500 bg-orange-950 shadow-orange-500/50' : idx === waypoints.length - 1 ? 'border-red-500 bg-red-950 shadow-red-500/50' : 'border-slate-500 bg-slate-900'}`}></div>
                        {idx < waypoints.length - 1 && <div className="w-[2px] h-full bg-slate-700 my-1"></div>}
                      </div>

                      {/* Swap Button */}
                      {idx < waypoints.length - 1 && (
                        <button
                          onClick={() => swapWaypoints(idx, idx + 1)}
                          className="absolute -left-[9px] top-[calc(100%-12px)] z-30 bg-[#0B0F19] border border-slate-700 shadow-xl text-slate-400 hover:text-orange-500 hover:border-orange-500/50 p-1.5 rounded-full transition-all hover:scale-110"
                          title="Tukar Posisi"
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div className="flex-grow w-full">
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {idx === 0 ? "Keberangkatan" : idx === waypoints.length - 1 ? "Destinasi Akhir" : `Check-point ${idx}`}
                          </label>
                          {idx === 0 && (
                            <button
                              onClick={() => useCurrentLocation(idx)}
                              disabled={isLocating}
                              className="text-[10px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1.5 bg-orange-500/10 hover:bg-orange-500/20 px-2.5 py-1 rounded border border-orange-500/20 transition-colors uppercase tracking-wider"
                            >
                              {isLocating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                              GPS Scan
                            </button>
                          )}
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            value={wp.query}
                            onChange={(e) => handleSearch(idx, e.target.value)}
                            placeholder={idx === 0 ? "Radar lokasi awal..." : "Radar destinasi..."}
                            className={`w-full pl-11 pr-11 py-3.5 bg-[#0B0F19] shadow-inner border rounded-xl text-sm transition-all text-white placeholder:text-slate-600 ${wp.lat && wp.lon ? 'border-orange-500/50 ring-1 ring-orange-500/20 bg-orange-950/10' : 'border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'}`}
                          />
                          <Search className={`w-4 h-4 absolute left-4 top-4 ${wp.isSearching ? 'animate-pulse text-orange-500' : 'text-slate-500'}`} />

                          {waypoints.length > 2 && idx > 0 && (
                            <button onClick={() => removeWaypoint(wp.id)} className="absolute right-3 top-3 bg-slate-800/50 p-1 rounded-md text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Search Results Dropdown - Dark Theme */}
                        {wp.searchResults && wp.searchResults.length > 0 && (
                          <div className="absolute z-50 mt-2 w-[calc(100%-28px)] bg-[#1e293b] border border-slate-700 shadow-2xl rounded-xl max-h-60 overflow-y-auto overflow-hidden text-slate-200">
                            {wp.searchResults.map((res: any, i: number) => (
                              <div
                                key={i}
                                onClick={() => selectLocation(idx, res)}
                                className="px-4 py-3 border-b border-slate-700/50 last:border-0 cursor-pointer text-xs md:text-sm hover:bg-slate-700/50 transition-colors flex items-start gap-2"
                              >
                                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span>{res.display_name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button
              onClick={addWaypoint}
              className="mt-6 flex items-center justify-center w-full sm:w-auto gap-2 text-xs font-black text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-xl transition-all border border-slate-700 uppercase tracking-widest shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4" /> Tambah Check-point
            </button>
          </div>

          <div className="dashboard-panel p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-sm font-black font-outfit text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <Car className="text-blue-500 w-4 h-4" /> Konfigurasi Mesin
              </h2>
              <div className="relative">
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none shadow-inner"
                >
                  {vehiclesData.map(v => (
                    <option key={v.id} value={v.id}>{v.name} (~{v.kml} KM/L)</option>
                  ))}
                  <option value="custom">⚙️ SETUP MANUAL KML</option>
                </select>
                <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              {selectedVehicle === "custom" && (
                <div className="mt-4 flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <div className="relative flex-grow">
                    <input
                      type="number"
                      value={customKml}
                      onChange={(e) => setCustomKml(e.target.value)}
                      placeholder="Misal: 45.5"
                      className="w-full bg-transparent border-b border-slate-700 py-1 text-lg font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">KM/L</span>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-sm font-black font-outfit text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <Fuel className="text-emerald-500 w-4 h-4" /> Oktan / BBM
              </h2>
              <div className="relative">
                <select
                  value={selectedFuel}
                  onChange={(e) => {
                    setSelectedFuel(e.target.value);
                    const fuel = fuelsData.find(f => f.id === e.target.value);
                    if (fuel) setCustomPrice(fuel.price.toString());
                  }}
                  className="w-full px-4 py-3.5 bg-[#0B0F19] border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none shadow-inner"
                >
                  {fuelsData.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              <div className="mt-4 flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <span className="text-emerald-500 font-bold">Rp</span>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-700 py-1 text-lg font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 flex-grow"
                />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">/LTR</span>
              </div>
            </div>
          </div>

          <button
            onClick={calculateRoute}
            disabled={isCalculating}
            className="w-full mt-2 relative group overflow-hidden bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 text-white font-black text-lg py-5 rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 uppercase tracking-widest"
          >
            <div className="absolute inset-x-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-12 group-hover:animate-[shimmer_2s_infinite]"></div>

            {isCalculating ? <RefreshCw className="w-5 h-5 animate-spin relative z-10" /> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 relative z-10"><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg>}
            <span className="relative z-10">{isCalculating ? "MEMPROSES DATA..." : "ENGINE START"}</span>
          </button>

        </div>

        {/* RIGHT PANEL - HASIL & MAP */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="dashboard-panel p-6 lg:p-7 relative overflow-hidden"
              >
                {/* HUD Glowing Lines */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>

                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" /> Analitik Rute Ditemukan
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#0B0F19] rounded-2xl p-4 border border-slate-800 shadow-inner flex flex-col justify-center">
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Jarak</p>
                    <p className="text-2xl md:text-3xl font-mono text-white">
                      {result.distanceKm.toLocaleString('id-ID', { maximumFractionDigits: 1 })} <span className="text-xs font-sans text-slate-500 ml-1">KM</span>
                    </p>
                  </div>
                  <div className="bg-[#0B0F19] rounded-2xl p-4 border border-slate-800 shadow-inner flex flex-col justify-center">
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Est. Durasi</p>
                    <p className="text-2xl md:text-3xl font-mono text-white">
                      {Math.floor(result.durationMins / 60) > 0 ? `${Math.floor(result.durationMins / 60)}j ` : ''}
                      {result.durationMins % 60} <span className="text-xs font-sans text-slate-500 ml-1">M</span>
                    </p>
                  </div>
                  <div className="bg-[#0B0F19] rounded-2xl p-4 border border-slate-800 shadow-inner flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 w-16 h-16 bg-blue-500/10 blur-xl rounded-full"></div>
                    <p className="text-[10px] md:text-xs font-bold text-blue-500 uppercase tracking-widest mb-1 z-10">BBM Terbakar</p>
                    <p className="text-2xl md:text-3xl font-mono text-blue-400 z-10">
                      {result.fuelNeededLiter.toLocaleString('id-ID', { maximumFractionDigits: 2 })} <span className="text-xs font-sans text-blue-500/50 ml-1">LTR</span>
                    </p>
                  </div>
                  <div className="bg-gradient-to-b from-[#132B22] to-[#0A1612] rounded-2xl p-4 border border-emerald-900 shadow-lg relative overflow-hidden col-span-2 lg:col-span-1 flex flex-col justify-center">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/20 blur-2xl rounded-full"></div>
                    <p className="text-[10px] md:text-xs font-black text-emerald-500/70 uppercase tracking-widest mb-1 z-10 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Cost</p>
                    <p className="text-2xl md:text-3xl font-mono text-emerald-400 tracking-tight z-10 text-shadow-glow">
                      <span className="text-sm font-sans mr-1 opacity-70">Rp</span>{Math.round(result.totalCost).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-grow w-full rounded-3xl overflow-hidden dashboard-panel border border-slate-700/50 relative min-h-[350px] lg:min-h-0 bg-[#0f172a]">
            {/* Overlay Grid di atas peta (hanya pointer event none) */}
            <div className="absolute inset-0 z-20 pointer-events-none border-[12px] border-[#131B2B] rounded-3xl opacity-50 mix-blend-overlay"></div>
            <MapDisplay points={waypoints} routeCoordinates={routeCoordinates} />
          </div>

        </div>
      </div>

      {/* ... [Konten SEO] ... */}
      <div className="mt-32 pt-16 border-t border-slate-800/80 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-outfit font-black text-white mb-6 tracking-tight" id="efisiensi">Spesifikasi KML Resmi (Engine DB)</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-medium">Algoritma kalkulasi kami mengambil referensi konsumsi bahan bakar (Kilometer / Liter) dari data pengujian jalan kombinasi pabrikan otomotif.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="dashboard-panel p-8">
            <h3 className="text-lg font-black text-slate-300 uppercase tracking-widest mb-8 flex items-center gap-3"><Car className="text-blue-500" /> Rasio Mobil</h3>
            <ul className="space-y-1">
              {vehiclesData.filter(v => v.type === 'mobil').map(v => (
                <li key={v.id} className="flex justify-between border-b border-slate-800/50 py-3 font-medium text-sm hover:bg-slate-800/20 px-2 rounded transition-colors group">
                  <span className="text-slate-400 group-hover:text-white transition-colors">{v.name}</span>
                  <span className="text-blue-400 font-mono bg-blue-900/20 border border-blue-900/50 px-2 py-0.5 rounded shadow-inner">{v.kml} KML</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="dashboard-panel p-8">
            <h3 className="text-lg font-black text-slate-300 uppercase tracking-widest mb-8 flex items-center gap-3"><Car className="text-emerald-500" /> Rasio Motor</h3>
            <ul className="space-y-1">
              {vehiclesData.filter(v => v.type === 'motor').map(v => (
                <li key={v.id} className="flex justify-between border-b border-slate-800/50 py-3 font-medium text-sm hover:bg-slate-800/20 px-2 rounded transition-colors group">
                  <span className="text-slate-400 group-hover:text-white transition-colors">{v.name}</span>
                  <span className="text-emerald-400 font-mono bg-emerald-900/20 border border-emerald-900/50 px-2 py-0.5 rounded shadow-inner">{v.kml} KML</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-4xl mx-auto" id="faq">
          <h2 className="text-3xl md:text-4xl font-outfit font-black text-white mb-10 tracking-tight text-center">Inteligensi Bahan Bakar</h2>

          <div className="space-y-6">
            <div className="dashboard-panel p-8 px-8 md:px-10 hover:border-slate-700 transition-colors">
              <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-3 font-outfit">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-orange-500 font-black shadow-inner">01</div>
                Bagaimana Sistem Kalkulasi Bekerja?
              </h3>
              <p className="leading-relaxed text-slate-400 ml-14 text-sm md:text-base">BahanBakar.id memadukan teknologi instrumen Geocoding OpenStreetMap dan Routing Engine OSRM untuk memetakan jarak tempuh aktual. Sistem tidak menggunakan garis lurus, melainkan mengikuti lekukan jalan darat dan jalan tol empiris sinkron dengan perhitungan GPS modern.</p>
            </div>

            <div className="dashboard-panel p-8 px-8 md:px-10 hover:border-slate-700 transition-colors">
              <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-3 font-outfit">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-orange-500 font-black shadow-inner">02</div>
                Mengapa Terdapat Deviasi BBM di Lapangan?
              </h3>
              <p className="leading-relaxed text-slate-400 ml-14 text-sm md:text-base">Parameter KML (Kilometer per Liter) yang tertanam pada database kami mengambil rerata uji coba kombinasi wajar. Beban bagasi berlebih, kemacetan rute stop-and-go agresif, hingga deviasi takik tekanan angin ban Anda dapat mereduksi tingkat efisiensi bakar secara drastis.</p>
            </div>

            <div className="dashboard-panel p-8 px-8 md:px-10 hover:border-slate-700 transition-colors">
              <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-3 font-outfit">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-orange-500 font-black shadow-inner">03</div>
                Taktik Optimasi Pembakaran (Eco-Driving)
              </h3>
              <p className="leading-relaxed text-slate-400 ml-14 text-sm md:text-base">Pertahankan RPM (Revolutions Per Minute) stabil dan hindari injakan pedal gas (akselerasi) secara tiba-tiba. Di jalan bebas hambatan, melaju konstan pada kecepatan jelajah 80-90 km/jam meminimalisasi coefisien hambat aerodinamika body kendaraan Anda secara maksimal.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%) rotate(-12deg); }
        }
        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(52, 211, 153, 0.4);
        }
      `}</style>
    </div>
  );
}
