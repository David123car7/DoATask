"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCoins, FaShoppingCart, CiUser } from "@/lib/icons";
import styles from "@/app/tasks/create/page.module.css";
import {
  CreateTaskSchema,
  createTaskSchema,
} from "@/lib/schemas/tasks/create-task-form-schema";
import { useRouter } from "next/navigation";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from "react-toastify";
import { ROUTES } from "@/lib/constants/routes";
import { CreateTask } from "@/lib/api/tasks/create.task";
import { GetNameCommunitySchemaArray } from "@/lib/schemas/community/get-communityName-schema";
import { useState } from "react";

export default function CreateTaskForm({
  communityData,
}: {
  communityData: GetNameCommunitySchemaArray;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
  });
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const onSubmit = async (data: CreateTaskSchema) => {
    if (!selectedImage) {
      toast.error("Por favor, selecione uma imagem.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("tittle", data.tittle);
      formData.append("description", data.description);
      formData.append("difficulty", data.difficulty.toString());
      formData.append("location", data.location);
      formData.append("communityName", data.communityName);
      formData.append("image", selectedImage);

      const responseData = await CreateTask(formData);
      toast.success(responseData.message);
      router.push(ROUTES.TASKS_USER_CREATED_LIST);
    } catch (error: any) {
      toast.error(error.message);
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
            <h1 className={styles.mainTitle}>Publicar voluntariado</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Título da voluntariado</label>
                <input
                  type="text"
                  className={styles.input}
                  {...register("tittle")}
                  placeholder="Título"
                />
                {errors.tittle && (
                  <p className={styles.error_message}>
                    {errors.tittle.message}
                  </p>
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
                <label className={styles.label}>Imagens</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className={styles.input}
                  onChange={handleFileChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Comunidade</label>
                <select {...register("communityName")} className={styles.input}>
                  {communityData.map((community, index) => (
                    <option key={index} value={community.communityName}>
                      {community.communityName}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className={styles.createButton}>
                Criar voluntariado
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
