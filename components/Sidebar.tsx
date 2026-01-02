import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  Package,
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Mahsulotlar',
      href: '/dashboard/products',
      icon: <Package size={20} />,
    },
    {
      name: 'Buyurtmalar',
      href: '/dashboard/orders',
      icon: <ShoppingCart size={20} />,
    },
    { name: 'Mijozlar', href: '/dashboard/users', icon: <Users size={20} /> },
    {
      name: 'Sozlamalar',
      href: '/dashboard/settings',
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white p-4">
      <div className="text-2xl font-bold mb-10 px-2 text-green-500">
        Zahratun Admin
      </div>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 p-3 mb-2 rounded-lg hover:bg-slate-800 transition-colors">
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
