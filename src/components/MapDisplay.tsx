"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom dark/neon marker
const iconDefault = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

// Polyline animation or just map fitting
function MapPoller({ points, routeCoordinates }: { points: any[], routeCoordinates: any[] }) {
    const map = useMap();

    useEffect(() => {
        if (routeCoordinates && routeCoordinates.length > 0) {
            const bounds = L.latLngBounds(routeCoordinates);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (points.length > 0) {
            const validPoints = points.filter(p => p.lat && p.lon);
            if (validPoints.length > 0) {
                const bounds = L.latLngBounds(validPoints.map(p => [p.lat, p.lon]));
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
            }
        } else {
            map.setView([-0.789275, 113.921327], 5);
        }
    }, [map, points, routeCoordinates]);

    return null;
}

export default function MapDisplay({ points, routeCoordinates }: { points: any[], routeCoordinates: any[] }) {
    return (
        <div className="w-full h-full rounded-3xl overflow-hidden shadow-inner border border-slate-800 bg-[#0f172a]">
            <MapContainer
                center={[-0.789275, 113.921327]}
                zoom={5}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%", zIndex: 10, background: '#0f172a' }}
            >
                {/* Menggunakan CartoDB Dark Matter untuk Map Gelap ala GPS Mobil */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {points.filter(p => p.lat && p.lon).map((p, idx) => (
                    <Marker key={p.id || idx} position={[p.lat, p.lon]} icon={iconDefault}>
                        <Popup>
                            <div className="text-slate-200">
                                <strong className="text-orange-500 font-outfit uppercase tracking-widest text-xs mb-1 block">
                                    {idx === 0 ? "Titik Keberangkatan" : idx === points.length - 1 ? "Destinasi Akhir" : `Titik Transit ${idx}`}
                                </strong>
                                <span className="text-sm">{p.label || "Lokasi Pin"}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {routeCoordinates && routeCoordinates.length > 0 && (
                    <Polyline positions={routeCoordinates} color="#f97316" weight={5} opacity={0.9} />
                )}

                <MapPoller points={points} routeCoordinates={routeCoordinates} />
            </MapContainer>
        </div>
    );
}
