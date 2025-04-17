'use client'
import React from "react";
import styles from './page.module.css'
import { useState } from "react";
import { GetNameCommunitySchemaArray } from "@/lib/schemas/community/get-communityName-schema";
import { GetTasksBeDone } from "@/lib/api/tasks/get.all.taskBeDoneCommunity";
import { taskResponseSchema } from "@/lib/schemas/tasks/get-all-taskBeDoneCommunity";
import { FaLocationPin, FaCoins } from "@/lib/icons/index";
import { AssignTaskButton } from "../buttons/assign.task.button";
import { GetUser } from "@/lib/utils/supabase/user/get-user";


export function AvaiableTasks({community }: {community: GetNameCommunitySchemaArray | null }){

    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [tasks, setTasks] = useState<any[]>([]);
    const [memberTasks, setMemberTasks] = useState<any[]>([]);


    const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const communityName = e.target.value;
        setSelectedCommunity(communityName);
        console.log(communityName);
    try {
        const result = await GetTasksBeDone(communityName)
        const validateTasks = taskResponseSchema.parse(result);

        setTasks(validateTasks.tasks);
        setMemberTasks(validateTasks.memberTasks);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
    }
    }
    console.log("Tarefas", tasks)

    
    return(
        <div className={styles.container}>
            <select onChange={handleSelectChange}
                    className={styles.selectCustom}>
                    <option value=""></option>
                        {(community ??[]).map((c, index) => (
                            <option key={index} value={c.communityName}>
                            {c.communityName}
                            </option>
                        ))}      
            </select>
            <div className={styles.taskGrid}>
            
            {tasks.length > 0 ?(
                tasks.map((tasks, index) =>(
                    <div key={index} className={styles.task}>
                    <div className={styles.imageTask}>
                        Image
                    </div>
                    <div className={styles.title}>{tasks.title}</div>
                    <p className={styles.description}><strong>Descrição: </strong>{tasks.description}</p>
                    <p className={styles.location}><strong>Morada: </strong><FaLocationPin/> {tasks.location}</p>
                        <p className={styles.description}><strong>Dificuldade: </strong> {tasks.difficulty}</p>
                        <div className={styles.difficulty}>Recompensas:
                        <p>- {tasks.coins}Moedas</p>
                        <p>- {tasks.points} Pontos</p>
                        </div>
                    
                    <div className={styles.buttonContainer}>
                        <AssignTaskButton taskId={tasks.id}/>
                    </div>
                </div>
                ))
                
            ):(
                <h1>Sem tarefas</h1>
            )}    
            </div>
        </div>
    );
}