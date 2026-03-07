"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useJsApiLoader } from "@react-google-maps/api";
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

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

function getApiUsageKey() {
  const d = new Date();
  return `bb_google_api_usage_${d.getFullYear()}_${d.getMonth() + 1}`;
}
const MAX_API_QUOTA = 10000;

export default function Home() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const checkAndIncrementQuota = useCallback((count: number = 1) => {
    if (typeof window === "undefined") return true;
    const key = getApiUsageKey();
    const current = parseInt(localStorage.getItem(key) || "0", 10);
    if (current + count > MAX_API_QUOTA) {
      return false;
    }
    localStorage.setItem(key, (current + count).toString());
    return true;
  }, []);

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

  const searchTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const useCurrentLocation = (idx: number) => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolokasi tidak didukung oleh browser Anda.");
      return;
    }
    if (!isLoaded) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (!checkAndIncrementQuota(1)) { setIsLocating(false); setErrorMsg(`Batas API Bulanan Tercapai (${MAX_API_QUOTA} request). Silakan coba lagi bulan depan.`); return; }

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
          setIsLocating(false);
          if (status === "OK" && results && results[0]) {
            const newWaypoints = [...waypoints];
            newWaypoints[idx].query = results[0].formatted_address;
            newWaypoints[idx].label = results[0].formatted_address;
            newWaypoints[idx].lat = latitude;
            newWaypoints[idx].lon = longitude;
            newWaypoints[idx].searchResults = [];
            setWaypoints(newWaypoints);
            setResult(null);
            setRouteCoordinates([]);
          } else {
            setErrorMsg("Gagal mendapatkan nama jalan dari koordinat Anda.");
          }
        });
      },
      () => {
        setIsLocating(false);
        setErrorMsg("Gagal mengakses lokasi. Pastikan izin lokasi (GPS) diaktifkan di browser/perangkat Anda.");
      }
    );
  };

  const handleSearch = (idx: number, query: string) => {
    setWaypoints(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], query, label: query, lat: null, lon: null, searchResults: [] };
      return updated;
    });

    if (searchTimers.current[idx]) clearTimeout(searchTimers.current[idx]);
    if (query.length < 3 || !isLoaded) return;

    searchTimers.current[idx] = setTimeout(() => {
      if (!checkAndIncrementQuota(1)) { setErrorMsg(`Batas API Bulanan Tercapai (${MAX_API_QUOTA} request). Silakan coba lagi bulan depan.`); return; }

      setWaypoints(prev => {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], isSearching: true };
        return updated;
      });

      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions({ input: query, componentRestrictions: { country: "id" } }, (predictions, status) => {
        const results = (predictions || []).map((p: any) => ({
          place_id: p.place_id,
          display_name: p.description
        }));
        setWaypoints(prev => {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], searchResults: results, isSearching: false };
          return updated;
        });
      });
    }, 400);
  };

  const selectLocation = (wpIdx: number, resultItem: any) => {
    if (!isLoaded || !resultItem.place_id) return;
    if (!checkAndIncrementQuota(1)) { setErrorMsg(`Batas API Bulanan Tercapai (${MAX_API_QUOTA} request). Silakan coba lagi bulan depan.`); return; }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId: resultItem.place_id }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const loc = results[0].geometry.location;
        setWaypoints(prev => {
          const updated = [...prev];
          updated[wpIdx] = {
            ...updated[wpIdx],
            query: resultItem.display_name,
            label: resultItem.display_name,
            lat: loc.lat(),
            lon: loc.lng(),
            searchResults: [],
          };
          return updated;
        });
        setResult(null);
        setRouteCoordinates([]);
      }
    });
  };

  const calculateRoute = async () => {
    setErrorMsg("");
    if (!isLoaded) return;

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

    if (!checkAndIncrementQuota(1)) { setErrorMsg(`Batas API Bulanan Tercapai (${MAX_API_QUOTA} request). Silakan coba lagi bulan depan.`); return; }

    setIsCalculating(true);

    const origin = new window.google.maps.LatLng(validPoints[0].lat!, validPoints[0].lon!);
    const destination = new window.google.maps.LatLng(validPoints[validPoints.length - 1].lat!, validPoints[validPoints.length - 1].lon!);
    const waypts = validPoints.slice(1, -1).map(p => ({
      location: new window.google.maps.LatLng(p.lat!, p.lon!),
      stopover: true
    }));

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route({
      origin,
      destination,
      waypoints: waypts,
      travelMode: window.google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      setIsCalculating(false);
      if (status === "OK" && result) {
        const route = result.routes[0];
        let totalDistanceMeters = 0;
        let totalDurationSeconds = 0;

        route.legs.forEach(leg => {
          totalDistanceMeters += leg.distance?.value || 0;
          totalDurationSeconds += leg.duration?.value || 0;
        });

        const distanceKm = totalDistanceMeters / 1000;
        const durationMins = Math.round(totalDurationSeconds / 60);

        const kml = currentVehicleData.kml;
        const fuelNeededLiter = distanceKm / kml;
        const totalCost = fuelNeededLiter * currentFuelPrice;

        setResult({ distanceKm, durationMins, fuelNeededLiter, totalCost });

        const coords = route.overview_path.map(p => [p.lat(), p.lng()]);
        setRouteCoordinates(coords);
      } else {
        setErrorMsg("Rute tidak ditemukan atau titik tujuan terpisahkan lautan / tidak bisa diakses via darat.");
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">

      {/* Subtle Glow Effects for Light Theme (Mobile Responsive sizing) */}
      <div className="absolute top-1/4 left-0 md:left-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-red-100 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 md:right-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-orange-100 rounded-full blur-[60px] md:blur-[100px] pointer-events-none"></div>

      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl md:text-6xl font-outfit font-black text-slate-900 tracking-tight mb-4 drop-shadow-sm">
          Kalkulasi Navigasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Presisi</span>.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
          Dashboard pintar untuk memproyeksikan jarak, durasi waktu, dan beban biaya bahan bakar kendaraan Anda tanpa meleset.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 relative z-10 w-full mb-10 max-w-full">

        {/* LEFT PANEL : DASHBOARD CONTROLS */}
        <div className="w-full lg:w-[45%] xl:w-1/3 flex flex-col gap-5 lg:gap-6 lg:overflow-y-auto lg:pr-2 lg:pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">

          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-start gap-3 border border-red-200 shadow-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {/* Navigasi Control */}
          <div className="dashboard-panel p-4 sm:p-6">
            <h2 className="text-sm font-black font-outfit text-slate-800 uppercase tracking-[0.2em] mb-4 sm:mb-5 flex items-center gap-2">
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
                    style={{ zIndex: 100 - idx }} // FIX: Baris atas layernya lebih tinggi agar dropdown tidak tertimpa baris bawahnya
                    className="relative"
                  >
                    <div className="flex gap-4 relative w-full">

                      {/* Timeline Node */}
                      <div className="flex flex-col items-center mt-3 z-20 w-8 flex-shrink-0 relative">
                        <div className={`w-4 h-4 rounded-full border-4 shadow-sm relative z-10 ${idx === 0 ? 'border-orange-500 bg-white' : idx === waypoints.length - 1 ? 'border-red-500 bg-white' : 'border-slate-400 bg-white'}`}></div>
                        {idx < waypoints.length - 1 && <div className="absolute top-4 bottom-[-32px] w-[2px] bg-slate-200 z-0"></div>}

                        {/* Swap Button moved cleanly to center of timeline, enlarged for touch */}
                        {idx < waypoints.length - 1 && (
                          <div className="absolute top-[calc(100%+16px)] z-30">
                            <button
                              suppressHydrationWarning
                              onClick={() => swapWaypoints(idx, idx + 1)}
                              className="bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-orange-500 hover:border-orange-500/50 p-2 sm:p-1.5 rounded-full transition-all hover:scale-110 flex items-center justify-center bg-clip-padding"
                              title="Tukar Posisi"
                            >
                              <ArrowUpDown className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex-grow w-full pb-2">
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                            {idx === 0 ? "Keberangkatan" : idx === waypoints.length - 1 ? "Destinasi Akhir" : `Check-point ${idx}`}
                          </label>
                          {idx === 0 && (
                            <button
                              suppressHydrationWarning
                              onClick={() => useCurrentLocation(idx)}
                              disabled={isLocating}
                              className="text-[10px] font-bold text-orange-600 hover:text-orange-500 flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded border border-orange-200 transition-colors uppercase tracking-wider"
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
                            placeholder={idx === 0 ? "Ketik lokasi awal..." : "Ketik destinasi..."}
                            className={`w-full pl-10 sm:pl-11 pr-10 sm:pr-11 py-3 sm:py-3.5 bg-slate-50 shadow-inner border rounded-xl text-sm transition-all text-slate-900 placeholder:text-slate-400 ${wp.lat && wp.lon ? 'border-orange-300 ring-1 ring-orange-100 bg-orange-50/30' : 'border-slate-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400'}`}
                          />
                          <Search className={`w-4 h-4 absolute left-3 sm:left-4 top-3.5 sm:top-4 ${wp.isSearching ? 'animate-pulse text-orange-500' : 'text-slate-400'}`} />

                          {waypoints.length > 2 && idx > 0 && (
                            <button onClick={() => removeWaypoint(wp.id)} className="absolute right-3 top-3 bg-slate-200 p-1 rounded-md text-slate-500 hover:bg-red-100 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Search Results Dropdown - Light Theme Responsive */}
                        {wp.searchResults && wp.searchResults.length > 0 && (
                          <div className="absolute z-50 mt-2 w-full max-w-full bg-white border border-slate-200 shadow-xl rounded-xl max-h-60 overflow-y-auto overflow-hidden text-slate-700">
                            {wp.searchResults.map((res: any, i: number) => (
                              <div
                                key={i}
                                onClick={() => selectLocation(idx, res)}
                                className="px-3 sm:px-4 py-3 sm:py-3 border-b border-slate-100 last:border-0 cursor-pointer text-xs sm:text-sm hover:bg-slate-50 transition-colors flex items-start gap-2"
                              >
                                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span className="font-medium">{res.display_name}</span>
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
              className="mt-6 flex items-center justify-center w-full lg:w-max mx-auto gap-2 text-xs font-black text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-6 py-3 rounded-xl transition-all border border-slate-200 uppercase tracking-widest shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" /> Tambah Check-point
            </button>
          </div>

          <div className="dashboard-panel p-4 sm:p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-sm font-black font-outfit text-slate-800 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <Car className="text-blue-500 w-4 h-4" /> Konfigurasi Mesin
              </h2>
              <div className="relative">
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 appearance-none shadow-sm transition-colors"
                >
                  <optgroup label="Daftar Sepeda Motor">
                    {vehiclesData.filter(v => v.type === 'motor').map(v => (
                      <option key={v.id} value={v.id}>{v.name} (~{v.kml} KM/L)</option>
                    ))}
                  </optgroup>
                  <optgroup label="Daftar Mobil Keluarga & SUV">
                    {vehiclesData.filter(v => v.type === 'mobil').map(v => (
                      <option key={v.id} value={v.id}>{v.name} (~{v.kml} KM/L)</option>
                    ))}
                  </optgroup>
                  <option value="custom">⚙️ SETUP MANUAL KML</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 sm:top-4 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {selectedVehicle === "custom" && (
                <div className="mt-4 flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <div className="relative flex-grow">
                    <input
                      type="number"
                      value={customKml}
                      onChange={(e) => setCustomKml(e.target.value)}
                      placeholder="Misal: 45.5"
                      className="w-full bg-transparent border-b border-slate-300 py-1 text-lg font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">KM/L</span>
                </div>
              )}
            </div>

            <hr className="border-slate-100 my-1" />

            <div>
              <h2 className="text-sm font-black font-outfit text-slate-800 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
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
                  className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 appearance-none shadow-sm transition-colors"
                >
                  {fuelsData.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-3.5 sm:top-4 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              <div className="mt-4 flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-emerald-500 font-bold">Rp</span>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-300 py-1 text-lg font-mono text-emerald-600 focus:outline-none focus:border-emerald-500 flex-grow"
                />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">/LTR</span>
              </div>
            </div>
          </div>

          <button
            suppressHydrationWarning
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
        <div className="w-full lg:w-[55%] xl:w-2/3 flex flex-col gap-6 lg:min-h-[800px]">

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="dashboard-panel p-4 sm:p-6 lg:p-7 relative overflow-hidden ring-1 ring-orange-500/20"
              >
                {/* HUD Glowing Lines */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-80"></div>

                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" /> Analitik Rute Ditemukan
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-center">
                    <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Total Jarak</p>
                    <p className="text-2xl md:text-3xl font-mono font-bold text-slate-800">
                      {result.distanceKm.toLocaleString('id-ID', { maximumFractionDigits: 1 })} <span className="text-xs font-sans text-slate-500 ml-1">KM</span>
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-center">
                    <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Est. Durasi</p>
                    <p className="text-2xl md:text-3xl font-mono font-bold text-slate-800">
                      {Math.floor(result.durationMins / 60) > 0 ? `${Math.floor(result.durationMins / 60)}j ` : ''}
                      {result.durationMins % 60} <span className="text-xs font-sans text-slate-500 ml-1">M</span>
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 w-16 h-16 bg-blue-500/10 blur-xl rounded-full"></div>
                    <p className="text-[10px] md:text-xs font-black text-blue-600 uppercase tracking-widest mb-1 z-10">BBM Terbakar</p>
                    <p className="text-2xl md:text-3xl font-mono font-bold text-blue-600 z-10">
                      {result.fuelNeededLiter.toLocaleString('id-ID', { maximumFractionDigits: 2 })} <span className="text-xs font-sans text-blue-500/50 ml-1">LTR</span>
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 relative overflow-hidden col-span-2 lg:col-span-1 flex flex-col justify-center">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full"></div>
                    <p className="text-[10px] md:text-xs font-black text-emerald-600 uppercase tracking-widest mb-1 z-10 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Cost</p>
                    <p className="text-2xl md:text-3xl font-mono font-bold text-emerald-600 tracking-tight z-10">
                      <span className="text-sm font-sans mr-1 opacity-70">Rp</span>{Math.round(result.totalCost).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-grow w-full rounded-3xl overflow-hidden dashboard-panel relative h-[350px] sm:h-[450px] lg:h-full lg:min-h-0 min-h-[350px] shadow-sm border border-slate-200 bg-slate-50">
            {isLoaded ? (
              <MapDisplay points={waypoints} routeCoordinates={routeCoordinates} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-3 bg-slate-50">
                <RefreshCw className="w-6 h-6 animate-spin text-orange-500/50" />
                <span className="text-sm font-semibold tracking-widest uppercase">Menghubungkan Satelit...</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* SEO INFO SECTION */}
      <div className="mt-32 pt-16 border-t border-slate-200 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-outfit font-black text-slate-900 mb-6 tracking-tight" id="efisiensi">Spesifikasi KML Resmi (Engine DB)</h2>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium">Algoritma kalkulasi kami mengambil referensi konsumsi bahan bakar (Kilometer / Liter) dari data pengujian jalan kombinasi pabrikan otomotif.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="dashboard-panel p-8">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3"><Car className="text-blue-500" /> Rasio Mobil</h3>
            <ul className="space-y-1">
              {vehiclesData.filter(v => v.type === 'mobil').map(v => (
                <li key={v.id} className="flex justify-between border-b border-slate-100 py-3 font-medium text-sm hover:bg-slate-50 px-2 rounded transition-colors group">
                  <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{v.name}</span>
                  <span className="text-blue-600 font-mono font-bold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded shadow-sm">{v.kml} KML</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="dashboard-panel p-8">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3"><Car className="text-emerald-500" /> Rasio Motor</h3>
            <ul className="space-y-1">
              {vehiclesData.filter(v => v.type === 'motor').map(v => (
                <li key={v.id} className="flex justify-between border-b border-slate-100 py-3 font-medium text-sm hover:bg-slate-50 px-2 rounded transition-colors group">
                  <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{v.name}</span>
                  <span className="text-emerald-600 font-mono font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shadow-sm">{v.kml} KML</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-4xl mx-auto" id="artikel">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-outfit font-black text-slate-900 mb-6 tracking-tight">Ensiklopedia Efisiensi BBM</h2>
            <p className="text-slate-600 text-lg font-medium">Panduan komprehensif, wawasan industri otomotif, dan metodologi kalkulasi konsumsi bahan bakar modern yang menjadi fondasi alat kami.</p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 font-outfit border-b border-slate-100 pb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-white flex items-center justify-center font-black shadow-md">01</div>
                Metodologi Rasio KML & Algoritma Routing
              </h3>
              <div className="text-slate-700 space-y-4 leading-relaxed">
                <p>
                  Sistem Kalkulator <strong>BahanBakar.id</strong> bukanlah alat perkalian jarak lurus konvensional. Kami merangkai *Routing Engine* modern yang menarik garis geometris aktual menyusuri aspal jalan raya, gang, dan jalan tol berdasarkan topologi peta bumi (*OpenStreetMap* dan teknologi navigasi mutakhir). Proses ini memastikan jarak tempuh yang ditakar bukanlah garis imajiner burung (<em>As The Crow Flies</em>), melainkan jarak setir nyata yang akan dilibas oleh roda kendaraan Anda.
                </p>
                <p>
                  Akurasi jarak tersebut kemudian disilangkan dengan variabel krusial kedua: <strong>KML (Kilometer per Liter)</strong>. Parameter efisiensi KML yang tertanam pada pusat basis data (database) otomotif kami diambil dari angka rata-rata uji jalan kombinasi (<em>Combined Cycle</em>) yang dirilis oleh pabrikan perakitan resmi maupun jurnal uji coba laboratorium otonom. Angka KML ini mencerminkan sanggupnya satu liter bahan bakar (BBM) mendorong massa sasis kendaraan di atas lintasan beton dan aspal pada kondisi *idle* maupun pacu stabil. Inilah jembatan utama untuk memproyeksikan kubikasi bensin yang bakal terbakar dalam blok mesin.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 font-outfit border-b border-slate-100 pb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center font-black shadow-md">02</div>
                Mengapa Hasil Kalkulasi Terdapat Deviasi di Lapangan?
              </h3>
              <div className="text-slate-700 space-y-4 leading-relaxed">
                <p>
                  Sebagai kalkulator logis mekanikal, BahanBakar.id membaca kondisi rute sebagai variabel konstan. Namun, hukum mekanika di dunia nyata mengenal ribuan anomali gesekan. Sangat lazim ketika pengguna menemukan bahwa prakiraan meteran bensin (<em>Fuel Gauge</em>) kendaraan menyimput *deviasi margin* (biasanya berkisar 5% hingga 15%) dari keluaran takaran algoritma kami. Berikut adalah penyabot utama yang "mencuri" efisiensi mesin Anda secara diam-diam:
                </p>
                <ul className="list-disc pl-6 space-y-3 font-medium text-slate-600 mt-4 mb-4">
                  <li><strong>Resistansi Aerodinamis & Beban Ekstra:</strong> Membawa muatan empat orang penumpang dan kargo bagasi atap (<em>Roof Box</em>) menambah tonase kendaraan, memaksa injektor bahan bakar menyemburkan bensin lebih pekat untuk merampas Hukum Inersia.</li>
                  <li><strong>Sindrom Rute Stop-and-Go:</strong> Kemacetan ibukota adalah neraka termodinamika bagi mesin bakar. Pergerakan mengerem dan berakselerasi dari titik nol secara repetitif membakar BBM sia-sia tanpa menempuh jarak sentimeter pun (<em>Idling loss</em>).</li>
                  <li><strong>Tekanan Angin Ban Kempis:</strong> Resistansi gulir roda yang loyo menuntut torsi yang lebih berat, sehingga ECU mesin mendikte hisapan liter BBM yang lebih beringas tiap putaran kruk as.</li>
                  <li><strong>Kedisiplinan Operasi Kompresor AC:</strong> Beban kompresor pendingin kabin (AC) yang diforsir untuk melawan radiasi matahari paruh waktu merampas hingga 7% energi kinetik laju roda lori Anda.</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 font-outfit border-b border-slate-100 pb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center font-black shadow-md">03</div>
                Seni Eco-Driving: Maksimalkan Jarak, Minimalkan Biaya
              </h3>
              <div className="text-slate-700 space-y-4 leading-relaxed">
                <p>
                  Melalui observasi jurnal otomotif bertahun-tahun, metode paling revolusioner menghemat ongkos pengisian SPBU bukanlah bermigrasi ke kendaraan listrik (*EV*) seketika, namun dengan mengadaptasi tabiat mengemudi <strong>Eco-Driving</strong>.
                </p>
                <p>
                  Teknik fundamental mencakup pemanfaatan momentum inersia sasis. Angkat kaki Anda dari pedal gas puluhan meter sebelum menyentuh portal lampu lalu lintas; biarkan kinetik massa roda me-*rolling* mobil Anda tanpa satu tetes bensin pun terhisap melalui katup injeksi (berkat *deceleration fuel cut-off* di sistem injeksi sekunder). Selanjutnya, lestarikan RPM mesin (putaran) Anda secara harmonis di zona _Green Band_, yakni antara 1.500 jingga 2.500 RPM.
                </p>
                <p>
                  Pastikan filter udara blok mesin selalu diganti sesuai jadwal (*Tune-up* teratur). Sumbatan debu di manifold udara akan mencekik suplai rasio Oksigen yang menyelewengkan stoikiometri ideal pembakaran AFR (<em>Air to Fuel Ratio</em>), yang dampaknya adalah gejala memborosnya takaran bensin (<em>running rich</em>) dan asap kenalpot hitam. Mempercayai perpaduan kalkulator <em>BahanBakar.id</em> sebagai referensi awal navigasi Anda diimbangi praktek mengemudi rileks niscaya akan menyelamatkan triliunan rupiah uang bensin sepanjang masa umur kendaraan bermotor Anda.
                </p>
              </div>
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
