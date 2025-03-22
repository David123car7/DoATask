import React from "react";
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import Pagination from "../paginaçao";
import { getStoreItems } from "./utils/store.api";


/*type StoreProps = {
    searchParams?: {page?: string; limit?: string};
};*/

/*export default async function store({searchParams}: StoreProps) {
    const page = Number(searchParams?.page) || 1;
    const limit = Number(searchParams?.limit) || 10;

    const {data, metadata} = await getStoreItems({page, limit});*/

export default function store(){

    return (
      <div className="page">
        <header>
            <h1 className="logo_title">DoATask</h1>.
            <nav>
                <ul>
                    <li>
                        <Link href="/auth/signin">
                            <Image src="/assets/shopCartLogo.png" alt="ShopCart" width={30} height={30}/>
                        </Link>
                    </li>
                    <li className={styles.coins}>
                        <Link href="/auth/signin">
                            <Image src="/assets/coinLogo.png" alt="Coins" width={30} height={30}/>
                        </Link>
                    </li>
                    <li className={styles.user_icon}>
                        <Link href="/auth/signin">
                            <Image src="/assets/userIcon.png" alt="Coins" width={30} height={30}/>
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>

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
    
        <footer>
            <p>DoATask</p>
        </footer>
      </div>
    );
}