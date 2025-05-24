import React from 'react';
import { MapPin } from 'lucide-react';
import { VitalSignsDisplay } from '../components/dashboard/VitalSignsDisplay';
import { HeartRateChart } from '../components/dashboard/HeartRateChart';
import { AlertsList } from '../components/dashboard/AlertsList';
import { LocationDisplay } from '../components/dashboard/LocationDisplay';
import { NearbyHospitals } from '../components/dashboard/NearbyHospitals';

export const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Health Dashboard</h1>
      
      <div className="mb-6">
        <VitalSignsDisplay />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <HeartRateChart />
        </div>
        <div className="lg:col-span-1">
          <AlertsList />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LocationDisplay />
        <NearbyHospitals />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
        <div className="flex items-start">
          <MapPin className="w-5 h-5 text-blue-500 mt-1 mr-2" />
          <div>
            <h3 className="font-medium text-blue-800">Location Services</h3>
            <p className="text-blue-600 text-sm">
              To get the most out of HeartWatch, please ensure location services are enabled.
              This helps us find nearby hospitals in case of an emergency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};