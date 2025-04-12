"use server"

import React from "react";
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { GetUser } from "../../../lib/api/user/get-user";
import { userDataSchema} from "../schema/user-data-schema";
import { ROUTES } from "../../../lib/constants/routes";
import ChangePasswordForm from "@/lib/components/ui/forms/change.password.form"
import ChangeUserDataForm from "@/lib/components/ui/forms/change.user.data.form";



export default async function UserMainPage() {
  try {
    const result = await GetUser();
    const user = await result.response
    const validatedData = userDataSchema.parse(user);
    
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
            <ChangeUserDataForm schemaForm={validatedData}/>
            {/* Password Change Forms */}
            <ChangePasswordForm></ChangePasswordForm>
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