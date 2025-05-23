import React, { createContext, useContext, useState, useEffect } from 'react';
import { HeartRateReading, Alert } from '../types';
import { useAuth } from './AuthContext';

interface HeartRateContextType {
  currentHeartRate: number;
  heartRateStatus: 'normal' | 'tachycardia' | 'bradycardia';
  heartRateHistory: HeartRateReading[];
  alerts: Alert[];
  acknowledgeAlert: (alertId: string) => void;
}

const HeartRateContext = createContext<HeartRateContextType>({
  currentHeartRate: 75,
  heartRateStatus: 'normal',
  heartRateHistory: [],
  alerts: [],
  acknowledgeAlert: () => {},
});

export const useHeartRate = () => useContext(HeartRateContext);

export const HeartRateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentHeartRate, setCurrentHeartRate] = useState(75);
  const [heartRateStatus, setHeartRateStatus] = useState<'normal' | 'tachycardia' | 'bradycardia'>('normal');
  const [heartRateHistory, setHeartRateHistory] = useState<HeartRateReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Simulate real-time heart rate data
  useEffect(() => {
    if (!user) return;

    const { tachycardia, bradycardia } = user.alertThresholds;

    // Generate a random heart rate every second
    const interval = setInterval(() => {
      // Generate a heart rate that varies slightly from the previous one
      const variation = Math.random() * 6 - 3; // -3 to +3
      const newHeartRate = Math.round(Math.max(40, Math.min(160, currentHeartRate + variation)));
      
      // Determine status based on thresholds
      let status: 'normal' | 'tachycardia' | 'bradycardia' = 'normal';
      if (newHeartRate > tachycardia) {
        status = 'tachycardia';
      } else if (newHeartRate < bradycardia) {
        status = 'bradycardia';
      }

      setCurrentHeartRate(newHeartRate);
      setHeartRateStatus(status);
      
      // Add to history
      const newReading: HeartRateReading = {
        timestamp: Date.now(),
        value: newHeartRate,
        status,
      };
      
      setHeartRateHistory(prev => {
        // Keep only the last 120 readings (2 minutes at 1 reading per second)
        const updated = [...prev, newReading];
        if (updated.length > 120) {
          return updated.slice(updated.length - 120);
        }
        return updated;
      });
      
      // Generate alert if needed
      if (status !== 'normal') {
        const existingAlertOfSameType = alerts.find(
          alert => alert.type === status && !alert.acknowledged
        );
        
        if (!existingAlertOfSameType) {
          const newAlert: Alert = {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
            type: status,
            heartRate: newHeartRate,
            acknowledged: false,
          };
          
          setAlerts(prev => [...prev, newAlert]);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentHeartRate, user, alerts]);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  return (
    <HeartRateContext.Provider
      value={{
        currentHeartRate,
        heartRateStatus,
        heartRateHistory,
        alerts,
        acknowledgeAlert,
      }}
    >
      {children}
    </HeartRateContext.Provider>
  );
};