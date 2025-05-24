import React from 'react';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, Heart, Activity, Droplet } from 'lucide-react';
import { useHeartRate } from '../../contexts/HeartRateContext';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export const AlertsList: React.FC = () => {
  const { alerts, acknowledgeAlert } = useHeartRate();

  // Sort alerts by timestamp (newest first)
  const sortedAlerts = [...alerts]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10); // Show only the latest 10 alerts

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'tachycardia':
        return 'High Heart Rate';
      case 'bradycardia':
        return 'Low Heart Rate';
      case 'hypertension':
        return 'High Blood Pressure';
      case 'hypotension':
        return 'Low Blood Pressure';
      case 'lowSpO2':
        return 'Low Oxygen Saturation';
      case 'irregular':
        return 'Irregular Rhythm';
      default:
        return 'Unknown';
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'tachycardia':
      case 'hypertension':
        return 'text-red-600 bg-red-50';
      case 'bradycardia':
      case 'hypotension':
      case 'lowSpO2':
        return 'text-blue-600 bg-blue-50';
      case 'irregular':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'tachycardia':
      case 'bradycardia':
      case 'irregular':
        return <Heart className="h-5 w-5" />;
      case 'hypertension':
      case 'hypotension':
        return <Activity className="h-5 w-5" />;
      case 'lowSpO2':
        return <Droplet className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getAlertMessage = (alert: any) => {
    const { type, readings } = alert;
    switch (type) {
      case 'tachycardia':
        return `Heart rate elevated: ${readings.heartRate} BPM`;
      case 'bradycardia':
        return `Heart rate low: ${readings.heartRate} BPM`;
      case 'hypertension':
        return `Blood pressure high: ${readings.bloodPressure.systolic}/${readings.bloodPressure.diastolic} mmHg`;
      case 'hypotension':
        return `Blood pressure low: ${readings.bloodPressure.systolic}/${readings.bloodPressure.diastolic} mmHg`;
      case 'lowSpO2':
        return `Oxygen saturation low: ${readings.spO2}%`;
      case 'irregular':
        return `Irregular heart rhythm detected`;
      default:
        return 'Alert condition detected';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
          Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
            <p>No alerts detected</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {sortedAlerts.map((alert) => (
              <li
                key={alert.id}
                className={`p-3 rounded-md ${
                  alert.acknowledged ? 'bg-gray-50' : getAlertTypeColor(alert.type)
                } transition-colors duration-200`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className={alert.acknowledged ? 'text-gray-400' : ''}>
                        {getAlertIcon(alert.type)}
                      </span>
                      <p className={`font-medium ml-2 ${alert.acknowledged ? 'text-gray-600' : ''}`}>
                        {getAlertTypeLabel(alert.type)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {getAlertMessage(alert)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(alert.timestamp), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  {!alert.acknowledged && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};