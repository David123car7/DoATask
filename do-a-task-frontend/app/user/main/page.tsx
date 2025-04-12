"use server"

import React from "react";
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { GetUserData } from "../../../lib/api/user/get-user";
import { userDataSchema} from "../schema/user-data-schema";
import { ROUTES } from "../../../lib/constants/routes";
import ChangePasswordForm from "@/lib/components/layouts/forms/change.password.form"
import ChangeUserDataForm from "@/lib/components/layouts/forms/change.user.data.form";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import Footer from "@/lib/components/layouts/footer/page";

export default async function UserMainPage() {
  try {
    const user = await GetUserData();
    const validatedData = userDataSchema.parse(user);
    
    const formattedBirthDate = validatedData.user.birthDate.split('T')[0];

    return (
      <div className="page">
        <HeaderWrapper/>
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
        <Footer/>
      </div>
    );
  } catch (err) {
    // Handle errors (this might be enhanced with error pages or fallback UI)
    return <div>Error: {(err as Error).message}</div>;
  }
}