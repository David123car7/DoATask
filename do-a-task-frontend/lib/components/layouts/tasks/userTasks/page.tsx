'use client'

import styles from './page.module.css'
import { GetNameCommunitySchemaArray } from '@/lib/schemas/community/get-communityName-schema';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { GetTasksMemberDoing } from '@/lib/api/tasks/get.tasks.member.doing';
import { getTasksMemberDoingSchema, GetTasksMemberDoingSchema } from "@/lib/schemas/tasks/get-task-member-doing";
import { FinishTaskButton } from "@/lib/components/layouts/tasks/buttons/finish.task.button";


export function UserTasks({ data }: { data: GetTasksMemberDoingSchema | null }) {
  return (
    <div className={styles.optionsContainer}>
      <div>
          <div className={styles.mainTitle}>Tarefas em progresso</div>
          <div className={styles.table}>
            <div className={styles.titles}>
              <p className={styles.values}>Título</p>
              <p className={styles.values}>Estado</p>
              <p className={styles.values}>Comunidade</p>
              <p className={styles.values}>Ação</p>
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