'use client';

import OrderListPage from './OrderListPage';
import OrderSinglePage from './OrdersSigne';

export default function OrdersDropdown({ type }: { type: 'list' | 'single' }) {
  return (
    <div className="p-6">
      {type === 'list' && <OrderListPage />}
      {type === 'single' && <OrderSinglePage />}
    </div>
  );
}
