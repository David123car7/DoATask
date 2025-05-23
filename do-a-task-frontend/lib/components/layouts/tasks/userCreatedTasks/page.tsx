"use client";

import styles from "./page.module.css";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import { GetTasksAndMemberTasksCreatedSchema } from "@/lib/schemas/tasks/get-task-member-created";
import {
  EvaluateTaskSchema,
  evaluateTaskSchema,
} from "@/lib/schemas/tasks/evaluate-task-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EvaluateTask } from "@/lib/api/tasks/evaluate.task";
import { useRouter } from "next/navigation";
import { DeleteTaskButton } from "../buttons/delete.task.button";
import { EditTaskButton } from "../buttons/edit.task.button";

interface UserCreatedTasksProps {
  taskMemberCreated: GetTasksAndMemberTasksCreatedSchema | null;
}

export function UserCreatedTasks({ taskMemberCreated }: UserCreatedTasksProps) {
  const [openTaskId, setOpenTaskId] = useState<number | null>(null);
  const [viewingDescriptionId, setViewingDescriptionId] = useState<
    number | null
  >(null);
  const formRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EvaluateTaskSchema>({
    resolver: zodResolver(evaluateTaskSchema),
  });

  const router = useRouter();

  const toggleEvaluationForm = (taskId: number) => {
    setOpenTaskId(openTaskId === taskId ? null : taskId);
  };

  const onSubmit = async (data: EvaluateTaskSchema) => {
    try {
      const responseData = await EvaluateTask(data);
      toast.success(responseData.message);
      setOpenTaskId(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setOpenTaskId(null);
      }

      if (descRef.current && !descRef.current.contains(event.target as Node)) {
        setViewingDescriptionId(null);
      }
    };

    if (openTaskId !== null || viewingDescriptionId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openTaskId, viewingDescriptionId]);

  return (
    <main className={styles.main}>
      <h2 className={styles.title}>As minhas tarefas</h2>
      <div className={styles.container}>
        <div className={styles.table}>
          <div className={styles.titles}>
            <p className={styles.values}>Tarefa</p>
            <p className={styles.values}>Estado</p>
            <p className={styles.values}>Ações</p>
          </div>

          {!taskMemberCreated && (
            <div className={styles.rowEmpty}>
              <p className={styles.valuesEmpty}>Ainda Não Criou Tarefas</p>
            </div>
          )}

          {taskMemberCreated?.tasks.map((task, index) => {
            const memberTask = taskMemberCreated.memberTasks[index];
            return (
              <div className={styles.row} key={task.id}>
                <p className={styles.values}>{task.title}</p>
                <p className={styles.values}>{memberTask.status}</p>
                <div className={styles.actions}>
                  <button
                    className={styles.button}
                    onClick={() => setViewingDescriptionId(task.id)}
                  >
                    Descrição
                  </button>
                  <EditTaskButton taskId={task.id} />
                  {!memberTask.completedAt ? (
                    <DeleteTaskButton taskId={task.id} />
                  ) : (
                    <button
                      className={styles.button}
                      onClick={() => toggleEvaluationForm(task.id)}
                    >
                      Avaliar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {viewingDescriptionId !== null &&
        (() => {
          const task = taskMemberCreated?.tasks.find(
            (t) => t.id === viewingDescriptionId
          );
          if (!task) return null;

          return (
            <div className={styles.modalOverlay}>
              <div ref={descRef} className={styles.descriptionPopup}>
                <div className={styles.popupHeader}>
                  <h3>Descrição</h3>
                  <button
                    className={styles.closeButton}
                    onClick={() => setViewingDescriptionId(null)}
                  >
                    &times;
                  </button>
                </div>

                <div className={styles.popupContent}>
                  <p>
                    <strong>Título:</strong> {task.title}
                  </p>
                  <p>
                    <strong>Descrição:</strong> {task.description}
                  </p>
                  {task.location && (
                    <p>
                      <strong>Localização:</strong> {task.location}
                    </p>
                  )}
                  {task.difficulty && (
                    <p>
                      <strong>Dificuldade:</strong> {task.difficulty}
                    </p>
                  )}
                  {(task.coins !== undefined || task.points !== undefined) && (
                    <div>
                      <strong>Recompensas:</strong>
                      <ul>
                        {task.coins !== undefined && (
                          <li>{task.coins} Moedas</li>
                        )}
                        {task.points !== undefined && (
                          <li>{task.points} Pontos</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div className={styles.popupFooter}>
                  <button
                    className={styles.closeButton}
                    onClick={() => setViewingDescriptionId(null)}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </main>
  );
}
