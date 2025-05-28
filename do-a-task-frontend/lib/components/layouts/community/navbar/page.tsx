'use client'

import Link from 'next/link';
import styles from './page.module.css'
import {ROUTES} from '@/lib/constants/routes'
import { GetNameCommunitySchemaArray } from '@/lib/schemas/community/get-communityName-schema';
import { register } from 'module';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { effect } from 'zod';
import { taskDataSchema } from '@/lib/schemas/tasks/get-tasksByCommunity-schema';
import { GetAllTasksCommunity } from '@/lib/api/tasks/get.all.tasksCommunity';

export function ListTask({community }: {community: GetNameCommunitySchemaArray | null }){

    const { register} = useForm();
    const [selectedCommunity, setSelectedCommunity] = useState('');

    const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const communityName = e.target.value;
        setSelectedCommunity(communityName);

        if (!communityName) return;

    try {
      const result = await GetAllTasksCommunity(communityName);
      const tasks = taskDataSchema.parse(result);
      console.log(tasks);
    } catch (error) {
      console.error('Erro ao buscar voluntariados:', error);
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
                <div className={styles.singleOption}>
                voluntariados Criadas
                </div>
                <div className={styles.singleOption}>
                voluntariados Aceites
                </div>
            </div>
            
            <div className={styles.mainTitle}>voluntariados Realizadas</div>

            <div className={styles.table}>

                <div className={styles.titles}>
                    <p className={styles.values}>Titulo</p>
                    <p className={styles.values} >Localização</p>
                    <p className={styles.values} >Data</p>
                </div>
                
                <div className={styles.row}>
                    <p className={styles.values} >Teste</p>
                    <p className={styles.values} >Teste</p>
                    <p className={styles.values} >Teste</p>
                    <p className={styles.values} >Teste</p>
                </div>
                
            </div>
        </div>
    );
}
