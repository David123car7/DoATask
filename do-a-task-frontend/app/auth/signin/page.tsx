'use client'; // Mark this as a Client Component

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInSchema } from '../schema/signin-form-schema';
import { SigninUser} from '../../../lib/api/auth/authentication/signin'
import { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { ROUTES } from "../../../lib/constants/routes"
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/lib/components/layouts/header/header';
import Footer from '@/lib/components/layouts/footer/page';
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';

export default function SignInForm() {
  const { register, handleSubmit} = useForm<SignInSchema>({resolver: zodResolver(signInSchema)});
  const router = useRouter(); 
  
  const onSubmit = async (data: SignInSchema) => {
    try {
      const responseData = await SigninUser(data);
      toast.success(responseData.message)
      router.push(ROUTES.HOME)
    } catch (error: any) {
      toast.error(error.message)
    }
  };
  
  return (
    <div className="page-auth">
      <Header userData={null} />
      <main>
        <Toaster />
        <div className={styles.titleBox}>
          <div className={styles.mainTitle}>Sign In</div>
        </div>
        <div className={styles.container_form}>
          <div className={styles.formBox}>
            <div className={styles.container}>
              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                  <input type="email" id="email" className={styles.input} {...register('email')} placeholder="Email"/>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="password" className={styles.label}>Password</label>
                  <input type="password" id="password" className={styles.input} {...register('password')} placeholder="Password"/>
                </div>
                <button type="submit" className={styles.submitButton}>Submeter</button>
              </form>
            </div>
            <Link href={ROUTES.RESET_PASSWORD} className={styles.reset_password}>Resetar Password</Link>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}