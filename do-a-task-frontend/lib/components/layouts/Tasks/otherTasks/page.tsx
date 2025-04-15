'use client'

import Link from 'next/link';
import styles from './page.module.css'
import {ROUTES} from '@/lib/constants/routes'
import { GetNameCommunitySchemaArray } from '@/lib/schemas/community/get-communityName-schema';
import { register } from 'module';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { effect, string } from 'zod';
import { GetVolunteerTasksCommunity } from '@/lib/api/tasks/get.all.tasksVolunteer';
import { taskVolunteerDataSchema } from '@/lib/schemas/tasks/get-tasksVolunteer';



export function OtherTasks({community }: {community: GetNameCommunitySchemaArray | null }){

    const { register} = useForm();
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [tasks, setTasks] = useState<any[]>([]);

    const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const communityName = e.target.value;
        setSelectedCommunity(communityName);

        if (!communityName) return;

    try {
      const result = await GetVolunteerTasksCommunity(communityName);
      const validateTasks = taskVolunteerDataSchema.parse(result);
      setTasks(validateTasks);
      console.log("Tarefas", tasks)
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }

    
    };
    return(
        <div className={styles.optionsContainer}>
            <div className={styles.options}>
                <select onChange={handleSelectChange}
                    className={styles.selectCustom}>
                    <option value="">Comunidades</option>
                        {(community ??[]).map((c, index) => (
                            <option key={index} value={c.communityName}>
                            {c.communityName}
                            </option>
                        ))}      
                </select>
                <a href="#" className={styles.singleOption}>
                Tarefas Criadas
                </a>
                <div className={styles.singleOption}>
                Estatisticas
                </div>
            </div>
            {!selectedCommunity ?(
                <div><h1>Stats User</h1></div>
            ) : (
                <div>
                <div className={styles.mainTitle}>Tarefas Realizadas</div>

                <div className={styles.table}>

                    <div className={styles.titles}>
                        <p className={styles.values}>Titulo</p>
                        <p className={styles.values} >Localização</p>
                        <p className={styles.values} >Status</p>
                    </div>
                    {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <div key={index} className={styles.row}>
                                <p className={styles.values} >{task.title}</p>
                                <p className={styles.values} >{task.location}</p>
                                <p className={styles.values} >
                                {task.members.length === 0
                                    ? "Por Aceitar"
                                    :task.members.some((m: { completedAt: string }) => m.completedAt)
                                    ? "Concluida"
                                    : "Em Andamento"
                                }
                                </p>
                            </div>
                        ))
                    ):(
                        <div className={styles.noTasks}> Ainda não tem Tarefas</div>
                    )}             
                </div>
                </div>
            )}               

        </div>
    );
}
