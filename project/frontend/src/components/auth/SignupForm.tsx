import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { AtSign, User, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { useAuth } from '../../contexts/AuthContext';

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  height: yup.number().positive('Height must be positive').required('Height is required'),
  weight: yup.number().positive('Weight must be positive').required('Weight is required'),
  medicalConditions: yup.array().of(yup.string()),
  medications: yup.string(),
  emergencyContactName: yup.string().required('Emergency contact name is required'),
  emergencyContactPhone: yup.string().required('Emergency contact phone is required'),
  tachycardiaThreshold: yup.number().min(100, 'Must be at least 100').required('Tachycardia threshold is required'),
  bradycardiaThreshold: yup.number().max(60, 'Must be at most 60').required('Bradycardia threshold is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  termsAccepted: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

type FormData = yup.InferType<typeof schema>;

const medicalConditionOptions = [
  { value: 'hypertension', label: 'Hypertension' },
  { value: 'arrhythmia', label: 'Arrhythmia' },
  { value: 'coronary_artery_disease', label: 'Coronary Artery Disease' },
  { value: 'heart_failure', label: 'Heart Failure' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'hyperlipidemia', label: 'Hyperlipidemia' },
  { value: 'other', label: 'Other' },
];

export const SignupForm: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      height: 170,
      weight: 70,
      medicalConditions: [],
      medications: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      tachycardiaThreshold: 100,
      bradycardiaThreshold: 60,
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Create user object from form data
      const userData = {
        fullName: data.fullName,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender as 'male' | 'female' | 'other',
        phone: data.phone,
        height: data.height,
        weight: data.weight,
        medicalConditions: data.medicalConditions,
        medications: data.medications,
        alertThresholds: {
          tachycardia: data.tachycardiaThreshold,
          bradycardia: data.bradycardiaThreshold,
        },
      };
      
      await signup(userData, data.password);
      
      // TODO: In a real app, we would also create the emergency contact here
      navigate('/');
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const passwordValue = watch('password');
  
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    let checks = 0;
    
    // Length check
    if (password.length >= 8) checks++;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) checks++;
    
    // Lowercase check
    if (/[a-z]/.test(password)) checks++;
    
    // Number check
    if (/\d/.test(password)) checks++;
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) checks++;
    
    strength = Math.min(100, (checks / 5) * 100);
    
    let label = '';
    if (strength < 30) label = 'Weak';
    else if (strength < 70) label = 'Moderate';
    else label = 'Strong';
    
    return { strength, label };
  };
  
  const passwordStrength = getPasswordStrength(passwordValue);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Create your HeartWatch account</CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          Step {step} of {totalSteps}
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="error" className="mb-4" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}
        <form id="signup-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 && (
            <>
              <h3 className="font-medium text-lg">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="fullName"
                  label="Full Name"
                  placeholder="Enter your full name"
                  {...register('fullName')}
                  error={errors.fullName?.message}
                  leftIcon={<User className="h-5 w-5 text-gray-400" />}
                />
                
                <Input
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  {...register('email')}
                  error={errors.email?.message}
                  leftIcon={<AtSign className="h-5 w-5 text-gray-400" />}
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
                
                <Input
                  id="phone"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  {...register('phone')}
                  error={errors.phone?.message}
                  leftIcon={<Phone className="h-5 w-5 text-gray-400" />}
                />
              </div>
            </>
          )}
          
          {step === 2 && (
            <>
              <h3 className="font-medium text-lg">Health Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Conditions
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {medicalConditionOptions.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`condition-${option.value}`}
                          value={option.value}
                          {...register('medicalConditions')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`condition-${option.value}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Textarea
                  id="medications"
                  label="Current Medications"
                  placeholder="List your current medications and dosages"
                  {...register('medications')}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="tachycardiaThreshold"
                    type="number"
                    label="Tachycardia Threshold (bpm)"
                    {...register('tachycardiaThreshold', { valueAsNumber: true })}
                    error={errors.tachycardiaThreshold?.message}
                    helpText="Default: 100 bpm"
                  />
                  
                  <Input
                    id="bradycardiaThreshold"
                    type="number"
                    label="Bradycardia Threshold (bpm)"
                    {...register('bradycardiaThreshold', { valueAsNumber: true })}
                    error={errors.bradycardiaThreshold?.message}
                    helpText="Default: 60 bpm"
                  />
                </div>
              </div>
            </>
          )}
          
          {step === 3 && (
            <>
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Emergency Contacts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="emergencyContactName"
                    label="Emergency Contact Name"
                    placeholder="Enter emergency contact name"
                    {...register('emergencyContactName')}
                    error={errors.emergencyContactName?.message}
                  />
                  
                  <Input
                    id="emergencyContactPhone"
                    label="Emergency Contact Phone"
                    placeholder="Enter emergency contact phone"
                    {...register('emergencyContactPhone')}
                    error={errors.emergencyContactPhone?.message}
                  />
                </div>
                
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <h3 className="font-medium text-lg mb-4">Account Security</h3>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Create a password"
                    {...register('password')}
                    error={errors.password?.message}
                    leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    }
                  />
                  
                  {passwordValue && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            passwordStrength.strength < 30 
                              ? 'bg-red-500' 
                              : passwordStrength.strength < 70 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Password strength: {passwordStrength.label}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      {...register('confirmPassword')}
                      error={errors.confirmPassword?.message}
                      leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      }
                    />
                  </div>
                </div>
                
                <div className="flex items-start mt-4">
                  <div className="flex items-center h-5">
                    <input
                      id="termsAccepted"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      {...register('termsAccepted')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="termsAccepted" className="font-medium text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-500">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-500">
                        Privacy Policy
                      </a>
                    </label>
                    {errors.termsAccepted && (
                      <p className="text-red-600">{errors.termsAccepted.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
          >
            Previous
          </Button>
        ) : (
          <div></div>
        )}
        
        {step < totalSteps ? (
          <Button
            type="button"
            variant="primary"
            onClick={nextStep}
          >
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            form="signup-form"
            variant="primary"
            isLoading={isSubmitting}
          >
            Create Account
          </Button>
        )}
      </CardFooter>
      <div className="text-center pb-6">
        <span className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Log in
          </Link>
        </span>
      </div>
    </Card>
  );
};