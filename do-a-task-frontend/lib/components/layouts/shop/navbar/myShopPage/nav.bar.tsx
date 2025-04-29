"use client"

import styles from './page.module.css'
import {ROUTES} from "@/lib/constants/routes"
import {usePathname} from "next/navigation"

export default function MyShopNavBar(){

    const pathname = usePathname()
    return(
        <div className={styles.optionsContainer}>
            <div className={styles.options}>
                <div className={`${styles.singleOption} ${pathname === ROUTES.SHOPS ? styles.active : ''}`}>
                    <a href={ROUTES.MY_SHOP}>Meus Itens</a>
                </div>
                <div className={styles.singleOption}>
                    <a href={ROUTES.CREATE_ITEM}>Criar Itens</a>
                </div>
            </div>
        </div>
    );
}