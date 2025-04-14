"use server";

import styles from './page.module.css';
import Image from 'next/image';
import { ROUTES, API_ROUTES } from "../lib/constants/routes";
import { GetUser } from '../lib/utils/supabase/user/get-user';
import Footer from '@/lib/components/layouts/footer/page';
import HeaderWrapper from '@/lib/components/layouts/header/HeaderWrapper';
import { Toaster } from '@/lib/components/layouts/toaster/toaster';

export default async function Home() {

  return (
    <div className="page-auth">
      <HeaderWrapper/>

      <main>
        <Toaster/>
        <div className={styles.titleBox}>
          <div className={styles.mainTitle}>Main Page</div>
        </div>
      </main>
      
      <Footer/>
    </div>
  );
}