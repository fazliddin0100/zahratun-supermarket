'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLocationContext } from '@/context/LocationContext';
import '@/lib/leafletFix';

type Props = {
  height?: number;
};

export default function LeafletMap({ height = 250 }: Props) {
  const { coords } = useLocationContext();

  if (!coords) {
    return (
      <div className="h-75 flex items-center justify-center text-sm text-gray-400">
        Lokatsiya aniqlanmadi
      </div>
    );
  }

  return (
    <MapContainer
      center={[coords.lat, coords.lng]}
      zoom={15}
      scrollWheelZoom
      style={{ height, width: '100%' }}>
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[coords.lat, coords.lng]}>
        <Popup>Siz shu yerdasiz 📍</Popup>
      </Marker>
    </MapContainer>
  );
}
