'use client'; // Mark this as a Client Component

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpSchema } from '../schema/signup-form-schema';
import { SignupUser} from './utils/signup.api'
import { useState } from 'react';
import styles from './page.module.css';

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

  const onSubmit = async (data: SignUpSchema) => {
    try {
      setSuccessMessage("") //its done because if the next outcome is different it will only show one outcome (a error or a sucess)
      const responseData = await SignupUser(data);
      console.log('Success:', responseData.message);
      setSuccessMessage(responseData.message);
    } catch (error: any) {
      console.error('Error signing up:', error);
      // If the backend provides an error field, use it to set a field-specific error;
      // otherwise, assign a general form error.
      if (error.field) {
        setError(error.field, { type: 'manual', message: error.message });
      } else {
        setError('root.serverError', { type: 'manual', message: error.message || 'An unexpected error occurred' });
      }
    }
  };
  
  return (
        <div className='page'>
            <header>
                <div>
                    <h1 className={styles.logo_title}>DOATASK</h1>
                </div>
                <nav>
                    <ul>
                        <li><a href="#">Sobre</a></li>
                        <li><a href="#">Criadores</a></li>
                        <li><a href="#">Conta</a></li>
                        <li><a href="#"><div className={styles.loginBox}>Login</div></a></li>
                    </ul>
                </nav>
            </header>
            
            <main>

              
              <div className={styles.formBox}>
              <div className={styles.titleBox}>
                <div className={styles.mainTitle}>Registo Novo Membro</div>
              </div>
                <div className={styles.container}>

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

                        <div className={styles.inputGroup}>
                            <label htmlFor="name" className={styles.label}>Nome Completo</label>
                            <input type="text" id="name" className={styles.input} {...register('name')}/>
                            {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="contact" className={styles.label}>Contacto</label>
                            <input type="text" id="contact" className={styles.input} />{/*Tornar Opcional */}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="localidade" className={styles.label}>Localidade</label>
                            <input type="text" id="localidade" className={styles.input} />{/*Tornar Opcional */}
                        </div>  
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input type="email" id="email" className={styles.input} {...register('email')} />
                            {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <input type="password" id="password" className={styles.input} {...register('password')} />
                            {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="birthDate" className={styles.label}>Data de Nascimento</label>
                            <input type="date" id="birthDate" className={styles.input} {...register('birthDate')} />
                            {errors.birthDate && <p style={{ color: 'red' }}>{errors.birthDate.message}</p>}
                        </div>
                            <button type="submit" className={styles.submitButton}>Submeter</button>

                        {errors.root?.serverError && (<p style={{ color: 'red' }}>{errors.root.serverError.message}</p>)}
                        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    </form>
                </div>
              </div>
            </main>

                <footer>
                    <div>
                        <p>DOATASK</p>
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