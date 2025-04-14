'use client'; 

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePassword } from '@/lib/api/auth/password/change.password';
import { useState } from 'react';
import styles from '@/app/user/main/page.module.css';
import { useRouter } from 'next/navigation';
import { ChangePasswordSchema, changePasswordSchema } from '@/app/auth/schema/change-password-form-schema'
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';

export default function ChangePasswordForm() {
  const { register, handleSubmit, formState: { errors }} = useForm<ChangePasswordSchema>({resolver: zodResolver(changePasswordSchema)});
  const router = useRouter(); 
  
  const onSubmit = async (data: ChangePasswordSchema) => {
    try {
      const responseData = await ChangePassword(data);
      toast.success(responseData.message)
    } catch (error: any) {
      toast.error(error.message)
    }
  };
  
  return (
    <div className={styles.forms}>
      <Toaster/>
      <p>Alterar Password</p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form_userData}>
        
        <div className={styles.formBox}>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>New Password</label>
            <div className={styles.inputWithError}>
              <input type="password" id="password" className={styles.input} {...register('newPassword')} placeholder="" />
              {errors.newPassword && <p className="error_message">{errors.newPassword.message}</p>}
            </div>
          </div>
  
          <div className={styles.inputGroup}>
            <label htmlFor="newPassword2" className={styles.label}>Confirm Password</label>
            <div className={styles.inputWithError}>
              <input type="password" id="newPassword2" className={styles.input} {...register('newPassword2')} placeholder="" />
              {errors.newPassword2 && <p className="error_message">{errors.newPassword2.message}</p>}
            </div>
          </div>
        </div>
  
        <div className={styles.formBox}>
          <div className={styles.inputGroup}>
            <label htmlFor="currentPassword" className={styles.label}>Current Password</label>
            <div className={styles.inputWithError}>
              <input type="password" id="currentPassword" className={styles.input} {...register('currentPassword')} placeholder="" />
              {errors.currentPassword && <p className="error_message">{errors.currentPassword.message}</p>}
            </div>
          </div>
        </div>
  
        <button type="submit" className={styles.submitButton}>Submeter</button>
        </form>
    </div>
  );
}