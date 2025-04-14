"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordSchema, changePasswordSchema } from '../schema/change-password-form-schema';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { ROUTES } from "../../../lib/constants/routes";
import { useRouter } from 'next/navigation';
import { ChangePassword } from '@/lib/api/auth/password/change.password';
import { Header } from '@/lib/components/layouts/header/header';
import Footer from '@/lib/components/layouts/footer/page';
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';

export default function RequestResetPasswordPage() {
  const {register, handleSubmit, setError, formState: { errors }} = useForm<ChangePasswordSchema>({resolver: zodResolver(changePasswordSchema)});
  const router = useRouter();

  const onSubmit = async (data: ChangePasswordSchema) => {
    try {
      const responseData = await ChangePassword(data)
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
          <div className={styles.mainTitle}>Sign In</div>
        </div>

        <div className={styles.container_form}>
          <div className={styles.formBox}>
            <div className={styles.container}>
              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="currentPassword" className={styles.label}>CurrentPassword</label>
                  <input type="password" id="currentPassword" className={styles.input} {...register('currentPassword')} />
                  {errors.currentPassword && <p className="error_message">{errors.currentPassword.message}</p>}
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="password" className={styles.label}>New Password</label>
                  <input type="password" id="newPassword" className={styles.input} {...register('newPassword')} />
                  {errors.newPassword && <p className="error_message">{errors.newPassword.message}</p>}
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>Confirm New Password</label>
                  <input type="password" id="newPassword2" className={styles.input} {...register('newPassword2')} />
                  {errors.newPassword2 && <p className="error_message">{errors.newPassword2.message}</p>}
                </div>
                <button type="submit" className={styles.submitButton}>Submeter</button>

                {errors.root?.serverError && (<p style={{ color: 'red' }}>{errors.root.serverError.message}</p>)}
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}