"use server";

import styles from './page.module.css';
import Image from 'next/image';
import { ROUTES, API_ROUTES } from "../lib/constants/routes";
import { GetUser } from '../lib/utils/supabase/user/get-user';
import Header from '@/lib/components/layouts/header/header';
import Footer from '@/lib/components/layouts/footer/page';

export default async function Home() {
  const data = await GetUser();

  return (
    <div className="page-auth">
      <Header user={data}/>

      <main>
        <div className={styles.titleBox}>
          <div className={styles.mainTitle}>Main Page</div>
        </div>
      </main>
      
      <Footer/>
    </div>
  );
}