'use client'; // Client-side component

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export default function RevenueChart() {
  const options: ApexOptions = {
    chart: {
      id: 'revenue-chart',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
    stroke: { curve: 'smooth' },
    colors: ['#4F46E5'],
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
  };

  const series = [
    {
      name: 'Revenue',
      data: [45000, 47000, 50000, 52000, 49000, 55000, 58000],
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h4 className="text-gray-600 font-medium mb-4">Revenue</h4>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={300}
      />
    </div>
  );
}
