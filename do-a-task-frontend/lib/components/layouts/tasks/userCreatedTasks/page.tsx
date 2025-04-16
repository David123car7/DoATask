'use client'

import styles from './page.module.css'
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { GetTasksMemberCreated } from '@/lib/api/tasks/get.tasks.member.created';
import { GetTasksAndMemberTasksCreatedSchema } from '@/lib/schemas/tasks/get-task-member-created';

export function UserCreatedTasks({ taskMemberCreated }: { taskMemberCreated: GetTasksAndMemberTasksCreatedSchema | null }) {

  return(
    <main className={styles.main}>
        <h2 className={styles.title}>As minhas tarefas</h2>
            <div className={styles.container}>
                <div className={styles.table}>

                    <div className={styles.titles}>
                        <p className={styles.values}>Tarefa</p>
                        <p className={styles.values}>Descrição</p>
                        <p className={styles.values}>Estado</p>
                    </div>  
                    
                    {taskMemberCreated  && taskMemberCreated.tasks.length > 0 && (
                        taskMemberCreated.tasks.map((task, index) => {
                            const memberTask = taskMemberCreated.memberTasks[index]
                            //const community = taskMemberCreated.community[index]
                            return(
                                <div className={styles.row} key={index}>
                                    <p className={styles.values}>{task.title}</p>
                                    <p className={styles.values}>{task.description}</p>
                                    <p className={styles.values}>{memberTask.status}</p>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
    </main>
);
}