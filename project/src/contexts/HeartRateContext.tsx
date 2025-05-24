import React, { createContext, useContext, useState, useEffect } from 'react';
import { HeartRateReading, Alert, HealthMetrics, EmergencyType } from '../types';
import { useAuth } from './AuthContext';

// Constants for health thresholds
const HEALTH_THRESHOLDS = {
  HEART_RATE: {
    NORMAL_MIN: 60,
    NORMAL_MAX: 100,
    EMERGENCY_HIGH: 180,
    EMERGENCY_LOW: 40
  },
  OXYGEN_SAT: {
    NORMAL_MIN: 95,
    NORMAL_MAX: 100,
    EMERGENCY_LOW: 90
  },
  TEMPERATURE: {
    NORMAL_MIN: 97,
    NORMAL_MAX: 99,
    EMERGENCY_HIGH: 104,
    EMERGENCY_LOW: 95
  }
};

interface HeartRateContextType {
  currentHeartRate: number;
  heartRateStatus: 'normal' | 'tachycardia' | 'bradycardia';
  heartRateHistory: HeartRateReading[];
  alerts: Alert[];
  acknowledgeAlert: (alertId: string) => void;
  // New properties for future API integration
  isConnected: boolean;
  lastSyncTime: number | null;
  error: string | null;
}

const HeartRateContext = createContext<HeartRateContextType>({
  currentHeartRate: 75,
  heartRateStatus: 'normal',
  heartRateHistory: [],
  alerts: [],
  acknowledgeAlert: () => {},
  isConnected: false,
  lastSyncTime: null,
  error: null
});

export const useHeartRate = () => useContext(HeartRateContext);

export const HeartRateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentHeartRate, setCurrentHeartRate] = useState(75);
  const [heartRateStatus, setHeartRateStatus] = useState<'normal' | 'tachycardia' | 'bradycardia'>('normal');
  const [heartRateHistory, setHeartRateHistory] = useState<HeartRateReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to determine heart rate status
  const determineHeartRateStatus = (rate: number, thresholds: { tachycardia: number; bradycardia: number }): 'normal' | 'tachycardia' | 'bradycardia' => {
    if (rate > thresholds.tachycardia) return 'tachycardia';
    if (rate < thresholds.bradycardia) return 'bradycardia';
    return 'normal';
  };

  // Function to check for emergency conditions
  const checkEmergencyConditions = (metrics: HealthMetrics): EmergencyType[] => {
    const emergencies: EmergencyType[] = [];
    
    // Cardiac emergency check
    if (metrics.heartRate > HEALTH_THRESHOLDS.HEART_RATE.EMERGENCY_HIGH || 
        metrics.heartRate < HEALTH_THRESHOLDS.HEART_RATE.EMERGENCY_LOW) {
      emergencies.push({
        type: 'cardiac',
        severity: 'high',
        message: 'Critical heart rate detected'
      });
    }

    // Add more emergency checks here as we integrate more metrics
    // Oxygen saturation, temperature, etc.

    return emergencies;
  };

  // Simulate real-time heart rate data (temporary until API integration)
  useEffect(() => {
    if (!user) return;

    const defaultThresholds = {
      tachycardia: 100,
      bradycardia: 60
    };

    const { tachycardia = defaultThresholds.tachycardia, bradycardia = defaultThresholds.bradycardia } = user.alertThresholds || defaultThresholds;

    const interval = setInterval(() => {
      try {
        // Simulate data collection
        const variation = Math.random() * 6 - 3;
      const newHeartRate = Math.round(Math.max(40, Math.min(160, currentHeartRate + variation)));
      
        // Determine status
        const status = determineHeartRateStatus(newHeartRate, { tachycardia, bradycardia });

        // Update state
      setCurrentHeartRate(newHeartRate);
      setHeartRateStatus(status);
        setLastSyncTime(Date.now());
        setIsConnected(true);
      
      // Add to history
      const newReading: HeartRateReading = {
        timestamp: Date.now(),
        value: newHeartRate,
        status,
      };
      
      setHeartRateHistory(prev => {
        const updated = [...prev, newReading];
          return updated.length > 120 ? updated.slice(updated.length - 120) : updated;
      });
      
        // Check for emergencies
        const emergencies = checkEmergencyConditions({
          heartRate: newHeartRate,
          // Add more metrics as they become available
        });
        
        // Handle emergencies
        if (emergencies.length > 0) {
          emergencies.forEach(emergency => {
            const existingAlert = alerts.find(
              alert => alert.type === emergency.type && !alert.acknowledged
        );
        
            if (!existingAlert) {
          const newAlert: Alert = {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
                type: emergency.type,
                severity: emergency.severity,
                message: emergency.message,
            heartRate: newHeartRate,
            acknowledged: false,
          };
          
          setAlerts(prev => [...prev, newAlert]);
        }
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setIsConnected(false);
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
        isConnected,
        lastSyncTime,
        error
      }}
    >
      {children}
    </HeartRateContext.Provider>
  );
};