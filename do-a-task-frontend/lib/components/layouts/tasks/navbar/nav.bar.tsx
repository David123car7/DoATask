"use client"

import styles from './page.module.css'
import {ROUTES} from "@/lib/constants/routes"
import { usePathname } from 'next/navigation';


export default function TaskNavBar(){

    const pathname = usePathname();

    return(
        <div className={styles.optionsContainer}>
            <div className={styles.options}>
                <div className={`${styles.singleOption} ${pathname === ROUTES.TASKS_AVAILABLE ? styles.active : ''}`}>
                    <a href={ROUTES.TASKS_AVAILABLE}>Encontrar Tarefas Voluntariado</a>
                </div>
                <div className={`${styles.singleOption} ${pathname === ROUTES.TASKS_USER__DOING_LIST ? styles.active : ''}`}>
                    <a href={ROUTES.TASKS_USER__DOING_LIST}>Tarefas Voluntariado em Progresso</a>
                </div>
                <div className={`${styles.singleOption} ${pathname === ROUTES.TASKS_USER_CREATED_LIST ? styles.active : ''}`}>
                    <a href={ROUTES.TASKS_USER_CREATED_LIST}>Tarefas Voluntariado Criadas</a>
                </div>
                <div className={`${styles.singleOption} ${pathname === ROUTES.TASKS_CREATE ? styles.active : ''}`}>
                    <a href={ROUTES.TASKS_CREATE}>Criar Tarefas Voluntariado</a>
                </div>
            </div>
        </div>
    );
}