import React from 'react';
import { ProfileSettings } from '../components/settings/ProfileSettings';
import { AlertSettings } from '../components/settings/AlertSettings';

export const Settings: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <ProfileSettings />
        <AlertSettings />
      </div>
    </div>
  );
};