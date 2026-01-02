'use client';

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export default function SalesChart() {
  const options: ApexOptions = {
    chart: { id: 'sales-chart', toolbar: { show: false } },
    labels: ['Electronics', 'Fashion', 'Books', 'Others'],
    colors: ['#6366F1', '#F59E0B', '#10B981', '#EF4444'],
    legend: { position: 'bottom' },
  };

  const series = [44, 55, 13, 43];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h4 className="text-gray-600 font-medium mb-4">Total Sales</h4>
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height={300}
      />
    </div>
  );
}
