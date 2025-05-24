import React, { createContext, useContext, useState, useEffect } from 'react';
import { EmergencyContact } from '../types';
import { useAuth } from './AuthContext';

interface EmergencyContactsContextType {
  contacts: EmergencyContact[];
  isLoading: boolean;
  error: string | null;
  addContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  updateContact: (id: string, contact: Partial<EmergencyContact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  setPrimaryContact: (id: string) => Promise<void>;
}

// Mock initial contacts
const mockContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Jane Doe',
    phone: '+1234567890',
    relationship: 'Spouse',
    isPrimary: true
  },
  {
    id: '2',
    name: 'Michael Smith',
    phone: '+1987654321',
    relationship: 'Brother',
    isPrimary: false
  }
];

const EmergencyContactsContext = createContext<EmergencyContactsContextType>({
  contacts: [],
  isLoading: false,
  error: null,
  addContact: async () => {},
  updateContact: async () => {},
  deleteContact: async () => {},
  setPrimaryContact: async () => {}
});

export const useEmergencyContacts = () => useContext(EmergencyContactsContext);

export const EmergencyContactsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load contacts when user changes
  useEffect(() => {
    if (user) {
      loadContacts();
    } else {
      setContacts([]);
    }
  }, [user]);

  const loadContacts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data for now
      setContacts(mockContacts);
    } catch (error) {
      setError('Failed to load emergency contacts.');
      console.error('Error loading contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addContact = async (contact: Omit<EmergencyContact, 'id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newContact: EmergencyContact = {
        ...contact,
        id: Math.random().toString(36).substring(2, 9),
        isPrimary: contacts.length === 0 ? true : false
      };
      
      setContacts(prev => [...prev, newContact]);
    } catch (error) {
      setError('Failed to add emergency contact.');
      console.error('Error adding contact:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateContact = async (id: string, contactUpdate: Partial<EmergencyContact>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setContacts(prev => 
        prev.map(contact => 
          contact.id === id ? { ...contact, ...contactUpdate } : contact
        )
      );
    } catch (error) {
      setError('Failed to update emergency contact.');
      console.error('Error updating contact:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const contactToDelete = contacts.find(c => c.id === id);
      setContacts(prev => prev.filter(contact => contact.id !== id));
      
      // If we deleted the primary contact, set a new one
      if (contactToDelete?.isPrimary && contacts.length > 1) {
        const remainingContacts = contacts.filter(c => c.id !== id);
        if (remainingContacts.length > 0) {
          await setPrimaryContact(remainingContacts[0].id);
        }
      }
    } catch (error) {
      setError('Failed to delete emergency contact.');
      console.error('Error deleting contact:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const setPrimaryContact = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setContacts(prev => 
        prev.map(contact => ({
          ...contact,
          isPrimary: contact.id === id
        }))
      );
    } catch (error) {
      setError('Failed to set primary emergency contact.');
      console.error('Error setting primary contact:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EmergencyContactsContext.Provider
      value={{
        contacts,
        isLoading,
        error,
        addContact,
        updateContact,
        deleteContact,
        setPrimaryContact
      }}
    >
      {children}
    </EmergencyContactsContext.Provider>
  );
};