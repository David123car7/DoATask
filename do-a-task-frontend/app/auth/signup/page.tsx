'use client'; // Mark this as a Client Component

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpSchema } from '../schema/signup-form-schema';
import { SignupUser} from '../../../lib/api/auth/authentication/signup'
import { useState } from 'react';
import styles from './page.module.css';
import { ROUTES } from "../../../lib/constants/routes"
import { useRouter } from 'next/navigation';
import { Header } from '@/lib/components/layouts/header/header';
import Footer from '@/lib/components/layouts/footer/page';
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';

export default function SignUpForm() {
  const {register, handleSubmit, setError, formState: { errors }} = useForm<SignUpSchema>({resolver: zodResolver(signUpSchema)});
  const router = useRouter(); 

  const onSubmit = async (data: SignUpSchema) => {
    try {
      const responseData = await SignupUser(data);
      toast.success(responseData.message)
      router.push(ROUTES.SIGNIN)
    } catch (error: any) {
      toast.error(error.message)
    }
  };
  
  return (
    <div className="page-auth">
      <Header userData={null} notifications={{ notifications: [] }}/>
      <main>
        <Toaster/>
        <div className={styles.titleBox}>
          <div className={styles.mainTitle}>Registo Novo Membro</div>
        </div>
        <div className={styles.container_form}>
          <div className={styles.formBox}>
            <div className={styles.container}>
              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name" className={styles.label}>Nome Completo</label>
                  <input type="text" id="name" className={styles.input} {...register('name')} />
                  {errors.name && <p className={styles.error_message}>{errors.name.message}</p>}
                </div>
  
                <div className={styles.inputGroup}>
                  <label htmlFor="contact" className={styles.label}>Contacto</label>
                  <input type="text" id="contact" className={styles.input} {...register('contactNumber')} />
                  {errors.contactNumber && <p className={styles.error_message}>{errors.contactNumber.message}</p>}
                </div>
  
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                  <input type="email" id="email" className={styles.input} {...register('email')} />
                  {errors.email && <p className={styles.error_message}>{errors.email.message}</p>}
                </div>
  
                <div className={styles.inputGroup}>
                  <label htmlFor="password" className={styles.label}>Password</label>
                  <input type="password" id="password" className={styles.input} {...register('password')} />
                  {errors.password && <p className={styles.error_message}>{errors.password.message}</p>}
                </div>
  
                <div className={styles.inputGroup}>
                  <label htmlFor="birthDate" className={styles.label}>Data de Nascimento</label>
                  <input type="date" id="birthDate" className={styles.input} {...register('birthDate')} />
                  {errors.birthDate && <p className={styles.error_message}>{errors.birthDate.message}</p>}
                </div>
  
                <button type="submit" className={styles.submitButton}>Submeter</button>
                </form>
            </div>
          </div>
        </div>
      </main>
  
      <Footer />
    </div>
  );
}