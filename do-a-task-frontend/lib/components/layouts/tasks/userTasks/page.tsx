'use client'

import styles from './page.module.css'
import { GetTasksMemberDoingSchema } from "@/lib/schemas/tasks/get-task-member-doing";
import { FinishTaskButton } from "@/lib/components/layouts/tasks/buttons/finish.task.button";
import { CancelTaskButton } from '../buttons/cancel.task.butto';

export function UserTasks({ data }: { data: GetTasksMemberDoingSchema | null }) {
  return (
    <div className={styles.optionsContainer}>
       <div className={styles.title}>Tarefas em progresso</div>
      <div className={styles.container}>
          <div className={styles.table}>
            <div className={styles.titles}>
              <p className={styles.values}>Título</p>
              <p className={styles.values}>Estado</p>
              <p className={styles.values}>Comunidade</p>
            </div>
              {data && data.tasks.length > 0 ?  (
                data.tasks.map((task, index) => {
                  const memberTasks = data.memberTasks[index]
                  const communities = data.community[index]
                  return (
                    <div key={index} className={styles.row}>
                      <p className={styles.values}>{task.title}</p>
                      <p className={styles.values}>{memberTasks.status}</p>
                      <p className={styles.values}>{communities.communityName}</p>
                      <FinishTaskButton memberTaskId={memberTasks.id}></FinishTaskButton>
                      <CancelTaskButton taskId={task.id}/>
                    </div>
                  );
                })
              ) : (
                <div className={styles.noTasks}>Ainda não tem Tarefas</div>
              )}
             
          </div>
        </div>
    </div>
  );
}