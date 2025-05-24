import React, { createContext, useContext, useState, useEffect } from 'react';
import { Location, Hospital } from '../types';
import { hereApi } from '../services/hereApi';

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
        // First try to get a high-accuracy position
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0
            }
          );
        });

        // Get multiple readings to ensure accuracy
        const positions: GeolocationPosition[] = [position];
        let watchId: number;

        const positionPromise = new Promise<GeolocationPosition>((resolve) => {
          watchId = navigator.geolocation.watchPosition(
            (pos) => {
              positions.push(pos);
              // Take average of last 3 readings if we have enough
              if (positions.length >= 3) {
                const avgLat = positions.slice(-3).reduce((sum, pos) => sum + pos.coords.latitude, 0) / 3;
                const avgLng = positions.slice(-3).reduce((sum, pos) => sum + pos.coords.longitude, 0) / 3;
                
                // Create a new position object with averaged coordinates
                const avgPosition: GeolocationPosition = {
                  ...positions[positions.length - 1],
                  coords: {
                    ...positions[positions.length - 1].coords,
                    latitude: avgLat,
                    longitude: avgLng
                  }
                };
                
                navigator.geolocation.clearWatch(watchId);
                resolve(avgPosition);
              }
            },
            null,
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
          );
        });

        // Wait for either the average position or timeout
        const finalPosition = await Promise.race([
          positionPromise,
          new Promise<GeolocationPosition>((resolve) => {
            setTimeout(() => {
              navigator.geolocation.clearWatch(watchId);
              resolve(position);
            }, 5000);
          })
        ]);

        const coords = {
          lat: finalPosition.coords.latitude,
          lng: finalPosition.coords.longitude
        };

        console.log('Final coordinates:', coords);

        // Get address from coordinates using HERE API
        const address = await hereApi.getAddressFromCoordinates(coords);
        
        setCurrentLocation({
          city: address.split(',')[0],
          address: address,
          coordinates: coords
        });

        // Automatically find nearby hospitals when location is updated
        await findNearbyHospitals();
      } else {
        setLocationError('Geolocation is not supported by this browser.');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location services to use this app.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable. Please try again.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please try again.');
            break;
          default:
            setLocationError('Unable to retrieve your location. Please try again.');
        }
      } else {
        setLocationError('Failed to get your location. Please try again.');
      }
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
      const hospitals = await hereApi.findNearbyHospitals(currentLocation.coordinates);
      setNearbyHospitals(hospitals);
    } catch (error) {
      setHospitalsError('Failed to find nearby hospitals. Please try again.');
      console.error('Error finding hospitals:', error);
    } finally {
      setIsLoadingHospitals(false);
    }
  };

  const selectHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  const getRoute = async (hospital: Hospital) => {
    if (!currentLocation) {
      console.error('Cannot get route without current location');
      return;
    }

    try {
      const route = await hereApi.getRoute(currentLocation.coordinates, hospital.coordinates);
      console.log('Route information:', route);
      selectHospital(hospital);
    } catch (error) {
      console.error('Error getting route:', error);
      setHospitalsError('Failed to get route information. Please try again.');
    }
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