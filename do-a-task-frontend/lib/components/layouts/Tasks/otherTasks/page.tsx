'use client'

import styles from './page.module.css'
import { GetNameCommunitySchemaArray } from '@/lib/schemas/community/get-communityName-schema';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { GetTasksMemberDoing } from '@/lib/api/tasks/get.all.tasksVolunteer';
import { getTasksAndMemberTasksSchema } from '@/lib/schemas/tasks/get-task-member-doing';

export function OtherTasks({ community }: { community: GetNameCommunitySchemaArray | null }) {

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
      <div className={styles.options}>
        <select onChange={handleSelectChange} className={styles.selectCustom}>
          <option value="">Comunidades</option>
          {(community ?? []).map((c, index) => (
            <option key={index} value={c.communityName}>
              {c.communityName}
            </option>
          ))}
        </select>
        <a href="#" className={styles.singleOption}>Tarefas Criadas</a>
        <div className={styles.singleOption}>Estatísticas</div>
      </div>

      {!selectedCommunity ? (
        <div><h1>Stats User</h1></div>
      ) : (
        <div>
          <div className={styles.mainTitle}>Tarefas Realizadas</div>
          <div className={styles.table}>
            <div className={styles.titles}>
              <p className={styles.values}>Título</p>
              <p className={styles.values}>Descrição</p>
              <p className={styles.values}>Localização</p>
              <p className={styles.values}>Estado</p>
            </div>

            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                const relatedMemberTask = memberTasks.find(mt => mt.taskId === task.id);
                return (
                  <div key={index} className={styles.row}>
                    <p className={styles.values}>{task.title}</p>
                    <p className={styles.values}>{task.description}</p>
                    <p className={styles.values}>{task.location}</p>
                    <p className={styles.values}>{relatedMemberTask.status}</p>
                  </div>
                );
              })
            ) : (
              <div className={styles.noTasks}>Ainda não tem Tarefas</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}