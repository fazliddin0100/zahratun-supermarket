import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FOOTER_DATA = {
  categories: [
    { title: 'Sabzavot va mevalar', href: '/category/meva-va-sabzavotlar' },
    { title: 'Sut mahsulotlari', href: '/category/sut-non-va-tuxum' },
    { title: 'Ichimliklar', href: '/category/ichimliklar' },
    { title: 'Go‘sht mahsulotlari', href: '/category/gosht-va-baliq' },
  ],
  company: [
    { title: 'Biz haqimizda', href: '/about' },
    { title: 'Karyera', href: '/career' },
    { title: 'Yetkazib berish', href: '/delivery' },
    { title: 'Shartnoma', href: '/terms' },
  ],
  support: [
    { title: 'Yordam markazi', href: '/help' },
    { title: 'Qaytarish', href: '/return' },
    { title: 'Aloqa', href: '/contact' },
    { title: 'Savol-javob', href: '/faq' },
  ],
  payment: [
    '/images/payment/visa.svg',
    '/images/payment/mastercard.svg',
    '/images/payment/payme-01.png',
    '/images/payment/Click.png',
  ],
  social: [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'Youtube' },
  ],
};

export default function Footer() {
  return (
    <footer className=" bg-[#f0f1f2] text-shadow-muted-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo & About */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <Image
                src="/zahratun-logo.png"
                alt="Zahratun"
                width={160}
                height={50}
                className="mr-4"
              />
              <div>
                <p className="text-sm opacity-75">
                  Sifatli mahsulotlar uyingizda
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Uyingizgacha yetqazib berish. 10,000+ qoniqarli mijozlar.
            </p>
            <div className="flex flex-row justify-center  space-x-4">
              {FOOTER_DATA.social.map(({ icon: Icon, href, label }, i) => (
                <Button
                  key={i}
                  asChild
                  variant="ghost"
                  size="icon"
                  className=" h-12 w-12 rounded-2xl bg-white/10 hover:bg-white/20">
                  <Link href={href} aria-label={label}>
                    <Icon className="h-6 w-6" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Columns */}
          {[
            { title: 'Kategoriyalar', items: FOOTER_DATA.categories },
            { title: 'Kompaniya', items: FOOTER_DATA.company },
            { title: 'Mijozlar uchun', items: FOOTER_DATA.support },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="font-bold text-lg mb-6">{col.title}</h4>
              <ul className="space-y-3">
                {col.items.map((item, j) => (
                  <li key={j}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-gray-800 transition-colors text-sm font-medium block py-2 hover:translate-x-2">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-gray-400 mb-4">
              © 2025 Zahratun. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {FOOTER_DATA.payment.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt="Payment"
                  width={80}
                  height={30}
                  className="opacity-80 hover:opacity-100 hover:bg-gray-400 hover:rounded-xl text-red-500 transition-opacity"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-muted-foreground hover:bg-white/10 rounded-xl px-6 py-3">
              Maxfiylik siyosati
            </Button>
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-muted-foreground hover:bg-white/10 rounded-xl px-6 py-3">
              Foydalanish shartlari
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
