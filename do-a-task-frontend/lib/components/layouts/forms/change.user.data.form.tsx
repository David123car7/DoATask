'use client'; 

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from '@/app/user/main/page.module.css';
import { ChangeUserDataSchema, changeUserDataSchema } from '@/app/user/schema/user-data-change-form-schema';
import { UserDataSchema } from '@/app/user/schema/user-data-schema';
import { ChangeUserData } from '@/lib/api/user/change.user.data';
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';

export default function ChangeUserDataForm({ schemaForm }: { schemaForm: UserDataSchema }) {
  const {register, handleSubmit,formState: { errors }} = useForm<ChangeUserDataSchema>({resolver: zodResolver(changeUserDataSchema)});
  const onSubmit = async (data: ChangeUserDataSchema) => {
    try {
      const responseData = await ChangeUserData(data);
      toast.success(responseData.message)
    } catch (error: any) {
      toast.error(error.message)
    }
  };
  
  return (
    <div className={styles.forms}>
      <Toaster />
      <p>Dados Pessoais</p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form_userData}>
        <div className={styles.formBox}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>Nome</label>
            <div className={styles.inlineInput}>
              <input type="text" defaultValue={schemaForm.user.name} className={styles.input} {...register('name')} placeholder=""/>
              {errors.name && <p className={styles.error_message}>{errors.name.message}</p>}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="birthDate" className={styles.label}>Data de Nascimento</label>
            <div className={styles.inlineInput}>
              <input type="date" defaultValue={schemaForm.user.birthDate} className={styles.input} {...register('birthDate')} placeholder=""/>
              {errors.birthDate && <p className={styles.error_message}>{errors.birthDate.message}</p>}
            </div>
          </div>
        </div>
        <div className={styles.formBox}>
          <div className={styles.inputGroup}>
            <label htmlFor="number" className={styles.label}>Contacto</label>
            <div className={styles.inlineInput}>
              <input type="text" defaultValue={schemaForm.contact.number} className={styles.input} {...register('number')} placeholder=""/>
              {errors.number && <p className={styles.error_message}>{errors.number.message}</p>}
            </div>
          </div>
        </div>
        <button type="submit" className={styles.submitButton}>Submeter</button>
      </form>
    </div>
  );
}