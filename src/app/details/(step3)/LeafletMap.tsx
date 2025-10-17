// src/app/assess/components/(step3)/LeafletMap.tsx

"use client";

import { useEffect, useRef } from "react";
import L, { LatLng, Map, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

// CDN direct icon workaround
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LeafletMapProps {
  center: LatLng | null;
  onLatLngChange: (newLatLng: LatLng) => void;
}

const LeafletMap = ({ center, onLatLngChange }: LeafletMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);

  // Initial map creation
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current && center) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: 15,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const marker = L.marker(center, { draggable: true }).addTo(map);

      marker.on("dragend", (e) => {
        const markerLatLng = (e.target as L.Marker).getLatLng();
        onLatLngChange(markerLatLng);
      });

      mapRef.current = map;
      markerRef.current = marker;
    }
  }, [center, onLatLngChange]);

  // Update marker/map view when center changes
  useEffect(() => {
    if (mapRef.current && markerRef.current && center) {
      if (!markerRef.current.getLatLng().equals(center)) {
        markerRef.current.setLatLng(center);
      }
      mapRef.current.panTo(center);
    }
  }, [center]);

  return <div ref={mapContainerRef} className="min-h-[300px] w-full rounded border border-gray-300" />;
};

export default LeafletMap;
