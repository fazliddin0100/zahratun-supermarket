import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Plus,
  TrendingUp,
  Package,
  CheckCircle,
} from 'lucide-react';
import { SaleItemProps, StatCardProps } from '@/types/dashboardTypes';

// Animatsiya konfiguratsiyasi
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function FreshCartDashboard() {
  const recentOrders = [
    {
      id: '#FC0005',
      product: "Haldiram's Sev Bhujia",
      date: '28 March 2023',
      price: '$18.00',
      status: 'Yuborildi',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      id: '#FC0004',
      product: 'NutriChoice Digestive',
      date: '24 March 2023',
      price: '$24.00',
      status: 'Kutmoqda',
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      id: '#FC0003',
      product: 'Onion Flavour Potato',
      date: '8 Feb 2023',
      price: '$9.00',
      status: 'Bekor',
      color: 'bg-red-100 text-red-700',
    },
    {
      id: '#FC0002',
      product: 'Blueberry Greek Yogurt',
      date: '20 Jan 2023',
      price: '$12.00',
      status: 'Kutmoqda',
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      id: '#FC0001',
      product: 'Slurrp Millet Chocolate',
      date: '14 Jan 2023',
      price: '$8.00',
      status: 'Jarayonda',
      color: 'bg-cyan-100 text-cyan-700',
    },
  ];

  return (
    <motion.main
      initial="initial"
      animate="animate"
      className="p-4 md:p-8 bg-[#f8f9fa] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. HEADER BANNER */}
        <motion.section
          variants={fadeInUp}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-8 md:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-xl">
            <Badge className="mb-4 bg-white/20 hover:bg-white/30 border-none text-white backdrop-blur-md">
              Zahratun Super Market v2.0
            </Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Boshqaruv Paneli
            </h1>
            <p className="text-blue-100 mb-8 text-lg opacity-90">
              Bugungi savdolar va do`koningiz holatini real vaqt rejimida
              kuzatib boring.
            </p>
            <button className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-all shadow-lg active:scale-95">
              <Plus size={20} /> Yangi Mahsulot
            </button>
          </div>
          {/* Bezaklar */}
          <div className="absolute right-[-5%] top-[-10%] w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute left-[40%] bottom-[-20%] w-48 h-48 bg-blue-400/20 rounded-full blur-2xl" />
        </motion.section>

        {/* 2. TOP PROGRESS SECTION (Siz so'ragan yuqori qism) */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickProgress
            label="Oylik Maqsad"
            value={75}
            color="bg-blue-600"
            icon={<TrendingUp size={18} className="text-blue-600" />}
          />
          <QuickProgress
            label="Ombor To'laligi"
            value={45}
            color="bg-orange-500"
            icon={<Package size={18} className="text-orange-500" />}
          />
          <QuickProgress
            label="Mijoz Mamnuniyati"
            value={92}
            color="bg-emerald-500"
            icon={<CheckCircle size={18} className="text-emerald-500" />}
          />
        </motion.div>

        {/* 3. STATS CARDS */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Daromad"
            value="$93,438.78"
            subValue="+12.5% O'tgan oydan"
            Icon={DollarSign}
            iconColor="bg-emerald-100 text-emerald-600"
          />
          <StatCard
            title="Buyurtmalar"
            value="42,339"
            subValue="Bugun 35+ yangi"
            Icon={ShoppingCart}
            iconColor="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Mijozlar"
            value="39,354"
            subValue="+30 ta yangi mijoz"
            Icon={Users}
            iconColor="bg-purple-100 text-purple-600"
          />
        </motion.div>

        {/* 4. REVENUE & TOTAL SALES (Siz bergan dizayn asosida) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue Section */}
          <motion.div variants={fadeInUp} className="lg:col-span-8">
            <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Revenue</h3>
                    <small className="text-emerald-600 font-semibold">
                      (+63% than last year)
                    </small>
                  </div>
                  <Select defaultValue="2025">
                    <SelectTrigger className="w-[110px] bg-white">
                      <SelectValue placeholder="Yil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2023</SelectItem>
                      <SelectItem value="2024">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Animated Chart Placeholder */}
                <div className="h-[300px] w-full bg-gray-50 rounded-xl flex items-end justify-around p-4 border border-dashed">
                  {[45, 70, 55, 95, 65, 85, 75, 90, 60, 80].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.05, duration: 0.8 }}
                      className="w-full max-w-[30px] bg-blue-600/20 hover:bg-blue-600 rounded-t-md transition-colors relative group">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${h}k
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Sales Section */}
          <motion.div variants={fadeInUp} className="lg:col-span-4">
            <Card className="h-full border-none shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-8">
                  Total Sales
                </h3>
                <div className="flex justify-center mb-8">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="88"
                        cy="88"
                        r="75"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="14"
                      />
                      <motion.circle
                        cx="88"
                        cy="88"
                        r="75"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="14"
                        strokeDasharray="471"
                        initial={{ strokeDashoffset: 471 }}
                        animate={{ strokeDashoffset: 471 - 471 * 0.86 }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-3xl font-bold block text-gray-800">
                        3,271
                      </span>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                        Income
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <SaleItem
                    label="Shippings"
                    amount="$32.98"
                    percent="2%"
                    color="bg-blue-600"
                  />
                  <SaleItem
                    label="Refunds"
                    amount="$11.00"
                    percent="11%"
                    color="bg-amber-500"
                  />
                  <SaleItem
                    label="Order"
                    amount="$14.87"
                    percent="1%"
                    color="bg-rose-500"
                  />
                  <SaleItem
                    label="Income"
                    amount="3,271"
                    percent="86%"
                    color="bg-cyan-500"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 5. RECENT ORDERS TABLE */}
        <motion.div variants={fadeInUp}>
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b border-gray-50 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">
                So`nggi buyurtmalar
              </CardTitle>
              <button className="text-blue-600 text-sm font-semibold hover:underline">
                Hammasini ko`rish
              </button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow>
                      <TableHead className="font-bold py-4">ID</TableHead>
                      <TableHead className="font-bold">Mahsulot</TableHead>
                      <TableHead className="text-center font-bold">
                        Sana
                      </TableHead>
                      <TableHead className="text-right font-bold">
                        Narxi
                      </TableHead>
                      <TableHead className="text-center font-bold">
                        Holat
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="hover:bg-gray-50/80 transition-colors group">
                        <TableCell className="font-mono text-xs text-gray-500">
                          {order.id}
                        </TableCell>
                        <TableCell className="font-medium text-gray-700">
                          {order.product}
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-500">
                          {order.date}
                        </TableCell>
                        <TableCell className="text-right font-bold text-gray-800">
                          {order.price}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={`${order.color} border-none px-3 py-1 rounded-full text-[11px] font-bold`}>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.main>
  );
}

// --- Yordamchi Komponentlar ---

function QuickProgress({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-none shadow-sm p-5 bg-white hover:shadow-md transition-all group">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <span className="text-sm font-bold text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-black text-gray-800">{value}%</span>
      </div>
      <Progress value={value} className={`h-1.5 ${color} bg-gray-100`} />
    </Card>
  );
}

function StatCard({ title, value, subValue, Icon, iconColor }: StatCardProps) {
  return (
    <motion.div variants={fadeInUp}>
      <Card className="border-none shadow-sm group hover:bg-white transition-all">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {title}
              </p>
              <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                {value}
              </h3>
              <p className="text-[11px] font-bold text-emerald-500 bg-emerald-50 inline-block px-2 py-0.5 rounded">
                {subValue}
              </p>
            </div>
            <div
              className={`p-4 rounded-2xl ${iconColor} shadow-inner transition-transform group-hover:rotate-6`}>
              <Icon size={26} strokeWidth={2.5} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SaleItem({ label, amount, percent, color }: SaleItemProps) {
  return (
    <div className="flex items-center justify-between group py-1">
      <div className="flex items-center gap-3">
        <div className={`w-2.5 h-2.5 rounded-full ${color} shadow-sm`} />
        <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
          {label} <span className="font-bold ml-1 text-gray-800">{amount}</span>
        </span>
      </div>
      <span className="text-xs font-bold text-gray-400">({percent})</span>
    </div>
  );
}
