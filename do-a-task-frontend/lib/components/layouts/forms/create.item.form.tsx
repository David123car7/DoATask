"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "@/app/tasks/create/page.module.css";
import { useRouter } from "next/navigation";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from "react-toastify";
import { ROUTES } from "@/lib/constants/routes";
import { CreateItemSchema, createItemSchema } from "@/lib/schemas/store/create-item-schema";
import { useState } from "react";
import { CreateItem } from "@/lib/api/store/create-item";

export default function CreateItemForm() {
  const {register, handleSubmit, formState: { errors }} = useForm<CreateItemSchema>({resolver: zodResolver(createItemSchema)});
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const onSubmit = async (data: CreateItemSchema) => {
    if (!selectedImage) {
      toast.error("Por favor, selecione uma imagem.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("stock", data.stock.toString());
      formData.append("image", selectedImage);

      const response = await CreateItem(formData);
      toast.success(response.message);
      router.push(ROUTES.HOME);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
         
        <div className={styles.container}>
          <Toaster />
        <div className={styles.formBox}>
          <h1 className={styles.mainTitle}>Criar Item</h1>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nome do Item</label>
              <input type="text" className={styles.input} {...register("name")} />
              {errors.name && <p className={styles.error_message}>{errors.name.message}</p>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Preço</label>
              <input type="number" className={styles.input} {...register("price", { valueAsNumber: true })} />
              {errors.price && <p className={styles.error_message}>{errors.price.message}</p>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Stock</label>
              <input type="number" className={styles.input} {...register("stock", { valueAsNumber: true })} />
              {errors.stock && <p className={styles.error_message}>{errors.stock.message}</p>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Imagem</label>
              <input
                type="file"
                accept="image/*"
                className={styles.input}
                onChange={handleFileChange}
              />
            </div>

            <button type="submit" className={styles.createButton}>
              Criar Item
            </button>
          </form>
        </div>
        </div>
  );
}

