'use client'; // Mark this as a Client Component

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInSchema } from '../schema/signin-form-schema';
import { SigninUser} from './utils/signin.api'
import { useState } from 'react';

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema), // Use Zod for validation
  });
  
  const [successMessage, setSuccessMessage] = useState('');

  const onSubmit = async (data: SignInSchema) => {
    try {
      setSuccessMessage("") //its done because if the next outcome is different it will only show one outcome (a error or a sucess)
      const responseData = await SigninUser(data);
      console.log('Success:', responseData.message);
      setSuccessMessage(responseData.message);
    } catch (error: any) {
      console.error('Error signing up:', error);

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

        <button type="submit">Sign Up</button>
      </form>
    
      {errors.root?.serverError && (
        <p style={{ color: 'red' }}>{errors.root.serverError.message}</p>
      )}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}