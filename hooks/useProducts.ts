import { useState } from 'react';

type Product = {
  uz: string;
  en: string;
  ru: string;
};

const data: Record<string, Product[]> = {
  sut_mahsulotlari: [
    { uz: 'sut', en: 'milk', ru: 'молоко' },
    { uz: 'qatiq', en: 'yogurt', ru: 'йогурт' },
    { uz: 'kefir', en: 'kefir', ru: 'кефир' },
    { uz: 'smetana', en: 'sour cream', ru: 'сметана' },
    { uz: 'pishloq', en: 'cheese', ru: 'сыр' },
    { uz: 'tvorog', en: 'cottage cheese', ru: 'творог' },
    { uz: 'sariyog‘', en: 'butter', ru: 'сливочное масло' },
  ],
  // ... boshqa kategoriyalar shu yerda
};

type Language = 'uz' | 'en' | 'ru';

export function useProducts(defaultLang: Language = 'uz') {
  const [lang, setLang] = useState<Language>(defaultLang);

  const allProducts = Object.entries(data).flatMap(([category, items]) =>
    items.map((item) => ({
      category,
      name: item[lang],
      translations: item,
    }))
  );

  return {
    lang,
    setLang,
    categories: Object.keys(data),
    products: allProducts,
    getByCategory: (category: string) =>
      (data[category as keyof typeof data] || []).map((item: Product) => ({
        name: item[lang],
        translations: item,
      })),
  };
}
