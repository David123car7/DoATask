"use client";

import { FiShoppingCart } from "react-icons/fi"; // 🛒 Shopping Cart icon
import { FaCoins, FaShoppingCart } from "react-icons/fa";
import { useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { createTaskSchema, type CreateTaskSchema } from "../schema/createTask-form-schema";
import { title } from "process";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { CreateTask } from "../../../lib/api/tasks/createTask"; // Import your API function

export default function PublishTask() {

  const{
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema), // Use Zod for validation
  });

  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (data: CreateTaskSchema) => {
    try {
      setSuccessMessage('');
      const responseData = await CreateTask(data);
      setSuccessMessage('Task criada com sucesso!');
      //router.push(ROUTES.HOME)///Trocar para a pagina inicial das tasks
    }catch (error: any) {
      if (error.field) {
        setError(error.field, { type: 'manual', message: error.message });
      } else {
        setError('root.serverError', { type: 'manual', message: error.message || 'An unexpected error occurred' });
      }
    }
  };

  return (
    <div className="page">
      <header>
        <div>
          <h1 className="logo_title">DOATASK</h1>
        </div>
        <nav>
          <ul>
            <li>
              <FaShoppingCart size={24} />
            </li>
            <a> </a>
            <li>
              <a href="#">125</a>
            </li>
            <li>
              <FaCoins />
            </li>
            <li>
              <a href="#">
                <Image
                  src="/assets/userIcon.png"
                  alt="User"
                  width={40}
                  height={40}
                />
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <div className={styles.formBox}>
        <h1 className={styles.mainTitle}>Publicar Tarefa</h1>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Title Input */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Título da tarefa</label>
            <input type= "text" {...register('title')} placeholder="titulo"/>
          </div>
          {/* Difficulty Dropdown */}
          {/* 
          <div className={styles.inputGroup}>
            <label className={styles.label}>Dificuldade</label>
            <select
              className={styles.input}
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
            >
              <option value="default" hidden>
                Selecionar
              </option>

              <option value="Medium">Médio</option>
              <option value="Easy">Fácil</option>
              <option value="Hard">Difícil</option>
            </select>
          </div>
          <br />*/}
          {/* Image Upload */}

          {/* 
          <div className={styles.inputGroup}>
            <label className={styles.label}>Imagens</label>
            <div className={styles.container}>
              {formData.images.map((img, index) => (
                <div
                  key={index}
                  className={styles.input}
                  style={{
                    width: "400px",
                    height: "400px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "0px",
                  }}
                >
                  {img ? (
                    <Image
                      src={img}
                      alt="Preview"
                      width={400}
                      height={400}
                      style={{
                        objectFit: "cover",
                        borderRadius: "0px",
                      }}
                    />
                  ) : (
                    <label style={{ cursor: "pointer" }}>
                      <span style={{ fontSize: "100px", color: "#666" }}>
                        +
                      </span>
                      <input
                        type="file"
                        style={{ display: "none" }}
                        accept="image/*"
                        //onChange={(e) => handleImageUpload(index, e)}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>*/}
          {/* Description */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Descrição</label>
            <input type="text" {...register('difficulty')} />  
          </div>

          {/*  
          <br /> <br />
          {/* Contact Info 
          <div className={styles.inputGroup}>
            <label className={styles.label}>Dados de contacto</label>
            <div className={styles.container}>
              <input
                type="text"
                className={styles.input}
                placeholder="Nome Completo"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                className={styles.input}
                placeholder="E-mail"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="tel"
                className={styles.input}
                placeholder="Número de Telefone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>
          <br />*/}
          {/* Submit Button */}
          <button type="submit" className={styles.createButton}>
            Partilhar
          </button>
        </form>
      </div>
    </div>
  );
}
