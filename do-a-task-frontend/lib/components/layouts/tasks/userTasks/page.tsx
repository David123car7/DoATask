'use client'

import styles from './page.module.css'
import { GetNameCommunitySchemaArray } from '@/lib/schemas/community/get-communityName-schema';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { GetTasksMemberDoing } from '@/lib/api/tasks/get.tasks.member.doing';
import { getTasksAndMemberTasksSchema } from '@/lib/schemas/tasks/get-task-member-doing';
import { FinishTaskButton } from "@/lib/components/layouts/tasks/buttons/finish.task.button";


export function UserTasks({ community }: { community: GetNameCommunitySchemaArray | null }) {

  const { register } = useForm();
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [memberTasks, setMemberTasks] = useState<any[]>([]);

  const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const communityName = e.target.value;
    setSelectedCommunity(communityName);
    if (!communityName) return;

    try {
      const result = await GetTasksMemberDoing(communityName);
      const validated = getTasksAndMemberTasksSchema.parse(result);
      setTasks(validated.tasks);
      setMemberTasks(validated.memberTasks);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  return (
    <div className={styles.optionsContainer}>
        <select onChange={handleSelectChange} className={styles.selectCustom}>
          <option value=""></option>
          {(community ?? []).map((c, index) => (
            <option key={index} value={c.communityName}>
              {c.communityName}
            </option>
          ))}
        </select>

      <div>
          <div className={styles.mainTitle}>Tarefas em progresso</div>
          <div className={styles.table}>
            <div className={styles.titles}>
              <p className={styles.values}>Título</p>
              <p className={styles.values}>Descrição</p>
              <p className={styles.values}>Localização</p>
              <p className={styles.values}>Estado</p>
              <p className={styles.values}>Ação</p>
            </div>

            {!selectedCommunity ? (
            <div className={styles.noTasks}>Nao selecionou uma comunidade</div>
            ) : (
              <>
              {tasks.length > 0 ?  (
                tasks.map((task, index) => {
                  const memberTask = memberTasks.find(mt => mt.taskId === task.id);
                  return (
                    <div key={index} className={styles.row}>
                      <p className={styles.values}>{task.title}</p>
                      <p className={styles.values}>{task.description}</p>
                      <p className={styles.values}>{task.location}</p>
                      <p className={styles.values}>{memberTask.status}</p>
                      <FinishTaskButton memberTaskId={memberTask.id}></FinishTaskButton>
                    </div>
                  );
                })
              ) : (
                <div className={styles.noTasks}>Ainda não tem Tarefas</div>
              )}
              </>
            )}
          </div>
        </div>
    </div>
  );
}