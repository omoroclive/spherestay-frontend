import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartBar } from 'react-icons/fa';

const AnalyticsChart = ({ type = 'bar', data, xKey, yKey, title }) => {
  const chartTypes = {
    bar: (
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yKey} fill="#006644" />
      </BarChart>
    ),
    line: (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={yKey} stroke="#E83A17" />
      </LineChart>
    ),
    pie: (
      <PieChart>
        <Pie data={data} dataKey={yKey} nameKey={xKey} fill="#006644" label />
        <Tooltip />
      </PieChart>
    ),
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <FaChartBar className="text-[#006644]" />
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        {chartTypes[type]}
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;