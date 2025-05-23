import React, { createContext, useContext, useState, useEffect } from 'react';
import { VitalSigns } from '../types';
import { useAuth } from './AuthContext';

interface VitalSignsContextType {
  currentVitals: VitalSigns;
  vitalsHistory: VitalSigns[];
  getVitalStatus: (type: string, value: number) => 'normal' | 'high' | 'low';
}

const VitalSignsContext = createContext<VitalSignsContextType>({
  currentVitals: {
    timestamp: Date.now(),
    heartRate: 75,
    bloodPressure: {
      systolic: 120,
      diastolic: 80
    },
    spO2: 98
  },
  vitalsHistory: [],
  getVitalStatus: () => 'normal'
});

export const useVitalSigns = () => useContext(VitalSignsContext);

export const VitalSignsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentVitals, setCurrentVitals] = useState<VitalSigns>({
    timestamp: Date.now(),
    heartRate: 75,
    bloodPressure: {
      systolic: 120,
      diastolic: 80
    },
    spO2: 98
  });
  const [vitalsHistory, setVitalsHistory] = useState<VitalSigns[]>([]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      // Simulate vital signs with realistic variations
      const newVitals: VitalSigns = {
        timestamp: Date.now(),
        heartRate: Math.max(40, Math.min(160, currentVitals.heartRate + (Math.random() * 6 - 3))),
        bloodPressure: {
          systolic: Math.max(70, Math.min(190, currentVitals.bloodPressure.systolic + (Math.random() * 4 - 2))),
          diastolic: Math.max(40, Math.min(120, currentVitals.bloodPressure.diastolic + (Math.random() * 4 - 2)))
        },
        spO2: Math.max(85, Math.min(100, currentVitals.spO2 + (Math.random() * 2 - 1)))
      };

      setCurrentVitals(newVitals);
      setVitalsHistory(prev => {
        const updated = [...prev, newVitals];
        return updated.length > 120 ? updated.slice(-120) : updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentVitals, user]);

  const getVitalStatus = (type: string, value: number): 'normal' | 'high' | 'low' => {
    switch (type) {
      case 'heartRate':
        if (value > user?.alertThresholds.tachycardia!) return 'high';
        if (value < user?.alertThresholds.bradycardia!) return 'low';
        return 'normal';
      case 'bloodPressure':
        if (value > user?.alertThresholds.hypertensionSystolic!) return 'high';
        if (value < user?.alertThresholds.hypotensionSystolic!) return 'low';
        return 'normal';
      case 'spO2':
        if (value < user?.alertThresholds.lowSpO2!) return 'low';
        return 'normal';
      default:
        return 'normal';
    }
  };

  return (
    <VitalSignsContext.Provider
      value={{
        currentVitals,
        vitalsHistory,
        getVitalStatus
      }}
    >
      {children}
    </VitalSignsContext.Provider>
  );
};