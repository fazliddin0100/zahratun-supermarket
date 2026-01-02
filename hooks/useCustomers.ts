import { useEffect, useState } from 'react';
import { Customer } from '@/types/customer';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      });
  }, []);

  const addCustomer = async (payload: Partial<Customer>) => {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const newCustomer = await res.json();
    setCustomers((prev) => [newCustomer, ...prev]);
  };

  return { customers, loading, addCustomer };
}
