"use client";

import { TaskButton } from "@/lib/components/layouts/tasks/buttons/task.button"; // adjust path if needed
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import styles from "./page.module.css";

export function TasksPage() {
  const pages = [
    {
      title: "Encontrar Tarefas Voluntariado",
      route: "/tasks/list/tasksAvailable",
    },
    {
      title: "Criar Tarefas Voluntariado",
      route: "/tasks/create",
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Escolhe uma opção!</h1>
      <div className={styles.buttonContainer}>
        {pages.map((page, index) => (
          <TaskButton key={index} title={page.title} route={page.route} />
        ))}
      </div>
    </div>
  );
}
