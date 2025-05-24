import React, { useState, useEffect } from 'react';
import { hereApi } from '../services/hereApi';
import Map from './Map';

interface Coordinates {
  lat: number;
  lng: number;
}

interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: number;
  coordinates: Coordinates;
}

interface RouteInfo {
  duration: number;
  length: number;
  traffic: {
    congestion: number;
    status: 'free' | 'moderate' | 'heavy';
  };
}

const LocationServices: React.FC = () => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      setLoading(true);
      setError('');

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const coords: Coordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      setUserLocation(coords);
      await getAddressFromCoordinates(coords);
      await findNearbyHospitals(coords);
    } catch (error) {
      console.error('Error getting location:', error);
      setError('Failed to get your location. Please enable location services.');
    } finally {
      setLoading(false);
    }
  };

  const getAddressFromCoordinates = async (coords: Coordinates) => {
    try {
      const address = await hereApi.getAddressFromCoordinates(coords);
      setUserAddress(address);
    } catch (error) {
      console.error('Error getting address:', error);
      setError('Failed to get your address.');
    }
  };

  const findNearbyHospitals = async (coords: Coordinates) => {
    try {
      const nearbyHospitals = await hereApi.findNearbyHospitals(coords);
      setHospitals(nearbyHospitals);
    } catch (error) {
      console.error('Error finding hospitals:', error);
      setError('Failed to find nearby hospitals.');
    }
  };

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setRouteInfo(null); // Reset route info when selecting a new hospital
  };

  const handleRouteLoaded = (route: RouteInfo) => {
    setRouteInfo(route);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  const formatDistance = (meters: number): string => {
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(1)} km`;
  };

  return (
    <div className="p-4">
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {userLocation && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Your Location</h2>
          <p className="text-gray-600">{userAddress}</p>
        </div>
      )}

      {hospitals.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Nearby Hospitals</h2>
          <div className="space-y-2">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedHospital?.id === hospital.id
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleHospitalSelect(hospital)}
              >
                <h3 className="font-medium">{hospital.name}</h3>
                <p className="text-sm text-gray-600">{hospital.address}</p>
                <p className="text-sm text-gray-500">
                  {formatDistance(hospital.distance)} away
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedHospital && userLocation && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Route Information</h2>
          <Map
            userLocation={userLocation}
            hospitalLocation={selectedHospital.coordinates}
            onRouteLoaded={handleRouteLoaded}
          />
          {routeInfo && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{formatDuration(routeInfo.duration)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Distance</p>
                  <p className="font-medium">{formatDistance(routeInfo.length)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Traffic Status</p>
                  <p className="font-medium capitalize">{routeInfo.traffic.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Congestion</p>
                  <p className="font-medium">
                    {Math.round(routeInfo.traffic.congestion * 100)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationServices; 