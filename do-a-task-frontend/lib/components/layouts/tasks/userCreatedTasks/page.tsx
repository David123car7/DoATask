'use client'

import styles from './page.module.css'
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";
import { useState, useRef, useEffect} from 'react';
import { GetTasksMemberCreated } from '@/lib/api/tasks/get.tasks.member.created';
import { GetTasksAndMemberTasksCreatedSchema } from '@/lib/schemas/tasks/get-task-member-created';
import { EvaluateTaskSchema, evaluateTaskSchema } from '@/lib/schemas/tasks/evaluate-task-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Toaster } from '../../toaster/toaster';
import { EvaluateTask } from '@/lib/api/tasks/evaluate.task';
import { useRouter } from 'next/navigation';    
import { DeleteTaskButton } from '../buttons/delete.task.button';

export function UserCreatedTasks({ taskMemberCreated }: { taskMemberCreated: GetTasksAndMemberTasksCreatedSchema | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    const { register, handleSubmit, formState: { errors }} = useForm<EvaluateTaskSchema>({resolver: zodResolver(evaluateTaskSchema)});
    const router = useRouter();               
    const toggleMenu = () => setIsOpen(!isOpen);

    const onSubmit = async (data: EvaluateTaskSchema) => {
      try {
        const responseData = await EvaluateTask(data);
        toast.success(responseData.message)
        router.refresh()
      } catch (error: any) {
        toast.error(error.message)
      }
    };

    useEffect(() => {

      const handleClickOutside = (event: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    return(
    <main className={styles.main}>
        <h2 className={styles.title}>As minhas tarefas</h2>
            <div className={styles.container}>
                <div className={styles.table}>

                    <div className={styles.titles}>
                        <p className={styles.values}>Tarefa</p>
                        <p className={styles.values}>Descrição</p>
                        <p className={styles.values}>Estado</p>
                        <p className={styles.hide}>Button</p>
                    </div>  
                    {!taskMemberCreated &&(
                      <div className={styles.rowEmpty}>
                        <p className={styles.valuesEmpty}> Ainda Não Criou Tarefas</p>
                      </div>
                    )} 
                    {taskMemberCreated  && taskMemberCreated.tasks.length > 0 && (
                        taskMemberCreated.tasks.map((task, index) => {
                            const memberTask = taskMemberCreated.memberTasks[index]
                            //const community = taskMemberCreated.community[index]
                            return(
                                <div className={styles.container}>
                                <div className={styles.row} key={index}>
                                    <p className={styles.values}>{task.title}</p>
                                    <p className={styles.values}>{task.description}</p>
                                    <p className={styles.values}>{memberTask.status}</p>
                                    {!memberTask.completedAt ? (
                                        <DeleteTaskButton taskId={task.id}/>
                                    ) : (
                                        <button className={styles.button} onClick={toggleMenu}>Avaliar</button>
                                    )}
                                </div>
                                {isOpen && (
                                    <div ref={formRef} className={styles.formBox}>
                                    <div className={styles.titleBox}>
                                        <div className={styles.mainTitle}>Avaliar Tarefa</div>
                                    </div>
                                    <form  onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                                        <input hidden={true} type="number" {...register('memberTaskId', { valueAsNumber: true }) } className={styles.input} value={memberTask.id}/>
                                        <input type="number" {...register('score', { valueAsNumber: true })} className={styles.input} placeholder="Score"/>
                                        {errors.score && <p>{errors.score.message}</p> }
                                        <button type ="submit" className={styles.submitButton}>Submeter</button>
                                    </form>
                                    </div>
                                )}
                                </div>
                            )
                        })
                    )}
            
                </div>
            </div>
    </main>
);
}