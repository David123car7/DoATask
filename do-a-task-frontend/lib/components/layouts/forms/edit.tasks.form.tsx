"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "@/app/tasks/create/page.module.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import { UpdateTask } from "@/lib/api/tasks/update.task";
import { getTaskSchema } from "@/lib/schemas/tasks/get-task-member-created";
import { getNameCommunitySchemaArray } from "@/lib/schemas/community/get-communityName-schema";

type TaskFormData = ReturnType<typeof getTaskSchema.parse>;

interface EditTaskFormProps {
  communityData: ReturnType<typeof getNameCommunitySchemaArray.parse>;
  taskData: TaskFormData;
}

export default function EditTaskForm({
  communityData,
  taskData,
}: EditTaskFormProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(getTaskSchema),
    defaultValues: {
      ...taskData,
      difficulty: taskData.difficulty ?? 1,
      coins: taskData.coins ?? 0,
      points: taskData.points ?? 0,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const onSubmit = async (data: TaskFormData) => {
    try {
      const formData = new FormData();
      formData.append("id", data.id.toString());
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("location", data.location);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await UpdateTask(data.id, formData);
      toast.success("voluntariado atualizada com sucesso!");
      router.push("/app");
    } catch (error: any) {
      toast.error("Erro ao atualizar voluntariado: " + error.message);
    }
  };

  const difficultyOptions = [
    { value: 1, label: "Fácil" },
    { value: 2, label: "Normal" },
    { value: 3, label: "Difícil" },
  ];

  return (
    <div className="page-auth">
      <main>
        <div className={styles.container}>
          <div className={styles.formBox}>
            <h1 className={styles.mainTitle}>Editar voluntariado</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <input type="hidden" {...register("id")} />
              <input type="hidden" {...register("creatorId")} />

              <div className={styles.inputGroup}>
                <label className={styles.label}>Título da voluntariado</label>
                <input
                  type="text"
                  className={styles.input}
                  {...register("title")}
                  placeholder="Título"
                />
                {errors.title && (
                  <p className={styles.error_message}>{errors.title.message}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Descrição</label>
                <input
                  type="text"
                  className={styles.input}
                  {...register("description")}
                  placeholder="Descrição"
                />
                {errors.description && (
                  <p className={styles.error_message}>
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Localização</label>
                <input
                  type="text"
                  className={styles.input}
                  {...register("location")}
                  placeholder="Localização"
                />
                {errors.location && (
                  <p className={styles.error_message}>
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Dificuldade</label>
                <select
                  {...register("difficulty", { valueAsNumber: true })}
                  className={styles.input}
                >
                  {difficultyOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Moedas</label>
                <input
                  type="number"
                  className={styles.input}
                  {...register("coins", { valueAsNumber: true })}
                  min="0"
                />
                {errors.coins && (
                  <p className={styles.error_message}>{errors.coins.message}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Pontos</label>
                <input
                  type="number"
                  className={styles.input}
                  {...register("points", { valueAsNumber: true })}
                  min="0"
                />
                {errors.points && (
                  <p className={styles.error_message}>
                    {errors.points.message}
                  </p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Imagem da voluntariado</label>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.input}
                  onChange={handleFileChange}
                />
              </div>

              <button type="submit" className={styles.createButton}>
                Atualizar voluntariado
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
