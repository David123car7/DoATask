"use client"

import styles from './page.module.css'
import {ROUTES} from "@/lib/constants/routes"
import { usePathname } from 'next/navigation';

export default function CommunityNavBar(){
    const pathname = usePathname();
    return(
        <div className={styles.optionsContainer}>
            <div className={styles.options}>
                <div className={`${styles.singleOption} ${pathname === ROUTES.ENTER_COMMUNITY ? styles.active : ''}`}>
                    <a href={ROUTES.ENTER_COMMUNITY}>Encontrar Comunidades</a>
                </div>
                <div className={`${styles.singleOption} ${pathname === ROUTES.USER_COMMUNITY ? styles.active : ''}`}>
                    <a href={ROUTES.USER_COMMUNITY}>As minhas comunidades</a>
                </div>
                <div className={`${styles.singleOption} ${pathname === ROUTES.CREATE_COMMUNITY ? styles.active : ''}`}>
                    <a href={ROUTES.CREATE_COMMUNITY}>Criar Comunidade</a>
                </div>
            </div>
        </div>
    );
}