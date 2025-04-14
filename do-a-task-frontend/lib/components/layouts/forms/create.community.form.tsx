'use client'; // Mark this as a Client Component

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCommunity } from '@/lib/api/communities/create.community';
import styles from '@/app/community/createCommunity/page.module.css'
import { ROUTES } from '@/lib/constants/routes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';
import { CreateCommunitySchema, createCommunitySchema } from '@/lib/schemas/community/create-community-schema';

export default function CreateCommunityForm() {
  const { register, handleSubmit, formState: { errors }} = useForm<CreateCommunitySchema>({resolver: zodResolver(createCommunitySchema)});
  const router = useRouter(); 
  
  const onSubmit = async (data: CreateCommunitySchema) => {
    try {
      const responseData = await CreateCommunity(data);
      toast.success(responseData.message)
      router.push(ROUTES.HOME)
    } catch (error: any) {
      toast.error(error.message)
    }
  };
  
  return (
    <div className="page-auth">
      <main>
        <Toaster/>
        <div className={styles.titleBox}>
          <div className={styles.mainTitle}>Criar Comunidades</div>
        </div>
        <div className={styles.container_form}>
          <div className={styles.formBox}>
            <div className={styles.container}>
              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nome da comunidade</label>
                  <input type="text" className={styles.input} {...register('communityName')} placeholder="Nome da comunidade"/>
                  {errors.communityName && <p className={styles.error_message}>{errors.communityName.message}</p>}
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Localidade</label>
                  <input type="text" className={styles.input} {...register('location')} placeholder="Nome da localidade"/>
                  {errors.location && <p className={styles.error_message}>{errors.location.message}</p>}
                </div>
                <button type="submit" className={styles.submitButton}>Submeter</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}