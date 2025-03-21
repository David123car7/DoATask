'use client'; // Mark this as a Client Component
import { useState } from 'react';
import styles from './page.module.css';

export default function MainPage() {
  return (
    <div className='page'>
      <header>
                <div>
                    <h1 className={styles.logo_title}>DOATASK</h1>
                </div>
                <nav>
                    <ul>
                        <li><a href="#">Sobre</a></li>
                        <li><a href="#">Criadores</a></li>
                        <li><a href="#">Conta</a></li>
                        <li><a href="#"><div className={styles.loginBox}>Login</div></a></li>
                    </ul>
                </nav>
            </header>
    <main>
      <div className={styles.formBox}>
        <div className={styles.titleBox}>
          <p>Ajude a sua comunidade e seja recompensado! No DoATask, pode publicar ou aceitar tarefas, desde apoiar vizinhos idosos até organizar eventos locais. Ao completar tarefas, ganha pontos e moedas que pode trocar por brindes ou bilhetes para eventos. Suba na classificação, receba avaliações e faça a diferença na sua cidade.</p>
        </div>
        <div>
          <ul>
            <li><p>Publique e aceite tarefas</p></li>
            <li><p>Ganhe recompensas</p></li>
            <li><p>Melhore a sua classificação</p></li>
            <li><p>Junte-se ao DoATask e transforme boas ações em benefícios!</p></li>
          </ul>
        </div>
      </div>
    </main>
    </div>
  );
}