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
import { AddAdress } from "@/lib/components/layouts/forms/addAdressForm/page";
import { GetAllAddresses } from "@/lib/api/address/get-allAddresses";
import {AddressSchema} from '@/lib/schemas/address/address.schema'
import { addressSchemaData } from "@/lib/schemas/address/address.schema";
import { API_ROUTES } from "../../../lib/constants/routes";



export default async function UserMainPage() {
  try {
    const user = await GetUserData();
    const validatedData = userDataSchema.parse(user);
    
    console.log(validatedData.user.birthDate)
    const formattedBirthDate = validatedData.user.birthDate.split('T')[0];
  
    const data = await GetAllAddresses();
    const validatedAddresses = addressSchemaData.parse(data);


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
                <Link href={API_ROUTES.SIGNOUT}> Terminar Sessão</Link>
              </div>
            </div>
          </div>
          <div className={styles.containerForms}>
            {/* Personal Data Forms */}
            <ChangeUserDataForm schemaForm={validatedData}/>
            {/* Password Change Forms */}
            <ChangePasswordForm></ChangePasswordForm>
            {/* Add Adresses */}
            <AddAdress allAddresses={validatedAddresses}/>
            
          </div>
        </main>
        <Footer/>
      </div>
    );
  } catch (err) {
    return <div>Error: {(err as Error).message}</div>;
  }
}