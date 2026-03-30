// components/dashboard/customers/customers-page.tsx
'use client';

import { AuthType } from '@/interface/auth.interface';
import { useEffect, useState } from 'react';
import Customers from './customors';

export default function CustomersPage() {
  const [auths, setAuths] = useState<AuthType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customers', {
          method: 'GET',
          cache: 'no-store', // Har safar yangi ma'lumot olish uchun
        });

        if (!res.ok) {
          throw new Error("Ma'lumotni yuklashda xatolik yuz berdi");
        }

        const data = await res.json();
        setAuths(data.auths || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500 text-center">Xatolik: {error}</div>;
  }

  return <Customers auths={auths} />;
}
