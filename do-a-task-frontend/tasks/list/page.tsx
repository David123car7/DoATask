"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import styles from "./page.module.css";
import { FiShoppingCart } from "react-icons/fi"; // 🛒 Shopping Cart icon
import { FaCoins } from "react-icons/fa"; // 🪙 Coin icon

export default function HomePage() {
  // Sample tasks
  const tasks = [
    {
      id: 1,
      title: "Limpar a casa",
      description:
        "Sou uma senhora com 70 anos e preciso que alguém faça a limpeza da casa.",
      reward: 25,
      image: "/images/cleaning.jpg",
      user: "Ana Mendes",
    },
    {
      id: 2,
      title: "Ajuda com as compras",
      description:
        "Preciso de alguém para ir ao supermercado e trazer alguns mantimentos.",
      reward: 15,
      image: "/images/shopping.jpg",
      user: "Maria Rocha",
    },
    {
      id: 3,
      title: "Arranjos domésticos",
      description:
        "Preciso de ajuda para trocar uma lâmpada e fixar uma prateleira.",
      reward: 20,
      image: "/images/home_fix.jpg",
      user: "João Carlos",
    },
    {
      id: 4,
      title: "Passear cão",
      description: "O meu cão tem muita energia e precisa de um bom passeio.",
      reward: 10,
      image: "/images/dog_walk.jpg",
      user: "José Ferreira",
    },
    {
      id: 5,
      title: "Recolha de lixo no parque",
      description: "Vamos limpar um pequeno espaço verde do bairro!",
      reward: 30,
      image: "/images/park_clean.jpg",
      user: "Pedro",
    },
    {
      id: 6,
      title: "Organização de evento",
      description:
        "Precisamos de voluntários para ajudar na montagem de um evento local.",
      reward: 50,
      image: "/images/event.jpg",
      user: "Associação",
    },
  ];

  return (
    <div className="page-list">
      <header>
        <div>
          <h1 className="logo_title">DOATASK</h1>
        </div>
        <nav>
          <ul>
            <li>
              <a href="#">Sobre</a>
            </li>
            <li>
              <a href="#">Criadores</a>
            </li>
            <li>
              <a href="#">Conta</a>
            </li>
            <li>
              <a href="#">
                <div className={styles.loginBox}>Login</div>
              </a>
            </li>
          </ul>
        </nav>
      </header>
      {/* <header>
      </div>
      <h1 className="logo_title">DOATASK</h1>
        <div className={styles.header_right}>
          <FiShoppingCart size={24} />
          <span className={styles.coin_box}>
            <FaCoins /> 125
          </span>
          <Image
            src="/images/profile.jpg"
            alt="User"
            width={40}
            height={40}
            className={styles.profile_image}
          />
        </div>
      </headerlassName=>  */}
      {/* Featured Task */}
      <section className={styles.container_form}>
        <div className={styles.formBox}>
          <Image
            src="/images/lawn_mowing.jpg"
            alt="Cortar Relva"
            width={300}
            height={200}
            className={styles.task_image}
          />
          <div>
            <h2 className={styles.mainTitle}>Cortar Relva</h2>
            <p className={styles.description}>Submetido por João Carlos</p>
            <div className={styles.rewardBox}>
              <FaCoins /> <span>10</span>
            </div>
            <p className={styles.description}>
              Preciso que alguém me corte a relva, disponibilizo as máquinas
              necessárias para o mesmo.
            </p>
            <p className={styles.title}>Tempo: 2h</p>
            <button className={styles.submitButton}>Aceitar a tarefa</button>
          </div>
        </div>
      </section>

      {/* Other Tasks */}
      <section className={styles.container}>
        <h3 className={styles.mainTitle}>Outras Tarefas</h3>
        <div className={styles.grid}>
          {tasks.map((task) => (
            <div key={task.id} className={styles.taskCard}>
              <Image
                src={task.image}
                alt={task.title}
                width={300}
                height={200}
                className={styles.task_image}
              />
              <h4 className={styles.title}>{task.title}</h4>
              <p className={styles.description}>{task.user}</p>
              <p className={styles.description}>{task.description}</p>
              <div className={styles.rewardBox}>
                <FaCoins /> <span>{task.reward}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.information}>
        <h2 className={styles.mainTitle}>DOATASK</h2>
        <div className={styles.titleBox}>
          <Image
            src="/assets/linkedinlogo.png"
            alt="LinkedIn"
            width={30}
            height={30}
          />
          <Image
            src="/assets/facebooklogo.png"
            alt="Facebook"
            width={30}
            height={30}
          />
          <Image
            src="/assets/twitterlogo.png"
            alt="Twitter"
            width={30}
            height={30}
          />
        </div>
      </footer>
    </div>
  );
}
