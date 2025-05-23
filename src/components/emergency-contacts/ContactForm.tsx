import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Phone, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { useEmergencyContacts } from '../../contexts/EmergencyContactsContext';
import { EmergencyContact } from '../../types';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone number is required'),
  relationship: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

interface ContactFormProps {
  contact?: EmergencyContact;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  contact,
  onSuccess,
  onCancel,
}) => {
  const { addContact, updateContact } = useEmergencyContacts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: contact?.name || '',
      phone: contact?.phone || '',
      relationship: contact?.relationship || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      
      if (contact) {
        await updateContact(contact.id, data);
        setSuccessMessage('Contact updated successfully');
      } else {
        await addContact(data);
        setSuccessMessage('Contact added successfully');
        reset();
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(contact ? 'Failed to update contact' : 'Failed to add contact');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-500" />
          {contact ? 'Edit Contact' : 'Add Emergency Contact'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {successMessage && (
          <Alert variant="success" className="mb-4" onDismiss={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}
        
        {error && (
          <Alert variant="error" className="mb-4" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="name"
            label="Name"
            placeholder="Enter contact name"
            {...register('name')}
            error={errors.name?.message}
            leftIcon={<User className="h-5 w-5 text-gray-400" />}
          />
          
          <Input
            id="phone"
            label="Phone Number"
            placeholder="Enter contact phone number"
            {...register('phone')}
            error={errors.phone?.message}
            leftIcon={<Phone className="h-5 w-5 text-gray-400" />}
          />
          
          <Select
            id="relationship"
            label="Relationship"
            {...register('relationship')}
            options={[
              { value: '', label: 'Select relationship' },
              { value: 'spouse', label: 'Spouse' },
              { value: 'parent', label: 'Parent' },
              { value: 'child', label: 'Child' },
              { value: 'sibling', label: 'Sibling' },
              { value: 'friend', label: 'Friend' },
              { value: 'relative', label: 'Other Relative' },
              { value: 'caregiver', label: 'Caregiver' },
              { value: 'doctor', label: 'Doctor' },
              { value: 'other', label: 'Other' },
            ]}
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              {contact ? 'Update Contact' : 'Add Contact'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};