'use client'; // Mark this as a Client Component

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpSchema } from '../schema/signup-form-schema';
import { SignupUser} from '../../../lib/api/auth/authentication/signup'
import { useState } from 'react';
import styles from './page.module.css';
import { ROUTES } from "../../../lib/constants/routes"
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema), // Use Zod for validation
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter(); // Initialize router from next/navigation

  const onSubmit = async (data: SignUpSchema) => {
    try {
      setSuccessMessage("") //its done because if the next outcome is different it will only show one outcome (a error or a sucess)
      const responseData = await SignupUser(data);
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
        <div className='page-auth'>
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
                        <li><a href={ROUTES.SIGNIN}><div className={styles.loginBox}>Login</div></a></li>
                    </ul>
                </nav>
            </header>
            
            <main>

            <div className={styles.titleBox}>
                  <div className={styles.mainTitle}>Registo Novo Membro</div>
            </div>

              <div className={styles.container_form}>
                <div className={styles.formBox}>
                  <div className={styles.container}>

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

                        <div className={styles.inputGroup}>
                            <label htmlFor="name" className={styles.label}>Nome Completo</label>
                            <input type="text" id="name" className={styles.input} {...register('name')}/>
                            {errors.name && <p className={styles.error_message}>{errors.name.message}</p>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="contact" className={styles.label}>Contacto</label>
                            <input type="text" id="name" className={styles.input}  {...register('contactNumber')}/>
                            {errors.contactNumber && <p className={styles.error_message}>{errors.contactNumber.message}</p>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input type="email" id="email" className={styles.input} {...register('email')} />
                            {errors.email && <p className={styles.error_message}>{errors.email.message}</p>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <input type="password" id="password" className={styles.input} {...register('password')} />
                            {errors.password && <p className={styles.error_message}>{errors.password.message}</p>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="birthDate" className={styles.label}>Data de Nascimento</label>
                            <input type="date" id="birthDate" className={styles.input} {...register('birthDate')} />
                            {errors.birthDate && <p className={styles.error_message}>{errors.birthDate.message}</p>}
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
                        <ul>

                        </ul>
                    </div>

                </footer>

           
        </div>
  );
}

/*
<div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          {...register('email')} // Register the input field
          placeholder="Email"
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}

        <input
          type="password"
          {...register('password')} // Register the input field
          placeholder="Password"
        />
        {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

        <input
          type="text"
          {...register('name')} // Register the input field
          placeholder="name"
        />
        {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}

        <input
          type="date"
          {...register('birthDate')} // Register the input field
          placeholder="Birth date"
        />
        {errors.birthDate && <p style={{ color: 'red' }}>{errors.birthDate.message}</p>}

        <button type="submit">Sign Up</button>
      </form>
    
      {errors.root?.serverError && (
        <p style={{ color: 'red' }}>{errors.root.serverError.message}</p>
      )}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
*/