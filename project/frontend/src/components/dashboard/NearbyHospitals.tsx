import React, { useState } from 'react';
import { Guitar as Hospital, Navigation, Phone } from 'lucide-react';
import { useLocation } from '../../contexts/LocationContext';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Modal } from '../ui/Modal';

export const NearbyHospitals: React.FC = () => {
  const {
    nearbyHospitals,
    isLoadingHospitals,
    hospitalsError,
    findNearbyHospitals,
    getRoute,
  } = useLocation();
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [showRouteModal, setShowRouteModal] = useState(false);

  const handleGetRoute = (hospital: any) => {
    setSelectedHospital(hospital);
    setShowRouteModal(true);
  };

  const confirmGetRoute = () => {
    if (selectedHospital) {
      getRoute(selectedHospital);
      setShowRouteModal(false);
    }
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Hospital className="w-5 h-5 mr-2 text-blue-500" />
            Nearby Hospitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hospitalsError ? (
            <div className="text-center py-4">
              <p className="text-red-500 mb-2">{hospitalsError}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={findNearbyHospitals}
              >
                Retry
              </Button>
            </div>
          ) : nearbyHospitals.length > 0 ? (
            <ul className="space-y-3">
              {nearbyHospitals.map((hospital) => (
                <li
                  key={hospital.id}
                  className="p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <p className="font-medium">{hospital.name}</p>
                  <p className="text-sm text-gray-500">{hospital.address}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="mr-2">{hospital.distance.toFixed(1)} km away</span>
                  </div>
                  <div className="flex mt-2 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Phone className="h-4 w-4" />}
                      onClick={() => window.open(`tel:123456789`, '_blank')}
                    >
                      Call
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Navigation className="h-4 w-4" />}
                      onClick={() => handleGetRoute(hospital)}
                    >
                      Get Route
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : isLoadingHospitals ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No hospitals found nearby</p>
              <Button
                variant="primary"
                onClick={findNearbyHospitals}
              >
                Find Hospitals
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        title="Get Route to Hospital"
        size="md"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowRouteModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmGetRoute}>
              Get Directions
            </Button>
          </div>
        }
      >
        {selectedHospital && (
          <div className="space-y-4">
            <p>
              Are you sure you want to get directions to{' '}
              <span className="font-medium">{selectedHospital.name}</span>?
            </p>
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="font-medium">{selectedHospital.name}</p>
              <p className="text-sm text-gray-600">{selectedHospital.address}</p>
              <p className="text-sm text-gray-600 mt-1">
                {selectedHospital.distance.toFixed(1)} km away
              </p>
            </div>
            <p className="text-sm text-gray-500">
              This will open the map view with turn-by-turn directions.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};