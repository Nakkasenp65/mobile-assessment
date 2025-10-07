// src/app/assess/components/(step3)/LeafletMap.tsx

"use client";

import { useEffect, useRef } from "react";
import L, { LatLng, Map, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

// Import image assets directly for bundler compatibility
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// This is a common workaround for Next.js with Leaflet
// It prevents an error where Leaflet tries to find the icon URL itself.
// We are providing the URLs directly below.
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

interface LeafletMapProps {
  center: LatLng | null;
  onLatLngChange: (newLatLng: LatLng) => void;
}

const LeafletMap = ({ center, onLatLngChange }: LeafletMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);

  // Effect for initializing the map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current && center) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: 15,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

  // Effect for updating map/marker position when center prop changes
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
