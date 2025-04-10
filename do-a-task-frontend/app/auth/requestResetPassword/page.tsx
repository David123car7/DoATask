'use client'; // Mark this as a Client Component

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RequestResetPasswordSchema, requestResetPasswordSchema} from '../schema/request-reset-password-form-schema';
import { SigninUser} from '../../../lib/api/auth/authentication/signin'
import { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { ROUTES } from "../../../lib/constants/routes"
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RequestResetPassword } from '@/lib/api/auth/password/request.reset.password';

export default function RequestResetPasswordPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RequestResetPasswordSchema>({
    resolver: zodResolver(requestResetPasswordSchema), 
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter(); 
  
  const onSubmit = async (data: RequestResetPasswordSchema) => {
    try {
      setSuccessMessage("") 
      const responseData = await RequestResetPassword(data);
      setSuccessMessage(responseData.message);
    } catch (error: any) {
      if (error.field) {
        setError(error.field, { type: 'manual', message: error.message });
      } else {
        setError('root.serverError', { type: 'manual', message: error.message || 'An unexpected error occurred' });
      }
    }
  };
  
  return (
    <div className="page-auth">
<header>
        <div>
            <h1 className="logo_title">DOATASK</h1>
        </div>
        <nav>
            <ul>
                <li><a href={ROUTES.HOME}>Home</a></li>
                <li><a href="#">Sobre</a></li>
                <li><a href="#">Criadores</a></li>
                <li><a href="#">Conta</a></li>
                <li><a href={ROUTES.SIGNUP}><div className={styles.loginBox}>Registar</div></a></li>
            </ul>
        </nav>
    </header>
    
    
    <main>
      <div className={styles.titleBox}>
          <div className={styles.mainTitle}>Submeter pedido de resetar password</div>
      </div>

        <div className={styles.container_form}>
            <div className={styles.formBox}>
                <div className={styles.container}>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input type="email" id="email" className={styles.input} {...register('email')} placeholder="Email"/>
                            {errors.email && <p className="error_message">{errors.email.message}</p>}
                        </div>
                            <button type="submit" className={styles.submitButton}>Submeter</button>
                            
                            {errors.root?.serverError && (<p style={{ color: 'red' }}>{errors.root.serverError.message}</p>)}
                            {successMessage && <p className={styles.sucess_message}>{successMessage}</p>}
                    </form>
                  </div>
            </div>
        </div>
        
    </main>
    
        <footer>
            <div>
                <p>DOATASK</p>
                <div className='footerlogo'>
                  <nav className='footerNav'>
                      <ul>
                        <li>
                          <Image src="/assets/linkdinlogo.png" alt="Logo" width={30} height={30} />
                          <Image src="/assets/linkdinlogo.png" alt="Logo" width={30} height={30} />
                          <Image src="/assets/linkdinlogo.png" alt="Logo" width={30} height={30} />
                          <Image src="/assets/linkdinlogo.png" alt="Logo" width={30} height={30} />
                        </li>
                      </ul>
                  </nav>
                </div>
            </div>
          
        </footer>

   
</div>
);
}