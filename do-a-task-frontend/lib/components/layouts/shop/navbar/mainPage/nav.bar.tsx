"use client"

import { GetUserStores } from '@/lib/api/store/get-userStores';
import styles from './page.module.css'
import {ROUTES} from "@/lib/constants/routes"
import { usePathname } from 'next/navigation';

export default  function ShopNavBar({UserStore} : {UserStore: true | false}) {

    const pathname = usePathname();

    return (
        UserStore ? (
            <div className={styles.optionsContainer}>
            <div className={styles.options}>
                <div className={`${styles.singleOption} ${pathname === ROUTES.SHOPS ? styles.active : ''}`}>
                    <a href={ROUTES.SHOPS}>Lojas</a>
                </div>
                <div className={`${styles.singleOption} ${pathname === ROUTES.MEMBER_PURCHASES ? styles.active : ''}`}>
                    <a href={ROUTES.MEMBER_PURCHASES}>Historico de Compras</a>
                </div>
                <div className={`${styles.singleOption} ${pathname === ROUTES.MY_SHOP ? styles.active : ''}`}>
                <a href={ROUTES.MY_SHOP}>Minha Loja</a>
            </div>
        </div>
    </div>
        ) : (
            <div className={styles.optionsContainer}>
            <div className={styles.options}>
                <div className={`${styles.singleOption} ${pathname === ROUTES.SHOPS ? styles.active : ''}`}>
                    <a href={ROUTES.SHOPS}>Lojas</a>
                </div>
                <div className={`${styles.singleOption} ${pathname === ROUTES.MEMBER_PURCHASES ? styles.active : ''}`}>
                    <a href={ROUTES.MEMBER_PURCHASES}>Historico de Compras</a>
                </div>
                    </div>
                    </div>
                )
            );
}
