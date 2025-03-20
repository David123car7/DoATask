'use client'; // Mark this as a Client Component

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpSchema } from '../schema/signup-form-schema';
import { SignupUser} from './utils/signup.api'
import { useState } from 'react';

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema), // Use Zod for validation
  });
  
  const [successMessage, setSuccessMessage] = useState('');

  const onSubmit = async (data: SignUpSchema) => {
    try {
      setSuccessMessage("") //its done because if the next outcome is different it will only show one outcome (a error or a sucess)
      const responseData = await SignupUser(data);
      console.log('Success:', responseData.message);
      setSuccessMessage(responseData.message);
    } catch (error: any) {
      console.error('Error signing up:', error);
      // If the backend provides an error field, use it to set a field-specific error;
      // otherwise, assign a general form error.
      if (error.field) {
        setError(error.field, { type: 'manual', message: error.message });
      } else {
        setError('root.serverError', { type: 'manual', message: error.message || 'An unexpected error occurred' });
      }
    }
  };
  
  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          {...register('email')} // Register the input field
          placeholder="Email"
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}

        <input
          type="password"
          {...register('password')} // Register the input field
          placeholder="Password"
        />
        {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

        <input
          type="text"
          {...register('name')} // Register the input field
          placeholder="name"
        />
        {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}

        <input
          type="date"
          {...register('birthDate')} // Register the input field
          placeholder="Birth date"
        />
        {errors.birthDate && <p style={{ color: 'red' }}>{errors.birthDate.message}</p>}

        <button type="submit">Sign Up</button>
      </form>
    
      {errors.root?.serverError && (
        <p style={{ color: 'red' }}>{errors.root.serverError.message}</p>
      )}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}