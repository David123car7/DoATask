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

export default function RequestResetPasswordPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [successMessage, setSuccessMessage] = useState('');
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
      setSuccessMessage("");
      if (!token) {
        router.push(ROUTES.HOME);
        return;
      }

      const responseData = await ResetPassword(data, token);
      setSuccessMessage(responseData.message);
      router.push(ROUTES.SIGNIN)
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
          <div className={styles.mainTitle}>Sign In</div>
        </div>

        <div className={styles.container_form}>
          <div className={styles.formBox}>
            <div className={styles.container}>
              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="password" className={styles.label}>Password</label>
                  <input type="password" id="newPassword" className={styles.input} {...register('newPassword')} />
                  {errors.newPassword && <p className="error_message">{errors.newPassword.message}</p>}
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>Confirm Password</label>
                  <input type="password" id="newPassword2" className={styles.input} {...register('newPassword2')} />
                  {errors.newPassword2 && <p className="error_message">{errors.newPassword2.message}</p>}
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