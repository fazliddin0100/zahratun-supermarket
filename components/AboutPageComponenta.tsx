'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  MapPin,
  CheckCircle2,
  Utensils,
  HeartHandshake,
  Briefcase,
  Coffee,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import Header from '@/app/main/page';

const ZahratunAbout = () => {
  const branches = [
    {
      name: 'Kogon markaziy',
      address: "Do'stlik ko'chasi, 10A",
      hours: '07:00 - 00:00',
      description: 'Keng savdo zali va oilaviy xaridlar uchun qulay maskan',
    },
    {
      name: 'Buxoro shahar',
      address: "Piri Dastgir ko'chasi, 12/7",
      hours: '07:00 - 23:00',
      description: 'Shaharning markazida zamonaviy supermarket',
    },
    {
      name: 'Jondor filiali',
      address: "M. Tarobiy ko'chasi, 64",
      hours: '08:00 - 22:00',
      description: 'Mahalliy aholi uchun yaqin va ishonchli',
    },
    {
      name: 'G‘ijduvon filiali',
      address: "Yusuf Hamadoniy ko'chasi",
      hours: '07:00 - 23:00',
      description: 'Milliy mahsulotlar keng tanlovi',
    },
    {
      name: 'Olot filiali',
      address: "Buxoro shoh ko'chasi",
      hours: '08:00 - 22:00',
      description: 'Qulay joylashuv va tezkor xizmat',
    },
    {
      name: 'Vobkent filiali',
      address: 'Markaziy maydon',
      hours: '07:00 - 22:00',
      description: 'Har kuni yangi va sifatli mahsulotlar',
    },
  ];

  const features = [
    {
      title: 'Zahratun Fast-Food',
      desc: 'Burger, lavash va milliy fast-food mahsulotlari.',
      icon: <Coffee className="w-8 h-8 text-yellow-500" />,
    },
    {
      title: "O'zimizning Nonvoyxona",
      desc: 'Har kuni yangi non va qandolat mahsulotlari.',
      icon: <Utensils className="w-8 h-8 text-orange-500" />,
    },
    {
      title: 'Sifat Nazorati',
      desc: "Mahsulotlar qat'iy sifat tekshiruvdan o'tadi.",
      icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
    },
    {
      title: 'Yetkazib Berish',
      desc: "Buxoro viloyati bo'ylab tezkor yetkazib berish.",
      icon: <Truck className="w-8 h-8 text-blue-500" />,
    },
    {
      title: 'Xayriya',
      desc: 'Har oy Saxovat tadbirlari tashkil etiladi.',
      icon: <HeartHandshake className="w-8 h-8 text-red-500" />,
    },
    {
      title: 'Karyera',
      desc: "500+ yoshlar uchun ish o'rni yaratilgan.",
      icon: <Briefcase className="w-8 h-8 text-indigo-500" />,
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* navbar */}
      <Header />
      {/* HERO */}
      <section className="relative h-[80vh] flex items-center justify-center bg-green-900 overflow-hidden">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578916171728-46686eac8d58"
            alt="Zahratun"
            fill
            className="object-cover"
          />
        </motion.div>

        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Sifat va Baraka <br />
            <span className="text-green-400">Maskani</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-200">
            Zahratun supermarketlar tarmog‘i — Buxoro bo‘ylab sifatli
            mahsulotlar va ishonchli xizmat.
          </p>
        </div>
      </section>

      {/* TARIX */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-4xl font-extrabold mb-8">Zahratun tarixi</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Zahratun kompaniyasi mahalliy aholi ehtiyojlarini inobatga olgan
            holda tashkil etilgan. Bugungi kunda u Buxoro viloyatidagi eng
            ishonchli supermarketlar tarmog‘iga aylandi.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-sm border">
              {f.icon}
              <h3 className="text-xl font-bold mt-4 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="py-24 bg-slate-100">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl">
            <h3 className="font-bold text-xl mb-4">Missiya</h3>
            <p className="text-gray-600">
              Har bir oilaga sifatli mahsulotlarni qulay narxlarda yetkazish.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl">
            <h3 className="font-bold text-xl mb-4">Qadriyatlar</h3>
            <p className="text-gray-600">
              Halollik, mijoz roziligi va jamoaviylik.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl">
            <h3 className="font-bold text-xl mb-4">Maqsad</h3>
            <p className="text-gray-600">
              Respublika bo‘ylab yetakchi milliy brendga aylanish.
            </p>
          </div>
        </div>
      </section>

      {/* BRANCHES */}
      <section className="py-24">
        <div className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((b, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
              <MapPin className="text-green-600 mb-2" />
              <h4 className="font-bold">{b.name}</h4>
              <p className="text-sm text-gray-500">{b.address}</p>
              <p className="text-xs text-gray-400">{b.description}</p>
              <div className="text-green-700 text-xs mt-2 flex items-center gap-1">
                <Clock size={14} /> {b.hours}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ZahratunAbout;
