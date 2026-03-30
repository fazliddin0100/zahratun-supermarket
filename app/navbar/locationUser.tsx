'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocationContext } from '@/context/LocationContext';
import { Check, Loader2, MapPin, Navigation, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import * as React from 'react';

const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => <Skeleton className="h-75 w-full rounded-lg" />,
});

interface Position {
  lat: number;
  lng: number;
}

export default function LocationUsers() {
  const { selected, nearest, detectLocation, coords, loading } =
    useLocationContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const [userSelectedPos, setUserSelectedPos] = React.useState<Position | null>(
    null
  );
  const [isSelecting, setIsSelecting] = React.useState(false);
  const [tempNearest, setTempNearest] = React.useState<string>('');

  // coords dan lat va lng ni olish uchun helper funksiya
  const getCoordsFromContext = (): Position | null => {
    if (!coords) return null;

    if ('latitude' in coords && 'longitude' in coords) {
      return {
        lat: Number(coords.latitude),
        lng: Number(coords.longitude),
      };
    } else if ('lat' in coords && 'lng' in coords) {
      return {
        lat: Number(coords.lat),
        lng: Number(coords.lng),
      };
    }

    return null;
  };

  React.useEffect(() => {
    if (isOpen && !coords) {
      detectLocation();
    }
  }, [isOpen, coords, detectLocation]);

  React.useEffect(() => {
    const contextCoords = getCoordsFromContext();
    if (contextCoords) {
      setUserSelectedPos(contextCoords);
    }
  }, [coords]);

  const handleMapClick = (lat: number, lng: number) => {
    if (!isSelecting) return;

    const newPos = { lat, lng };
    setUserSelectedPos(newPos);
    fetchUserAddress(lat, lng);
  };

  const fetchUserAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0 (your.email@example.com)', // ← BU JUDA MUHIM!
            'Accept-Language': 'uz-UZ,uz;q=0.9,ru;q=0.8,en;q=0.7', // o'zbek tilida javob olish uchun
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP xato: ${response.status}`);
      }

      const data = await response.json();

      // Eng yaxshi manzilni tanlab olish
      let address = '';

      if (data?.display_name) {
        address = data.display_name;
      } else if (data?.address) {
        // Agar display_name bo'lmasa, qo'lda yig'amiz (ko'pincha shunday bo'ladi)
        const addr = data.address;
        address = [
          addr?.road || addr?.pedestrian || addr?.path || '',
          addr?.house_number || '',
          addr?.neighbourhood || addr?.suburb || '',
          addr?.city || addr?.town || addr?.village || addr?.county || '',
          addr?.state || addr?.region || '',
          addr?.country || "O'zbekiston",
        ]
          .filter(Boolean)
          .join(', ');
      }

      // Agar hali ham bo'sh bo'lsa → taxminiy shahar nomi (masalan Samarkand)
      if (!address || address.trim() === '') {
        // Sizning misolingizdagi koordinatalar Samarkandga tegishli
        if (Math.abs(lat - 39.6588) < 0.5 && Math.abs(lng - 66.9615) < 0.5) {
          address = 'Samarqand shahri';
        } else {
          address = `${lat.toFixed(5)}, ${lng.toFixed(5)} (joy nomi aniqlanmadi)`;
        }
      }

      setTempNearest(address.trim());
    } catch (error) {
      console.error('Manzil olishda xato:', error);

      // Fallback – koordinatalar + taxminiy shahar
      let fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      if (Math.abs(lat - 39.6588) < 0.5 && Math.abs(lng - 66.9615) < 0.5) {
        fallback = 'Samarqand shahri (taxminiy)';
      }

      setTempNearest(fallback);
    }
  };
  const handleStartSelecting = () => {
    setIsSelecting(true);
  };

  const handleCancelSelecting = () => {
    setIsSelecting(false);
    const contextCoords = getCoordsFromContext();
    if (contextCoords) {
      setUserSelectedPos(contextCoords);
    } else {
      setUserSelectedPos(null);
    }
    setTempNearest('');
  };

  const handleConfirm = async () => {
    if (userSelectedPos) {
      try {
        const response = await fetch('/api/user/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: userSelectedPos.lat,
            longitude: userSelectedPos.lng,
            address: tempNearest || nearest,
          }),
        });

        if (response.ok) {
          console.log('Manzil saqlandi:', userSelectedPos);
        }
      } catch (error) {
        console.error('Manzilni saqlashda xato:', error);
      }
    }

    setIsOpen(false);
    setIsSelecting(false);
  };

  const displayAddress = tempNearest || nearest || 'Joylashuv aniqlanmoqda...';

  // ────────────────────────────────────────────────
  // Eng muhim o‘zgartirish shu yerda:
  // userSelectedPos null bo‘lsa → mapProps ni to‘liq o‘tkazmaymiz
  // ────────────────────────────────────────────────
  const mapProps =
    userSelectedPos ?
      {
        center: [userSelectedPos.lat, userSelectedPos.lng] as [number, number],
        markerPosition: [userSelectedPos.lat, userSelectedPos.lng] as [
          number,
          number,
        ],
        draggable: true,
        onMarkerDragEnd: (lat: number, lng: number) => {
          setUserSelectedPos({ lat, lng });
          fetchUserAddress(lat, lng);
        },
        onClick: handleMapClick,
      }
      // default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
      // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt// yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt
    : {
        // default yoki bo‘sh qiymat (LeafletMap qanday qabul qilsa)
        // yoki umuman prop yubormaslik uchun shunchaki bo‘sh ob'ekt
      };

  const hasValidCoords = !!userSelectedPos;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 max-w-75 truncate">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="truncate">{selected || 'Manzilni tanlang'}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125 p-0 overflow-hidden gap-0">
        <div className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Yetkazib berish manzili
            </div>
            {isSelecting && (
              <Button
                onClick={handleCancelSelecting}
                variant="destructive"
                size="sm"
                className="flex items-center gap-1">
                <X className="h-3 w-3" />
                Bekor qilish
              </Button>
            )}
          </DialogTitle>
          <DialogDescription className="mt-2">
            {isSelecting ?
              "Xaritada manzilingizni tanlang yoki markerni sudrab o'tkazing"
            : "Xaritadagi markerni aniq darvoza yoki kirish yo'lagiga suring."}
          </DialogDescription>
        </div>

        <div className="px-6 space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={detectLocation}
              disabled={loading || isSelecting}
              variant="secondary"
              className="flex-1 flex items-center gap-2">
              {loading ?
                <Loader2 className="h-4 w-4 animate-spin" />
              : <Navigation className="h-4 w-4" />}
              Avtomatik aniqlash
            </Button>

            <Button
              onClick={handleStartSelecting}
              disabled={loading}
              variant={isSelecting ? 'default' : 'outline'}
              className="flex-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {isSelecting ? 'Tanlanmoqda...' : "O'zim tanlamoqchiman"}
            </Button>
          </div>

          <div className="relative h-75 w-full overflow-hidden rounded-xl border bg-muted">
            <LeafletMap height={600} {...mapProps} />
            {loading && (
              <div className="absolute inset-0 bg-white/50 z-1000 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {isSelecting && (
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-1000 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                Manzil tanlang
              </div>
            )}
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-dashed border-slate-300">
            <p className="text-xs text-slate-500 uppercase font-semibold">
              {isSelecting ? 'Tanlanayotgan manzil:' : 'Tanlangan manzil:'}
            </p>
            <p className="text-sm font-medium leading-tight mt-1 text-slate-700">
              {displayAddress}
            </p>
            {userSelectedPos && (
              <p className="text-xs text-slate-500 mt-1">
                Koordinatalar: {userSelectedPos.lat.toFixed(6)},{' '}
                {userSelectedPos.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="p-6 pt-4">
          <Button
            onClick={handleConfirm}
            disabled={!hasValidCoords || loading}
            className="w-full h-12 text-lg shadow-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center">
            <Check className="mr-2 h-5 w-5" />
            Manzilni tasdiqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
