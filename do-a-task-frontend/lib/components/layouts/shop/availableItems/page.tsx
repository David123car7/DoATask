'use client'
import React from "react";
import styles from './page.module.css'
import { useState } from "react";
import { GetNameCommunitySchemaArray } from "@/lib/schemas/community/get-communityName-schema";
import { GetTasksBeDone } from "@/lib/api/tasks/get.all.taskBeDoneCommunity";
import { taskResponseSchema } from "@/lib/schemas/tasks/get-all-taskBeDoneCommunity";
import { FaLocationPin, FaCoins } from "@/lib/icons/index";

export function AvaiableItems({community }: {community: GetNameCommunitySchemaArray | null }){
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [tasks, setTasks] = useState<any[]>([]);
    const [memberTasks, setMemberTasks] = useState<any[]>([]);

    const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const communityName = e.target.value;
        setSelectedCommunity(communityName);
        console.log(communityName);
    try {

    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
    }
    }

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
            </div>
        </div>
    );
}