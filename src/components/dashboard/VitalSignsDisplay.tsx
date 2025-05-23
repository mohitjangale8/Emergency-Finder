import React from 'react';
import { useVitalSigns } from '../../contexts/VitalSignsContext';
import { Heart, Activity, Droplet } from 'lucide-react';

export const VitalSignsDisplay: React.FC = () => {
  const { currentVitals, getVitalStatus } = useVitalSigns();

  const getStatusColor = (type: string, value: number) => {
    const status = getVitalStatus(type, value);
    switch (status) {
      case 'high':
        return 'text-red-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-green-600';
    }
  };

  const getBgGradient = (type: string, value: number) => {
    const status = getVitalStatus(type, value);
    switch (status) {
      case 'high':
        return 'bg-gradient-to-r from-red-100 to-red-50';
      case 'low':
        return 'bg-gradient-to-r from-blue-100 to-blue-50';
      default:
        return 'bg-gradient-to-r from-green-100 to-green-50';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Heart Rate */}
      <div className={`p-6 rounded-lg shadow-md ${getBgGradient('heartRate', currentVitals.heartRate)}`}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Heart className={`w-6 h-6 ${getStatusColor('heartRate', currentVitals.heartRate)}`} />
            <h3 className="text-lg font-semibold ml-2">Heart Rate</h3>
          </div>
          <div className="flex items-center justify-center">
            <span className={`text-4xl font-bold ${getStatusColor('heartRate', currentVitals.heartRate)}`}>
              {currentVitals.heartRate}
            </span>
            <span className="text-lg text-gray-600 ml-2">BPM</span>
          </div>
        </div>
      </div>

      {/* Blood Pressure */}
      <div className={`p-6 rounded-lg shadow-md ${getBgGradient('bloodPressure', currentVitals.bloodPressure.systolic)}`}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Activity className={`w-6 h-6 ${getStatusColor('bloodPressure', currentVitals.bloodPressure.systolic)}`} />
            <h3 className="text-lg font-semibold ml-2">Blood Pressure</h3>
          </div>
          <div className="flex items-center justify-center">
            <span className={`text-4xl font-bold ${getStatusColor('bloodPressure', currentVitals.bloodPressure.systolic)}`}>
              {currentVitals.bloodPressure.systolic}/{currentVitals.bloodPressure.diastolic}
            </span>
            <span className="text-lg text-gray-600 ml-2">mmHg</span>
          </div>
        </div>
      </div>

      {/* SpO2 */}
      <div className={`p-6 rounded-lg shadow-md ${getBgGradient('spO2', currentVitals.spO2)}`}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Droplet className={`w-6 h-6 ${getStatusColor('spO2', currentVitals.spO2)}`} />
            <h3 className="text-lg font-semibold ml-2">Oxygen Saturation</h3>
          </div>
          <div className="flex items-center justify-center">
            <span className={`text-4xl font-bold ${getStatusColor('spO2', currentVitals.spO2)}`}>
              {currentVitals.spO2}
            </span>
            <span className="text-lg text-gray-600 ml-2">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};