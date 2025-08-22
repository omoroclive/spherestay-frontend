import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const AnalyticsCard = ({ title, value, trend, trendValue }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-2xl font-bold text-[#006644]">{value}</p>
      </div>
      {trend && (
        <div className={`flex items-center gap-2 ${trend === 'up' ? 'text-[#006644]' : 'text-[#E83A17]'}`}>
          {trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
          <span>{trendValue}%</span>
        </div>
      )}
    </div>
  );
};

export default AnalyticsCard;