"use client"

import styles from './page.module.css'
import {ROUTES} from "@/lib/constants/routes"

export default function ShopNavBar(){
    return(
        <div className={styles.optionsContainer}>
            <div className={styles.options}>
                <div className={styles.singleOption}>
                    <a href={ROUTES.SHOPS}>Lojas</a>
                </div>
                <div className={styles.singleOption}>
                    <a href={ROUTES.MY_SHOP}>Minha Loja</a>
                </div>
            </div>
        </div>
    );
}