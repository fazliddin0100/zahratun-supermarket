// @/components/map/LeafletMap.tsx
'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

// Marker uchun custom icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LeafletMapProps {
  height?: number;
  center?: [number, number];
  markerPosition?: [number, number];
  draggable?: boolean;
  onMarkerDragEnd?: (lat: number, lng: number) => void;
  onClick?: (lat: number, lng: number) => void;
}

export default function LeafletMap({
  height = 400,
  center = [41.2995, 69.2401], // Toshkent default
  markerPosition,
  draggable = false,
  onMarkerDragEnd,
  onClick,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Map yaratish
    mapRef.current = L.map(containerRef.current).setView(center, 13);

    // Tile layer qo'shish
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current);

    // Click event qo'shish
    if (onClick) {
      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        onClick(e.latlng.lat, e.latlng.lng);
      });
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    if (markerPosition) {
      // Eski marker'ni o'chirish
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Yangi marker yaratish
      markerRef.current = L.marker(markerPosition, {
        draggable,
        icon: customIcon,
      }).addTo(mapRef.current);

      // Drag end event
      if (draggable && onMarkerDragEnd) {
        markerRef.current.on('dragend', (e: L.DragEndEvent) => {
          const marker = e.target;
          const position = marker.getLatLng();
          onMarkerDragEnd(position.lat, position.lng);
        });
      }

      // Map markerga zoom qilish
      mapRef.current.setView(markerPosition, 16);
    }
  }, [markerPosition, draggable, onMarkerDragEnd]);

  return (
    <div
      ref={containerRef}
      style={{ height: `${height}px` }}
      className="w-full rounded-lg"
    />
  );
}
