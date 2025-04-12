'use server'
import React from "react";
import styles from './page.module.css';
import Image from 'next/image';
import Header from "@/lib/components/layouts/header/HeaderWrapper";
import Footer from "@/lib/components/layouts/footer/page";
import { GetUser } from "@/lib/api/user/get-user";

export default async function store(){
    const data = await GetUser();
    return (
      <div className="page">

       <Header/> 

        <main> 
            <div className={styles.container_main}>
                <div className={styles.titlte_store}>
                    <p>Troca os teus pontos por premios</p>
                </div>
            </div>

            <div className={styles.container_items}>
                <div>
                    <div className={styles.item}>
                        <Image src="/assets/linkdinlogo.png" alt="ShopCart" width={200} height={200}/>
                    </div>
                        <p>ola</p>
                </div>
                <div>
                    <div className={styles.item}>
                        <Image src="/assets/linkdinlogo.png" alt="ShopCart" width={200} height={200}/>
                    </div>
                        <p>ola</p>
                </div>
                <div>
                    <div className={styles.item}>
                        <Image src="/assets/linkdinlogo.png" alt="ShopCart" width={200} height={200}/>
                    </div>
                        <p>ola</p>
                </div>
                <div>
                    <div className={styles.item}>
                        <Image src="/assets/linkdinlogo.png" alt="ShopCart" width={200} height={200}/>
                    </div>
                        <p>ola</p>
                </div>
                <div>
                    <div className={styles.item}>
                        <Image src="/assets/linkdinlogo.png" alt="ShopCart" width={200} height={200}/>
                    </div>
                        <p>ola</p>
                </div>
                <div>
                    <div className={styles.item}>
                        <Image src="/assets/linkdinlogo.png" alt="ShopCart" width={200} height={200}/>
                    </div>
                        <p>ola</p>
                </div>
                <div>
                    <div className={styles.item}>
                        <Image src="/assets/linkdinlogo.png" alt="ShopCart" width={200} height={200}/>
                    </div>
                        <p>ola</p>
                </div>
                <div>
                    <div className={styles.item}>
                        <Image src="/assets/linkdinlogo.png" alt="ShopCart" width={200} height={200}/>
                    </div>
                        <p>ola</p>
                </div>
                <div>
                    <div className={styles.item}>
                        <Image src="/assets/linkdinlogo.png" alt="ShopCart" width={200} height={200}/>
                    </div>
                        <p>ola</p>
                </div>
            </div>
            {/*<Pagination page={page} limit={limit} total={metadata.pagination.total} />*/}
        </main>
    
        <Footer/>
      </div>
    );
}