'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import {
  Camera,
  Trash2,
  MapPin,
  CreditCard,
  ChevronRight,
  Save,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditCustomers() {
  const [name, setName] = useState('Alisher Usmonov');
  const [email, setEmail] = useState('alisher@example.com');
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [birthdate, setBirthdate] = useState<Date | undefined>(
    new Date('1995-05-15')
  );
  const [photo, setPhoto] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'address' | 'payment'>('address');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Top Bar / Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <nav className="flex items-center text-sm text-gray-500 mb-1">
              <span className="hover:text-indigo-600 cursor-pointer transition">
                Mijozlar
              </span>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="text-gray-900 font-medium">Tahrirlash</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Mijoz Profilini Yangilash
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
              <X className="w-4 h-4" /> Bekor qilish
            </button>
            <button className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
              <Save className="w-4 h-4" /> Saqlash
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Avatar & Quick Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden">
              <div className="relative w-32 h-32 mx-auto mb-6 group">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-indigo-50 ring-4 ring-white shadow-lg">
                  <Image
                    src={
                      photo ||
                      'https://ui-avatars.com/api/?name=' +
                        name +
                        '&background=6366f1&color=fff&size=128'
                    }
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 cursor-pointer hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5 text-indigo-600" />
                  <Input
                    type="file"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {name || 'Ism kiritilmagan'}
              </h3>
              <p className="text-gray-500 text-sm mb-6">{email}</p>

              <div className="flex justify-center gap-4 border-t border-gray-50 pt-6">
                <Button className="p-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors group">
                  <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4">Statistika</h4>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span>Ro&apos;yxatdan o&apos;tgan</span>
                  <span className="font-medium text-gray-900">
                    12-Iyun, 2023
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span>Buyurtmalar soni</span>
                  <span className="font-medium text-indigo-600">24 ta</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Main Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
              <h3 className="text-lg font-bold text-gray-900 mb-8">
                Shaxsiy Ma&apos;lumotlar
              </h3>

              <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    To&apos;liq ism
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    placeholder="Alisher Usmonov"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Elektron pochta
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    placeholder="misol@pochta.uz"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Telefon raqam
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Tug&lsquo;ilgan sana
                  </label>
                  <Flatpickr
                    value={birthdate}
                    onChange={([date]) => setBirthdate(date)}
                    options={{ dateFormat: 'd/m/Y' }}
                    className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  />
                </div>
              </form>
            </div>

            {/* Tabs Section */}
            <div className="mt-8">
              <div className="flex p-1 bg-gray-200/50 rounded-2xl w-fit mb-6">
                <button
                  onClick={() => setActiveTab('address')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'address'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  <MapPin className="w-4 h-4" /> Manzillar
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'payment'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  <CreditCard className="w-4 h-4" /> To&lsquo;lov usullari
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'address' && (
                  <motion.div
                    key="address"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
                            <th className="px-8 py-5">Ko&lsquo;cha</th>
                            <th className="px-8 py-5">Shahar</th>
                            <th className="px-8 py-5">Davlat</th>
                            <th className="px-8 py-5 text-right px-8">Amal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          <tr className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-5 text-sm font-medium text-gray-700">
                              Toshkent ko&lsquo;chasi, 12-uy
                            </td>
                            <td className="px-8 py-5 text-sm text-gray-600">
                              Toshkent
                            </td>
                            <td className="px-8 py-5 text-sm text-gray-600">
                              O&apos;zbekiston
                            </td>
                            <td className="px-8 py-5 text-right">
                              <button className="text-gray-400 hover:text-indigo-600 p-2">
                                •••
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
