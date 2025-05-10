'use client'; // Mark this as a Client Component

import { useForm } from 'react-hook-form';
import { use, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCommunity } from '@/lib/api/communities/create.community';
import styles from '@/app/community/create/page.module.css'
import { ROUTES } from '@/lib/constants/routes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';
import { CreateCommunitySchema, createCommunitySchema } from '@/lib/schemas/community/create-community-schema';
import { GetLocalityUser } from '@/lib/api/locality/get-localityUser';
import { useEffect } from 'react';


export default function CreateCommunityForm() {
  const { register, handleSubmit, formState: { errors }} = useForm<CreateCommunitySchema>({resolver: zodResolver(createCommunitySchema)});
  const router = useRouter(); 
  const [locality, setLocality] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLocality() {
      try{
        const response = await GetLocalityUser();
        setLocality(response.locality);
      }catch (error) {
        console.error('Error fetching locality:', error);
      }
    }
    fetchLocality();
  }, []);

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
        <>
        <Toaster />
        <div className={styles.titleBox}>
          <div className={styles.title}>Criar Comunidades</div>
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
              <label className={styles.label}>
                Escolha uma localidade onde a sua comunidade irá atuar
              </label>
                <select {...register('location')} disabled={locality.length == 0} className={styles.select}>
                  <option value="">Selecione Uma Localidade</option>
                  {locality.map((locality, index) => (
                    <option key={index} value={locality.name}>{locality.name}</option>
                  ))}
                </select>
                </div>
                <button type="submit" className={styles.submitButton}>Submeter</button>
              </form>
            </div>
          </div>
        </div>
        </>
  );
}