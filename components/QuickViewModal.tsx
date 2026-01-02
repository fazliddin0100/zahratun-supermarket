'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ArrowLeftRight, ShoppingBag, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviews: number;
  image: string;
}

interface QuickViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export default function QuickViewModal({
  open,
  onOpenChange,
  product,
}: QuickViewModalProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [bgPosition, setBgPosition] = useState('center');
  const [selectedWeight, setSelectedWeight] = useState('250g');
  const [liked, setLiked] = useState(false);
  const [compared, setCompared] = useState(false);

  if (!product) return null;

  const images = product.image ? [product.image] : [];

  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return; // mobilda zoom yo‘q

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setBgPosition(`${x}% ${y}%`);
  };

  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[95vw]
          max-w-6xl
          min-w-5xl
          max-h-[90vh]
          overflow-y-auto
          p-4 sm:p-6
        ">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            {product.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* ================= IMAGE ================= */}
          <div>
            <div
              className="
                w-full
                h-64 sm:h-80 lg:h-[420px]
                border
                rounded-lg
                bg-no-repeat
                cursor-zoom-in
              "
              style={{
                backgroundImage: `url(${images[activeImage]})`,
                backgroundSize: '150%',
                backgroundPosition: bgPosition,
              }}
              onMouseMove={handleZoom}
              onMouseLeave={() => setBgPosition('center')}
            />

            {/* thumbnails */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`border rounded-lg overflow-hidden ${
                    activeImage === i
                      ? 'border-green-600'
                      : 'hover:border-green-500'
                  }`}>
                  <img
                    src={img}
                    alt="Mahsulot rasmi"
                    className="w-full h-16 sm:h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ================= INFO ================= */}
          <div className="space-y-4">
            <Badge variant="secondary">{product.category}</Badge>

            {/* rating */}
            <div className="flex items-center gap-2">
              <div className="text-yellow-500">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} ta sharh)
              </span>
            </div>

            {/* price */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl sm:text-3xl font-bold">
                ${product.price}
              </span>
              {product.oldPrice && (
                <>
                  <span className="line-through text-muted-foreground">
                    ${product.oldPrice}
                  </span>
                  {discountPercent && (
                    <span className="text-red-500 font-medium">
                      {discountPercent}% chegirma
                    </span>
                  )}
                </>
              )}
            </div>

            <hr />

            {/* weight */}
            <div className="flex flex-wrap gap-2">
              {['250g', '500g', '1kg'].map((w) => {
                const active = selectedWeight === w;
                return (
                  <Button
                    key={w}
                    variant={active ? 'default' : 'outline'}
                    className={
                      active ? 'bg-green-600 hover:bg-green-700 text-white' : ''
                    }
                    onClick={() => setSelectedWeight(w)}>
                    {w}
                  </Button>
                );
              })}
            </div>

            {/* quantity */}
            <div className="flex items-center gap-2 w-full sm:w-36">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                <Minus className="w-4 h-4" />
              </Button>
              <span className="flex-1 text-center font-medium">{quantity}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setQuantity((q) => q + 1)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex flex-row items-center justify-around gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setCompared((v) => !v)}
                  className={
                    compared ? 'bg-green-600 text-white hover:bg-green-700' : ''
                  }>
                  <ArrowLeftRight className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setLiked((v) => !v)}
                  className={
                    liked ? 'bg-green-600 text-white hover:bg-green-700' : ''
                  }>
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              <hr />

              {/* details */}
              <table className="w-full text-sm ml-5">
                <tbody>
                  <tr>
                    <td className="font-medium py-1">Mahsulot kodi:</td>
                    <td>FBB{product.id.toString().padStart(4, '0')}</td>
                  </tr>
                  <tr>
                    <td className="font-medium py-1">Mavjudligi:</td>
                    <td className="text-green-600">Sotuvda mavjud</td>
                  </tr>
                  <tr>
                    <td className="font-medium py-1">Turi:</td>
                    <td>{product.category}</td>
                  </tr>
                  <tr>
                    <td className="font-medium py-1">Yetkazib berish:</td>
                    <td>
                      1 kun ichida{' '}
                      <span className="text-muted-foreground">
                        (Bugun bepul olib ketish mumkin)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Button className="flex-1 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Savatga qo‘shish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
