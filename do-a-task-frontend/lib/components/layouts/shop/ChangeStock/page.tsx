'use client'; 

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePassword } from '@/lib/api/auth/password/change.password';
import { useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { ChangePasswordSchema, changePasswordSchema } from '@/app/auth/schema/change-password-form-schema'
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';
import { UpdateStock } from '@/lib/api/store/update-stock';
import { set } from 'zod';

export default function UpdateStockItem({ newStock, ItemId }: { newStock: number; ItemId: number }) {
  const { register, handleSubmit, setValue , formState: { errors } } = useForm<{ newStock: number }>({
    defaultValues: { newStock }
  });
  const [stock, setStock] = useState(newStock);

  const onSubmit = async (data: { newStock: number }) => {
    try {
      const responseData = await UpdateStock(data.newStock, ItemId);
      toast.success(responseData.message);
      setStock(data.newStock);
      setValue('newStock', data.newStock); 
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar o estoque.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form_userData}>
      <div className={styles.inputGroup}>
        <div className={styles.inputContainer}>
        <p className={styles.stock}>Stock:</p>
            <label htmlFor={`stock-${ItemId}`} className={styles.label}></label>
            <div className={styles.inputGroup}>
            <input
                type="number"
                id={`stock-${ItemId}`}
                className={styles.input}
                {...register('newStock', { valueAsNumber: true })}
            />
        </div>
          {errors.newStock && <p className="error_message">{errors.newStock.message}</p>}
        </div>
      </div>
      <button type="submit" className={styles.submitButton}>Atualizar</button>
    </form>
  );
}
