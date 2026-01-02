'use client';

import React, { use } from 'react';
import CategoryPage from '@/components/CategoryPage';

// Kichik harflar bilan yozilgan map (Xatolikni oldini olish uchun)
const categoryMap: Record<string, string> = {
  'sut-non-va-tuxum': 'Sut, non va tuxum',
  'meva-va-sabzavotlar': 'Meva va sabzavotlar',
  ichimliklar: 'Ichimliklar',
  'gosht-va-baliq': 'Go‘sht va baliq',
  'aperatiflar-va-munchies': 'Aperatiflar va munchies',
};

export default function CategorySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 1. Paramsni "unwrap" qilish (Next.js 15+ standarti)
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const title = categoryMap[slug];

  return (
    <>
      {/* Debug ma'lumotini ekranda vaqtincha ko'rish (faqat tekshirish uchun) */}
      <div className="bg-yellow-100 text-xs p-1 text-center hidden">
        Debug: {slug} - {title}
      </div>

      <CategoryPage categoryTitle={title} categorySlug={slug} />
    </>
  );
}
