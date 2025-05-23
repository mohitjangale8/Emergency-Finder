export interface User {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  height: number; // in cm
  weight: number; // in kg
  medicalConditions: string[];
  medications: string;
  alertThresholds: {
    tachycardia: number;
    bradycardia: number;
    hypertensionSystolic: number;
    hypertensionDiastolic: number;
    hypotensionSystolic: number;
    hypotensionDiastolic: number;
    lowSpO2: number;
  };
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  isPrimary?: boolean;
}

export interface VitalSigns {
  timestamp: number;
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  spO2: number;
}

export interface HeartRateReading {
  timestamp: number;
  value: number;
  status: 'normal' | 'tachycardia' | 'bradycardia';
}

export interface Alert {
  id: string;
  timestamp: number;
  type: 'tachycardia' | 'bradycardia' | 'hypertension' | 'hypotension' | 'lowSpO2' | 'irregular';
  readings: {
    heartRate?: number;
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    };
    spO2?: number;
  };
  acknowledged: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: number; // in km
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Location {
  city: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}