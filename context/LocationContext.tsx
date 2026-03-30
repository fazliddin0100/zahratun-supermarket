'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Coords {
  lat: number;
  lng: number;
}

interface LocationContextType {
  nearest: string | null;
  selected: string | null;
  coords: Coords | null;
  setCoords: React.Dispatch<React.SetStateAction<Coords | null>>;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
  fetchAddress: (lat: number, lng: number) => Promise<string>;
  detectLocation: () => Promise<void>;
  loading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nearest, setNearest] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAddress = async (lat: number, lng: number): Promise<string> => {
    const address = `Lat: ${lat}, Lng: ${lng}`;
    setNearest(address);
    return address;
  };

  const detectLocation = async () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lng: longitude });
          const addr = await fetchAddress(latitude, longitude);
          setSelected(addr);
          setLoading(false);
        },
        () => setLoading(false)
      );
    } else {
      setLoading(false);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        nearest,
        selected,
        coords,
        setCoords,
        setSelected,
        fetchAddress,
        detectLocation,
        loading,
      }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const ctx = useContext(LocationContext);
  if (!ctx)
    throw new Error('useLocationContext must be used within LocationProvider');
  return ctx;
};
