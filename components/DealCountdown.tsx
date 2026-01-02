'use client';

import { useEffect, useState } from 'react';

type Props = {
  targetDate: string;
};

export default function DealCountdown({ targetDate }: Props) {
  const calculateTimeLeft = () => {
    const diff = +new Date(targetDate) - +new Date();

    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [time, setTime] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-2">
      <TimeCard label="Soat" value={time.hours} />
      <TimeCard label="Minut" value={time.minutes} />
      <TimeCard label="Sekund" value={time.seconds} />
    </div>
  );
}

/* ===== Individual Card ===== */
function TimeCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="w-16 text-center">
      <div className="bg-primary text-primary-foreground rounded-lg py-2 text-lg font-bold transition-all duration-300 animate-pulse">
        {String(value).padStart(2, '0')}
      </div>
      {/* <span className="text-xs text-muted-foreground mt-1 block">{label}</span> */}
    </div>
  );
}
