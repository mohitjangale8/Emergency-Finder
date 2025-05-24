import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Alert } from '../ui/Alert';

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  height: yup.number().positive('Height must be positive').required('Height is required'),
  weight: yup.number().positive('Weight must be positive').required('Weight is required'),
  medications: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

export const ProfileSettings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
      height: user?.height || 0,
      weight: user?.weight || 0,
      medications: user?.medications || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      
      await updateUser(data);
      
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="fullName"
              label="Full Name"
              placeholder="Enter your full name"
              {...register('fullName')}
              error={errors.fullName?.message}
            />
            
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              {...register('email')}
              error={errors.email?.message}
            />
            
            <Input
              id="phone"
              label="Phone Number"
              placeholder="Enter your phone number"
              {...register('phone')}
              error={errors.phone?.message}
            />
            
            <Input
              id="dateOfBirth"
              type="date"
              label="Date of Birth"
              {...register('dateOfBirth')}
              error={errors.dateOfBirth?.message}
            />
            
            <Select
              id="gender"
              label="Gender"
              {...register('gender')}
              options={[
                { value: '', label: 'Select gender' },
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' }
              ]}
              error={errors.gender?.message}
            />
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium text-lg mb-4">Health Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                id="height"
                type="number"
                label="Height (cm)"
                {...register('height', { valueAsNumber: true })}
                error={errors.height?.message}
              />
              
              <Input
                id="weight"
                type="number"
                label="Weight (kg)"
                {...register('weight', { valueAsNumber: true })}
                error={errors.weight?.message}
              />
            </div>
            
            <Textarea
              id="medications"
              label="Current Medications"
              placeholder="List your current medications and dosages"
              {...register('medications')}
              error={errors.medications?.message}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
            >
              Reset
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};