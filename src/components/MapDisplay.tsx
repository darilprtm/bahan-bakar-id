"use client";

import { useEffect, useState, memo } from "react";
import { GoogleMap, Polyline, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "1.5rem"
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    backgroundColor: '#f8fafc'
};

function MapDisplay({ points, routeCoordinates }: { points: any[], routeCoordinates: any[] }) {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<number | null>(null);

    useEffect(() => {
        if (map) {
            const validPoints = points.filter(p => p.lat && p.lon);
            if (routeCoordinates && routeCoordinates.length > 0) {
                const bounds = new window.google.maps.LatLngBounds();
                routeCoordinates.forEach(coord => bounds.extend(new window.google.maps.LatLng(coord[0], coord[1])));
                map.fitBounds(bounds);

                // Add padding
                const listener = window.google.maps.event.addListener(map, "idle", () => {
                    if (map.getZoom()! > 16) map.setZoom(16);
                    window.google.maps.event.removeListener(listener);
                });
            } else if (validPoints.length > 0) {
                const bounds = new window.google.maps.LatLngBounds();
                validPoints.forEach(p => bounds.extend(new window.google.maps.LatLng(p.lat, p.lon)));
                map.fitBounds(bounds);

                const listener = window.google.maps.event.addListener(map, "idle", () => {
                    if (map.getZoom()! > 14) map.setZoom(14);
                    window.google.maps.event.removeListener(listener);
                });
            } else {
                map.setCenter({ lat: -0.789275, lng: 113.921327 });
                map.setZoom(5);
            }
        }
    }, [map, points, routeCoordinates]);

    // Convert routeCoordinates ([lat, lon]) to [{lat, lng}]
    const path = routeCoordinates ? routeCoordinates.map(c => ({ lat: c[0], lng: c[1] })) : [];

    return (
        <div className="w-full h-full rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50 relative z-0">
            <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={5}
                center={{ lat: -0.789275, lng: 113.921327 }}
                options={mapOptions}
                onLoad={setMap}
                onUnmount={() => setMap(null)}
            >
                {points.filter(p => p.lat && p.lon).map((p, idx) => (
                    <Marker
                        key={p.id || idx}
                        position={{ lat: p.lat, lng: p.lon }}
                        onClick={() => setSelectedMarker(idx)}
                        icon={{
                            url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png'
                        }}
                    >
                        {selectedMarker === idx && (
                            <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                                <div className="text-slate-800 p-1">
                                    <strong className="text-orange-600 font-outfit uppercase tracking-widest text-[10px] mb-1 block">
                                        {idx === 0 ? "Titik Keberangkatan" : idx === points.length - 1 ? "Destinasi Akhir" : `Titik Transit ${idx}`}
                                    </strong>
                                    <span className="text-xs font-semibold">{p.label || "Lokasi Pin"}</span>
                                </div>
                            </InfoWindow>
                        )}
                    </Marker>
                ))}

                {path.length > 0 && (
                    <Polyline
                        path={path}
                        options={{
                            strokeColor: "#f97316",
                            strokeOpacity: 0.9,
                            strokeWeight: 5,
                        }}
                    />
                )}
            </GoogleMap>
        </div>
    );
}

export default memo(MapDisplay);
