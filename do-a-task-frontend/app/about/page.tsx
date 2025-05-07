"use client";

import React from "react";
import Footer from "@/lib/components/layouts/footer/page";
import styles from "./page.module.css";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";

export default function about() {
  return (
    <>
      <HeaderWrapper />
      <div className={styles.aboutcontainer}>
        <h1 className={styles.abouttitle}>Sobre Nós</h1>
        <h2 className={styles.aboutsubtitle}>Ajuda o próximo</h2>
        <p className={styles.abouttext}>
          ​Imagina um lugar onde ajudar faz mesmo a diferença — e ainda és
          recompensado por isso. Esta aplicação foi criada para tornar o
          voluntariado mais acessível, divertido e motivador. Aqui, podes
          publicar tarefas que precisas de ajuda ou juntar-te a desafios de
          outros, contribuindo com o teu tempo e boa vontade.
        </p>
        <p className={styles.abouttext}>
          Cada tarefa que concluis vale pontos e moedas, que te ajudam a subir
          no ranking e desbloquear recompensas exclusivas na loja. Tudo gira em
          torno de comunidades: podes criar a tua, juntar-te a uma na tua
          localidade ou construir uma rede de impacto com quem partilha os teus
          valores.
        </p>
        <p className={styles.abouttext}>
          Mais do que uma plataforma, é um movimento onde ganhar é sinónimo de
          ajudar.
        </p>
      </div>
      <Footer />
    </>
  );
}
