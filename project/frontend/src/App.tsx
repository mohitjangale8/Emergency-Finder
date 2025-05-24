import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { HeartRateProvider } from './contexts/HeartRateContext';
import { LocationProvider } from './contexts/LocationContext';
import { EmergencyContactsProvider } from './contexts/EmergencyContactsContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { EmergencyContacts } from './pages/EmergencyContacts';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

function App() {
  return (
    <Router>
      <AuthProvider>
        <HeartRateProvider>
          <LocationProvider>
            <EmergencyContactsProvider>
              <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/contacts" 
                      element={
                        <ProtectedRoute>
                          <EmergencyContacts />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <footer className="bg-white border-t border-gray-200 py-4">
                  <div className="container mx-auto px-4">
                    <p className="text-center text-gray-500 text-sm">
                      &copy; {new Date().getFullYear()} HeartWatch. All rights reserved.
                    </p>
                  </div>
                </footer>
              </div>
            </EmergencyContactsProvider>
          </LocationProvider>
        </HeartRateProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;