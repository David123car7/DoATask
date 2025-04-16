"use client"

import styles from './page.module.css'
import {ROUTES} from "@/lib/constants/routes"

export default function TaskNavBar(){
    return(
        <div className={styles.optionsContainer}>
            <div className={styles.options}>
                <div className={styles.singleOption}>
                    <a href={ROUTES.TASKS_AVAILABLE}>Encontrar Tarefas</a>
                </div>
                <div className={styles.singleOption}>
                    <a href={ROUTES.TASKS_USER__DOING_LIST}>Tarefas em progresso</a>
                </div>
                <div className={styles.singleOption}>
                    <a href={ROUTES.TASKS_USER_CREATED_LIST}>Tarefas criadas</a>
                </div>
                <div className={styles.singleOption}>
                    <a href={ROUTES.TASKS_CREATE}>Criar Tarefas</a>
                </div>
            </div>
        </div>
    );
}