import React from 'react';
import { MapPin, RefreshCw } from 'lucide-react';
import { useLocation } from '../../contexts/LocationContext';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export const LocationDisplay: React.FC = () => {
  const { currentLocation, isLoadingLocation, locationError, refreshLocation } = useLocation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-500" />
          Your Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        {locationError ? (
          <div className="text-center py-4">
            <p className="text-red-500 mb-2">{locationError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshLocation}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Retry
            </Button>
          </div>
        ) : isLoadingLocation ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : currentLocation ? (
          <div className="space-y-2">
            <p className="font-medium text-lg">{currentLocation.city}</p>
            <p className="text-gray-500">{currentLocation.address}</p>
            <div className="text-sm text-gray-500 mt-1">
              Coordinates: {currentLocation.coordinates.lat.toFixed(4)}, {currentLocation.coordinates.lng.toFixed(4)}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              onClick={refreshLocation}
            >
              Update Location
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-2">Location not available</p>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshLocation}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Get Location
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};