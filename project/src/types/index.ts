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
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  heartRate: number;
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

export interface HealthMetrics {
  heartRate: number;
  oxygenSat?: number;
  temperature?: number;
  accelerometer?: {
    x: number;
    y: number;
    z: number;
  };
  location?: {
    lat: number;
    lng: number;
  };
}

export interface EmergencyType {
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
}

export interface UserAlertThresholds {
  tachycardia: number;
  bradycardia: number;
  oxygenSat?: {
    low: number;
  };
  temperature?: {
    high: number;
    low: number;
  };
}