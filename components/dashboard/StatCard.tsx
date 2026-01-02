import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm h-full">
      <div className="p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">{title}</h4>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
            <span className={iconColor}>{icon}</span>
          </div>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{value}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
