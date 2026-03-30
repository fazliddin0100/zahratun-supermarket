'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export type Coords = {
  lat: number;
  lng: number;
};

export const useLocation = () => {
  const [nearest, setNearest] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(false);

  // Koordinata orqali manzil matnini olish
  const fetchAddress = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        { headers: { 'User-Agent': 'zahratun-app' } }
      );
      const data = await res.json();
      if (data.display_name) {
        setNearest(data.display_name);
      }
    } catch {
      toast.error('Manzilni olishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation support yo‘q');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        fetchAddress(latitude, longitude);
      },
      () => toast.error('Ruxsat berilmadi'),
      { enableHighAccuracy: true }
    );
  };

  return {
    nearest,
    coords,
    setCoords, 
    fetchAddress,
    detectLocation,
    loading,
  };
};
