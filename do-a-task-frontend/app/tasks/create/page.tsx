"use client";

import { FiShoppingCart } from "react-icons/fi"; // 🛒 Shopping Cart icon
import { FaCoins, FaShoppingCart } from "react-icons/fa";
import { useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";

export default function PublishTask() {
  const [formData, setFormData] = useState({
    title: "",
    difficulty: "Easy",
    images: [null, null, null],
    description: "",
    name: "",
    email: "",
    phone: "",
  });

  const handleImageUpload = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      const newImages: (string | null)[] = [...formData.images];
      newImages[index] = URL.createObjectURL(files[0]); // Temporary preview
      setFormData({ ...formData, images: newImages });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="page-create-task">
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

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Title Input */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Título da tarefa</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Escreva o título..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          {/* Difficulty Dropdown */}
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
          <br />
          {/* Image Upload */}
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
                        onChange={(e) => handleImageUpload(index, e)}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Description */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Descrição</label>
            <textarea
              className={styles.input}
              placeholder="Esta tarefa..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <br /> <br />
          {/* Contact Info */}
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
          <br />
          {/* Submit Button */}
          <button type="submit" className={styles.createButton}>
            Partilhar
          </button>
        </form>
      </div>
    </div>
  );
}
