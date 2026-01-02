'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export type Coords = {
  lat: number;
  lng: number;
};

export const useLocation = () => {
  const [nearest, setNearest] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation qo‘llab-quvvatlanmaydi');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                // MUHIM: Nominatim talab qiladi
                'User-Agent': 'zahratun-app',
              },
            }
          );

          if (!res.ok) throw new Error('Reverse geocoding failed');

          const data = await res.json();

          if (data.display_name) {
            setNearest(data.display_name);
            setSelected(data.display_name);
          }
        } catch {
          toast.error('Manzilni aniqlashda xatolik');
        }
      },
      () => toast.error('Lokatsiyaga ruxsat berilmadi')
    );
  };

  return {
    nearest,
    selected,
    coords,
    setSelected,
    detectLocation,
  };
};
