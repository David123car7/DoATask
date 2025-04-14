'use client'; // Mark this as a Client Component

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RequestResetPasswordSchema, requestResetPasswordSchema} from '../schema/request-reset-password-form-schema';
import { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { ROUTES } from "../../../lib/constants/routes"
import { useRouter } from 'next/navigation';
import { RequestResetPassword } from '@/lib/api/auth/password/request.reset.password';
import { Header } from '@/lib/components/layouts/header/header';
import Footer from '@/lib/components/layouts/footer/page';
import Head from 'next/head';

export default function RequestResetPasswordPage() {
  const {register, handleSubmit, setError, formState: { errors }} = useForm<RequestResetPasswordSchema>({resolver: zodResolver(requestResetPasswordSchema)});
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter(); 
  
  const onSubmit = async (data: RequestResetPasswordSchema) => {
    try {
      setSuccessMessage("") 
      const responseData = await RequestResetPassword(data);
      setSuccessMessage(responseData.message);
    } catch (error: any) {
      if (error.field) {
        setError(error.field, { type: 'manual', message: error.message });
      } else {
        setError('root.serverError', { type: 'manual', message: error.message || 'An unexpected error occurred' });
      }
    }
  };
  
  return (
    <div className="page-auth">
      <Header userData={null} />
  
      <main>
        <div className={styles.titleBox}>
          <div className={styles.mainTitle}>Submeter pedido de resetar password</div>
        </div>
  
        <div className={styles.container_form}>
          <div className={styles.formBox}>
            <div className={styles.container}>
              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                  <input type="email" id="email" className={styles.input} {...register('email')} placeholder="Email" /> {errors.email && <p className={styles.error_message}>{errors.email.message}</p>}
                </div>
  
                <button type="submit" className={styles.submitButton}>Submeter</button>
  
                {errors.root?.serverError && <p style={{ color: 'red' }}>{errors.root.serverError.message}</p>}
                {successMessage && <p className={styles.sucess_message}>{successMessage}</p>}
              </form>
            </div>
          </div>
        </div>
      </main>
  
      <Footer />
    </div>
  );
}