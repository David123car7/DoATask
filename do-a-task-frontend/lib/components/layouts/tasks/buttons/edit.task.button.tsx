// components/buttons/edit.task.button.tsx
"use client";

import { useRouter } from "next/navigation";
import style from "./page.module.css";

export function EditTaskButton({ taskId }: { taskId: number }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/tasks/edit/${taskId}`);
  };

  return (
    <button className={style.button} onClick={handleEdit}>
      Editar
    </button>
  );
}
