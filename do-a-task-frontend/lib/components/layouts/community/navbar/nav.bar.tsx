"use client"

import styles from './page.module.css'
import {ROUTES} from "@/lib/constants/routes"

export default function CommunityNavBar(){
    return(
        <div className={styles.optionsContainer}>
            <div className={styles.options}>
                <div className={styles.singleOption}>
                    <a href={ROUTES.ENTER_COMMUNITY}>Encontrar Comunidades</a>
                </div>
                <div className={styles.singleOption}>
                    <a href={ROUTES.USER_COMMUNITY}>As minhas comunidades</a>
                </div>
            </div>
        </div>
    );
}