import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Switch } from '../ui/Switch';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Alert } from '../ui/Alert';

const schema = yup.object().shape({
  tachycardiaThreshold: yup
    .number()
    .min(100, 'Must be at least 100')
    .max(220, 'Must be at most 220')
    .required('Tachycardia threshold is required'),
  bradycardiaThreshold: yup
    .number()
    .min(30, 'Must be at least 30')
    .max(60, 'Must be at most 60')
    .required('Bradycardia threshold is required'),
  smsAlertsEnabled: yup.boolean(),
});

type FormData = yup.InferType<typeof schema>;

export const AlertSettings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      tachycardiaThreshold: user?.alertThresholds?.tachycardia || 100,
      bradycardiaThreshold: user?.alertThresholds?.bradycardia || 60,
      smsAlertsEnabled: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      
      await updateUser({
        alertThresholds: {
          tachycardia: data.tachycardiaThreshold,
          bradycardia: data.bradycardiaThreshold,
        },
      });
      
      setSuccessMessage('Alert settings updated successfully');
    } catch (err) {
      setError('Failed to update alert settings. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
          Alert Settings
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
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Heart Rate Thresholds</h3>
            <p className="text-sm text-gray-500 mb-3">
              Customize when you'll receive alerts based on your heart rate.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="tachycardiaThreshold"
                type="number"
                label="Tachycardia Threshold (bpm)"
                helpText="Alert when heart rate exceeds this value"
                {...register('tachycardiaThreshold', { valueAsNumber: true })}
                error={errors.tachycardiaThreshold?.message}
              />
              
              <Input
                id="bradycardiaThreshold"
                type="number"
                label="Bradycardia Threshold (bpm)"
                helpText="Alert when heart rate falls below this value"
                {...register('bradycardiaThreshold', { valueAsNumber: true })}
                error={errors.bradycardiaThreshold?.message}
              />
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-medium text-lg">Notification Preferences</h3>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <Switch
                id="smsAlerts"
                checked={smsAlertsEnabled}
                onChange={setSmsAlertsEnabled}
                label="Send SMS alerts to emergency contacts"
              />
              <p className="text-sm text-gray-500 mt-2 ml-10">
                When enabled, your emergency contacts will receive SMS notifications when your heart rate exceeds the thresholds.
              </p>
            </div>
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