"use server";

import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import React from "react";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import Link from "next/link";
import styles from "./page.module.css";
import { ROUTES } from "@/lib/constants/routes";

export default async function TasksPage() {
  const pages = [
    {
      title: "Encontrar Tarefas",
      route: ROUTES.TASKS_AVAILABLE,
      description: "Veja as tarefas disponíveis para participar.",
    },
    {
      title: "Tarefas em Progresso",
      route: ROUTES.TASKS_USER__DOING_LIST,
      description: "Acompanhe suas tarefas em andamento.",
    },
    {
      title: "Tarefas Criadas",
      route: ROUTES.TASKS_USER_CREATED_LIST,
      description: "Gerencie as tarefas que você criou.",
    },
  ];

  return (
    <div className="page">
      <HeaderWrapper />
      <main>
        <Toaster />
        <div className={styles.container}>
          <b></b>
          <h1 className={styles.pageTitle}> Escolha uma opção! </h1>
          <div className={styles.taskGrid}>
            {pages.map((page, index) => (
              <Link href={page.route} key={index}>
                <div className={styles.task}>
                  <div className={styles.cardTitle}>{page.title}</div>
                  <p className={styles.description}>{page.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
