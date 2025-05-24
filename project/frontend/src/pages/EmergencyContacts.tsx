import React, { useState } from 'react';
import { ContactList } from '../components/emergency-contacts/ContactList';
import { ContactForm } from '../components/emergency-contacts/ContactForm';
import { EmergencyContact } from '../types';

export const EmergencyContacts: React.FC = () => {
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  const handleEditSuccess = () => {
    setEditingContact(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Emergency Contacts</h1>
      
      <div className="space-y-6">
        <ContactList onEdit={setEditingContact} />
        
        <div className="mt-8">
          {editingContact ? (
            <ContactForm
              contact={editingContact}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingContact(null)}
            />
          ) : (
            <ContactForm />
          )}
        </div>
      </div>
    </div>
  );
};