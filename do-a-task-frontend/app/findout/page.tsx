
"use server";

import styles from './page.module.css';
import Footer from '@/lib/components/layouts/footer/page';
import{ROUTES, API_ROUTES } from "@/lib/constants/routes";
import HeaderWrapper from '@/lib/components/layouts/header/HeaderWrapper';
import{MdOutlineManageAccounts, HiOutlineHome, RiUserCommunityFill, FaTasks} from "@/lib/icons/index";
import { Header } from '@/lib/components/layouts/header/header';


export default async function Findout() {

  return (
    <div className="page">
      
      <HeaderWrapper/>

      <main>
        <section className={styles.containercenter}>
          <p>Transforme boas ações em benefícios com o DoaTask! Siga este guia simples para começar a ajudar a sua comunidade e ganhar recompensas.</p>
        </section>

        <div className={styles.space}></div>
        
        <section className={styles.containercenter}>
        <div>
          <h2>1. Cria uma Conta</h2>
            <p>O primeiro passo é registar-se.</p>
            <p>Basta inserir o seu e-mail, criar uma palavra-passe e preencher os dados básicos do seu perfil.</p>
            <p>Em poucos minutos, estará pronto para começar a usar a plataforma.</p>
        </div>
        <div className={styles.imageContainer}>
          <MdOutlineManageAccounts size={250} /> 
        </div>
        </section>
        <section className={styles.containercenter}>
          <div className={styles.buttons}>
            <a href={ROUTES.SIGNUP}>Cria uma conta</a>
            <a href={ROUTES.SIGNIN}>Iniciar sessão</a>
          </div>
        </section>

        <div className={styles.space}></div>

        <section className={styles.containercenter}>
        <div>
          <h2>2. Adiciona uma Morada</h2>
            <p>Para conectar-se com pessoas à sua volta, adicione a sua morada.</p>
            <p>Isto permite que veja tarefas disponíveis na sua área e realiza-las.</p>
        </div>
        <div className={styles.imageContainer}>
          <HiOutlineHome size={250} /> 
        </div>
        </section>
        <section className={styles.containercenter}>
          <div className={styles.buttons}>
            <a href={ROUTES.USER_MAIN}>Perfil</a>
          </div>
        </section>

        <div className={styles.space}></div>

        <section className={styles.containercenter}>
        <div>
          <h2>3. Cria ou Entra numa Comunidade</h2>
            <p>Junte-se a uma comunidade local já existente ou crie a sua!</p>
            <p>As comunidades permitem organizar tarefas específicas por bairro, escola, associação ou grupo de interesse.</p>
            <p>Assim, pode colaborar com quem partilha os mesmos objetivos.</p>
        </div>
        <div className={styles.imageContainer}>
          <RiUserCommunityFill size={250} />
        </div>
        </section>
        <section className={styles.containercenter}>
          <div className={styles.buttons}>
            <a href={ROUTES.CREATE_COMMUNITY}>Criar Comunidade</a>
            <a href={ROUTES.ENTER_COMMUNITY}>Entrar Comunidade</a>
          </div>
        </section>

        <div className={styles.space}></div>

        <section className={styles.containercenter}>
        <div>
          <h2>4. Cria ou Realiza uma Tarefa</h2>
            <p>Agora é a parte divertida: publique uma tarefa que precisa de ajuda — como levar compras a um vizinho, organizar um evento ou pintar um muro comunitário — ou aceite tarefas que outros tenham publicado.</p>
            <p>Cada vez que completa uma tarefa, ganha pontos e moedas DoaTask que podem ser trocados por brindes, descontos ou bilhetes para eventos.</p>
        </div>
        <div className={styles.imageContainer}>
          <FaTasks size={250} />
        </div>
        </section>
        <section className={styles.containercenter}>
          <div className={styles.buttons}>
            <a href={ROUTES.TASKS_CREATE}>Cria tarefa</a>
            <a href={ROUTES.TASKS_AVAILABLE}>Reliza tarefa</a>
          </div>
        </section>

        <div className={styles.space}></div>
      
      </main>
      <Footer/>
    </div>
  );
}