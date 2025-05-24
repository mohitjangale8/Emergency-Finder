import React, { createContext, useContext, useState, useEffect } from 'react';
import { Location, Hospital } from '../types';

interface LocationContextType {
  currentLocation: Location | null;
  isLoadingLocation: boolean;
  locationError: string | null;
  nearbyHospitals: Hospital[];
  isLoadingHospitals: boolean;
  hospitalsError: string | null;
  selectedHospital: Hospital | null;
  selectHospital: (hospital: Hospital) => void;
  getRoute: (hospital: Hospital) => void;
  refreshLocation: () => Promise<void>;
  findNearbyHospitals: () => Promise<void>;
}

// Mock data for demonstration
const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'General Hospital',
    address: '123 Health St, Medical District, City',
    distance: 2.3,
    coordinates: { lat: 40.7128, lng: -74.006 }
  },
  {
    id: '2',
    name: 'Heart Specialists Center',
    address: '456 Cardiac Ave, Central, City',
    distance: 3.7,
    coordinates: { lat: 40.7138, lng: -74.016 }
  },
  {
    id: '3',
    name: 'Emergency Medical Center',
    address: '789 Response Blvd, North Side, City',
    distance: 4.5,
    coordinates: { lat: 40.7148, lng: -74.026 }
  }
];

const LocationContext = createContext<LocationContextType>({
  currentLocation: null,
  isLoadingLocation: false,
  locationError: null,
  nearbyHospitals: [],
  isLoadingHospitals: false,
  hospitalsError: null,
  selectedHospital: null,
  selectHospital: () => {},
  getRoute: () => {},
  refreshLocation: async () => {},
  findNearbyHospitals: async () => {}
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);
  const [hospitalsError, setHospitalsError] = useState<string | null>(null);
  
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  // Get user's location on component mount
  useEffect(() => {
    refreshLocation();
  }, []);

  const refreshLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      if (navigator.geolocation) {
        // Simulate geolocation API
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            setCurrentLocation({
              city: 'New York',
              address: '123 Broadway, New York, NY',
              coordinates: {
                lat: 40.7128,
                lng: -74.006
              }
            });
            resolve();
          }, 1000);
        });
      } else {
        setLocationError('Geolocation is not supported by this browser.');
      }
    } catch (error) {
      setLocationError('Unable to retrieve your location.');
      console.error('Error getting location:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const findNearbyHospitals = async () => {
    if (!currentLocation) {
      setHospitalsError('Cannot find hospitals without location access.');
      return;
    }

    setIsLoadingHospitals(true);
    setHospitalsError(null);

    try {
      // Simulate API call to find nearby hospitals
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use mock data for demonstration
      setNearbyHospitals(mockHospitals);
    } catch (error) {
      setHospitalsError('Failed to find nearby hospitals.');
      console.error('Error finding hospitals:', error);
    } finally {
      setIsLoadingHospitals(false);
    }
  };

  const selectHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  const getRoute = (hospital: Hospital) => {
    // In a real app, this would use the HERE Maps routing API
    console.log(`Getting route to ${hospital.name}`);
    
    // For demo purposes, we'll just select the hospital
    selectHospital(hospital);
    
    // In a real implementation:
    // 1. Call HERE Maps routing API
    // 2. Get turn-by-turn directions
    // 3. Render the route on the map
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        isLoadingLocation,
        locationError,
        nearbyHospitals,
        isLoadingHospitals,
        hospitalsError,
        selectedHospital,
        selectHospital,
        getRoute,
        refreshLocation,
        findNearbyHospitals
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};