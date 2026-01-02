import Image from 'next/image';

export default function FeaturesSection() {
  const features = [
    {
      icon: '/images/icons/clock.svg',
      title: '10 daqiqa oziq-ovqat',
      text: 'Buyurtmangizni eng qisqa vaqt ichida yaqin do‘kondan yetkazib beramiz.',
    },
    {
      icon: '/images/icons/gift.svg',
      title: 'Eng yaxshi narxlar',
      text: 'Mahalliy do‘konlarga qaraganda arzonroq narxlar va cashback takliflari.',
    },
    {
      icon: '/images/icons/package.svg',
      title: 'Keng assortiment',
      text: '5000 dan ortiq mahsulotlar tanlovi.',
    },
    {
      icon: '/images/icons/refresh-cw.svg',
      title: 'Oson qaytarish',
      text: 'Mahsulot yoqmasa, darhol qaytarish mumkin.',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div key={i}>
            <Image
              src={f.icon}
              alt={f.title}
              width={40}
              height={40}
              className="mb-4"
            />
            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
