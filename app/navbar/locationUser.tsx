'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MdMyLocation } from 'react-icons/md';
import { FaLocationDot } from 'react-icons/fa6';
import { useLocationContext } from '@/context/LocationContext';

/**
 * Leaflet SSR muammosi sabab dynamic import
 */
const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
});

export default function LocationUsers() {
  const { selected, nearest, detectLocation } = useLocationContext();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <FaLocationDot />
          {selected ?? 'Hududni tanlash'}
        </Button>
      </DialogTrigger>

      <DialogContent
        aria-describedby="location-description"
        className="sm:max-w-md">
        <DialogTitle className="text-lg font-bold">
          Yetkazib berish manzili
        </DialogTitle>

        <DialogDescription
          id="location-description"
          className="text-sm text-muted-foreground">
          Buyurtmani yetkazib berish uchun aniq joyingizni tanlang yoki
          avtomatik aniqlang.
        </DialogDescription>

        <Button
          onClick={detectLocation}
          className="mt-4 w-full flex items-center gap-2">
          <MdMyLocation className="h-4 w-4" />
          Mening joyimni aniqlash
        </Button>

        {/* XARITA HAR DOIM CHIQADI */}
        <div className="mt-4 h-65 w-full overflow-hidden rounded-lg border">
          <LeafletMap />
        </div>

        {nearest && (
          <p className="mt-3 text-sm text-green-600">
            <strong>Manzil:</strong> {nearest}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
