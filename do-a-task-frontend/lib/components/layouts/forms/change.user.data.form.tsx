'use client'; 

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import styles from '@/app/user/main/page.module.css';
import { ROUTES } from "../../../constants/routes"
import { useRouter } from 'next/navigation';
import { ChangeUserDataSchema, changeUserDataSchema } from '@/app/user/schema/user-data-change-form-schema';
import { UserDataSchema } from '@/app/user/schema/user-data-schema';
import { ChangeUserData } from '@/lib/api/user/change.user.data';
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';

export default function ChangeUserDataForm({ schemaForm }: { schemaForm: UserDataSchema }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangeUserDataSchema>({
    resolver: zodResolver(changeUserDataSchema),
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter(); 
  
  const onSubmit = async (data: ChangeUserDataSchema) => {
    try {
      const responseData = await ChangeUserData(data);
      toast.success(responseData.message)
    } catch (error: any) {
      if (error.field) {
        setError(error.field, { type: 'manual', message: error.message });
      } else {
        setError('root.serverError', { type: 'manual', message: error.message || 'An unexpected error occurred' });
      }
    }
  };
  
  return (
    <div className={styles.forms}>
      <Toaster></Toaster>
      <p>Dados Pessoais</p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form_userData}>
        <div className={styles.formBox}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>Nome</label>
            <input type="text" defaultValue={schemaForm.user.name} className={styles.input} {...register('name')}/>
            {errors.name && <p className={styles.error_message}>{errors.name.message}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="birthDate" className={styles.label}>Data de Nascimento</label>
            <input type="data" defaultValue={schemaForm.user.birthDate} className={styles.input} {...register('birthDate')}/>
            {errors.birthDate && <p className={styles.error_message}>{errors.birthDate.message}</p>}
          </div>
        </div>
        <div className={styles.formBox}>
          <div className={styles.inputGroup}>
            <label htmlFor="number" className={styles.label}>Contacto</label>
            <input type="text" defaultValue={schemaForm.contact.number} className={styles.input} {...register('number')}/>
            {errors.number && <p className={styles.error_message}>{errors.number.message}</p>}
          </div>
        </div>
        <button type="submit" className={styles.submitButton}>Submeter</button>
        {errors.root?.serverError && <p style={{ color: 'red' }}>{errors.root.serverError.message}</p>}
        {successMessage && <p className={styles.sucess_message}>{successMessage}</p>}
      </form>
    </div>
  );
}