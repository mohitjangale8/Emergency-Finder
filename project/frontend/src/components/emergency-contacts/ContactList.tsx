import React, { useState } from 'react';
import { Users, Edit, Trash2, Star, Phone } from 'lucide-react';
import { useEmergencyContacts } from '../../contexts/EmergencyContactsContext';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { Modal } from '../ui/Modal';
import { EmergencyContact } from '../../types';

interface ContactListProps {
  onEdit: (contact: EmergencyContact) => void;
}

export const ContactList: React.FC<ContactListProps> = ({ onEdit }) => {
  const { contacts, isLoading, error, deleteContact, setPrimaryContact } = useEmergencyContacts();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<EmergencyContact | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = (contact: EmergencyContact) => {
    setContactToDelete(contact);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;
    
    try {
      await deleteContact(contactToDelete.id);
      setSuccessMessage(`Contact "${contactToDelete.name}" deleted successfully`);
      setDeleteModalOpen(false);
      setContactToDelete(null);
    } catch (err) {
      setErrorMessage('Failed to delete contact');
      console.error(err);
    }
  };

  const handleSetPrimary = async (contact: EmergencyContact) => {
    try {
      await setPrimaryContact(contact.id);
      setSuccessMessage(`${contact.name} set as primary contact`);
    } catch (err) {
      setErrorMessage('Failed to set primary contact');
      console.error(err);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-500" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <Alert variant="success" className="mb-4" onDismiss={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          )}
          
          {errorMessage && (
            <Alert variant="error" className="mb-4" onDismiss={() => setErrorMessage(null)}>
              {errorMessage}
            </Alert>
          )}
          
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No emergency contacts added yet
            </div>
          ) : (
            <ul className="space-y-3">
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  className="p-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium text-lg">{contact.name}</p>
                        {contact.isPrimary && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Star className="w-3 h-3 mr-1" />
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500">{contact.phone}</p>
                      {contact.relationship && (
                        <p className="text-sm text-gray-500 capitalize">
                          {contact.relationship}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Phone className="h-4 w-4" />}
                        onClick={() => window.open(`tel:${contact.phone}`, '_blank')}
                      >
                        Call
                      </Button>
                      {!contact.isPrimary && (
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Star className="h-4 w-4" />}
                          onClick={() => handleSetPrimary(contact)}
                        >
                          Set as Primary
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit className="h-4 w-4" />}
                        onClick={() => onEdit(contact)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        leftIcon={<Trash2 className="h-4 w-4" />}
                        onClick={() => handleDelete(contact)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Contact"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        }
      >
        {contactToDelete && (
          <div>
            <p>Are you sure you want to delete this emergency contact?</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="font-medium">{contactToDelete.name}</p>
              <p className="text-gray-500">{contactToDelete.phone}</p>
              {contactToDelete.isPrimary && (
                <p className="text-amber-600 font-medium mt-2">
                  This is your primary emergency contact.
                </p>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              This action cannot be undone.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};