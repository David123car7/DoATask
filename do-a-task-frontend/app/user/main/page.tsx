"use server"

import React from "react";
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { GetUser } from "../../../lib/api/user/get-user";
import { userDataSchema} from "../schema/user-data-schema";
import { ROUTES } from "../../../lib/constants/routes";

export default async function UserMainPage() {
  try {
    const result = await GetUser();
    const user = await result.response
    // Validate and parse the response
    const validatedData = userDataSchema.parse(user);
    
    // Format birth date for display
    const formattedBirthDate = validatedData.user.birthDate.split('T')[0];

    return (
      <div className="page">
        <header>
          <h1 className="logo_title">DOATASK</h1>
          <nav>
            <ul>
              <li><Link href={ROUTES.HOME}>Home</Link></li>
              <li><Link href="#">Sobre</Link></li>
              <li><Link href="#">Criadores</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <div className={styles.container_options}>
            <div>
              <div className={styles.main_title}>
                Olá, {validatedData.user.name}
              </div>
              <div className={styles.link_fim}>
                <Link href="#"> Terminar Sessão</Link>
              </div>
              <div className={styles.user_options}>
                <ul className={styles.user_li}>
                  <li><Link href="#">Dados Pessoais</Link></li>
                  <li><Link href="#">Tarefas</Link></li>
                  <li><Link href="#">Centro de Apoio</Link></li>
                </ul>
              </div>
            </div>
            {/* Personal Data Forms */}
            <div className={styles.forms}>
              <p>Dados Pessoais</p>
              <div className={styles.formBox}>
                <form className={styles.form_userData}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nome</label>
                    <input type="text" defaultValue={validatedData.user.name} />
                  </div>
                </form>
                <form className={styles.form_userData}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Contacto</label>
                    <input type="text" defaultValue={validatedData.contact.number} />
                  </div>
                </form>
              </div>
              <div className={styles.formBox}>
                <form className={styles.form_userData}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Email</label>
                    <input type="text" defaultValue={validatedData.user.email} />
                  </div>
                </form>
                <form className={styles.form_userData}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Data Nascimento</label>
                    <input type="date" defaultValue={formattedBirthDate} />
                  </div>
                </form>
              </div>
              <button type="submit" className={styles.submitButton}>Guardar</button>
            </div>
            {/* Password Change Forms */}
            <div className={styles.forms}>
              <p>Alterar Password</p>
              <div className={styles.formBox}>
                <form className={styles.form_userData}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nova Password</label>
                    <input type="password" />
                  </div>
                </form>
                <form className={styles.form_userData}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Confirmar Password</label>
                    <input type="password" />
                  </div>
                </form>
              </div>
              <div className={styles.formBox}>
                <form className={styles.form_userData}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Password Atual</label>
                    <input type="password" />
                  </div>
                </form>
              </div>
              <button type="submit" className={styles.submitButton}>Guardar</button>
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
  } catch (err) {
    // Handle errors (this might be enhanced with error pages or fallback UI)
    return <div>Error: {(err as Error).message}</div>;
  }
}