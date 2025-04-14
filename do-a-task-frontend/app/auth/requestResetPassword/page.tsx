'use client'; // Mark this as a Client Component

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RequestResetPasswordSchema, requestResetPasswordSchema} from '../schema/request-reset-password-form-schema';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { RequestResetPassword } from '@/lib/api/auth/password/request.reset.password';
import { Header } from '@/lib/components/layouts/header/header';
import Footer from '@/lib/components/layouts/footer/page';
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';

export default function RequestResetPasswordPage() {
  const {register, handleSubmit, setError, formState: { errors }} = useForm<RequestResetPasswordSchema>({resolver: zodResolver(requestResetPasswordSchema)});
  const router = useRouter(); 
  
  const onSubmit = async (data: RequestResetPasswordSchema) => {
    try {
      const responseData = await RequestResetPassword(data);
      toast.success(responseData.message)
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  
  return (
    <div className="page-auth">
      <Header userData={null}/>
  
      <main>
        <Toaster/>
        <div className={styles.titleBox}>
          <div className={styles.mainTitle}>Submeter pedido de resetar password</div>
        </div>
  
        <div className={styles.container_form}>
          <div className={styles.formBox}>
            <div className={styles.container}>
              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                  <input type="email" id="email" className={styles.input} {...register('email')} placeholder="Email" /> {errors.email && <p className={styles.error_message}>{errors.email.message}</p>}
                </div>
  
                <button type="submit" className={styles.submitButton}>Submeter</button>
  
                {errors.root?.serverError && <p style={{ color: 'red' }}>{errors.root.serverError.message}</p>}
              </form>
            </div>
          </div>
        </div>
      </main>
  
      <Footer />
    </div>
  );
}