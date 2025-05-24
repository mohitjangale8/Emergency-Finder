import React from 'react';
import { useHeartRate } from '../../contexts/HeartRateContext';

export const HeartRateDisplay: React.FC = () => {
  const { currentHeartRate, heartRateStatus } = useHeartRate();

  const getStatusColor = () => {
    switch (heartRateStatus) {
      case 'tachycardia':
        return 'text-red-600';
      case 'bradycardia':
        return 'text-blue-600';
      default:
        return 'text-green-600';
    }
  };

  const getStatusText = () => {
    switch (heartRateStatus) {
      case 'tachycardia':
        return 'Tachycardia';
      case 'bradycardia':
        return 'Bradycardia';
      default:
        return 'Normal';
    }
  };

  const getBgGradient = () => {
    switch (heartRateStatus) {
      case 'tachycardia':
        return 'bg-gradient-to-r from-red-100 to-red-50';
      case 'bradycardia':
        return 'bg-gradient-to-r from-blue-100 to-blue-50';
      default:
        return 'bg-gradient-to-r from-green-100 to-green-50';
    }
  };

  const pulseAnimation = heartRateStatus !== 'normal' 
    ? 'animate-pulse' 
    : '';

  return (
    <div className={`p-8 rounded-lg shadow-md ${getBgGradient()} ${pulseAnimation} transition-colors duration-500`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-3">Heart Rate</h2>
        <div className="flex items-center justify-center">
          <svg
            className={`w-8 h-8 mr-2 ${getStatusColor()}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <span className={`text-6xl font-bold ${getStatusColor()}`}>
            {currentHeartRate}
          </span>
          <span className="text-xl text-gray-600 ml-2">BPM</span>
        </div>
        <div className={`mt-2 text-lg font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>
    </div>
  );
};