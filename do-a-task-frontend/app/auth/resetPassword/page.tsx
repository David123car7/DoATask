"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordSchema, resetPasswordSchema } from '../schema/reset-password-form-schema';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { ROUTES } from "../../../lib/constants/routes";
import { useRouter } from 'next/navigation';
import { ResetPassword } from '@/lib/api/auth/password/reset.password';
import { Header } from '@/lib/components/layouts/header/header';
import Footer from '@/lib/components/layouts/footer/page';
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';

export default function RequestResetPasswordPage() {
  const {register, handleSubmit, setError, formState: { errors }} = useForm<ResetPasswordSchema>({resolver: zodResolver(resetPasswordSchema)});
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1); // Remove the '#' from the start
      const urlParams = new URLSearchParams(hash);
      const accessToken = urlParams.get("access_token");
      setToken(accessToken)
    }
  }, []);

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      if (!token) {
        router.push(ROUTES.HOME);
        return;
      }

      const responseData = await ResetPassword(data, token);
      toast.success(responseData.message)
      router.push(ROUTES.SIGNIN)
    } catch (error: any) {
      toast.error(error.message)
    }
  };

  return (
    <div className="page-auth">
      <Header userData={null}/>
  
      <main>
        <Toaster/>
        <div className={styles.titleBox}>
          <div className={styles.mainTitle}>Resetar Palavra passe</div>
        </div>
  
        <div className={styles.container_form}>
          <div className={styles.formBox}>
            <div className={styles.container}>
              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="password" className={styles.label}>Password</label>
                  <input type="password" id="newPassword" className={styles.input} {...register('newPassword')} /> 
                  {errors.newPassword && <p className={styles.error_message}>{errors.newPassword.message}</p>}
                </div>
  
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>Confirm Password</label>
                  <input type="password" id="newPassword2" className={styles.input} {...register('newPassword2')} /> 
                  {errors.newPassword2 && <p className={styles.error_message}>{errors.newPassword2.message}</p>}
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