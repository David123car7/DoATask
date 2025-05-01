
"use server";

import styles from './page.module.css';
import Image from 'next/image';
import { ROUTES, API_ROUTES } from "../lib/constants/routes";
import { GetUser } from '../lib/utils/supabase/user/get-user';
import Footer from '@/lib/components/layouts/footer/page';
import HeaderWrapper from '@/lib/components/layouts/header/HeaderWrapper';
import{MdOutlineVolunteerActivism,FiBookOpen,RiHandCoinLine,IoPersonOutline,BiTask} from "@/lib/icons/index";
import { Header } from '@/lib/components/layouts/header/header';


export default async function Home() {

  const user = await GetUser();
  return (
    <div className="page">
      {!user ?(
        <Header userData={null}/>
      ):(
        <HeaderWrapper/>
      )}
      

      <main>
      {/* Hero Section */}
      <section className={styles.letter}>
        <p>Ajude a sua comunidade e seja recompensado! No DoaTask, pode publicar ou aceitar tarefas, desde apoiar vizinhos idosos até organizar eventos locais. Ao completar tarefas, ganha pontos e moedas que pode trocar por brindes ou bilhetes para eventos.</p>
        <ul className={styles.lis}>
          <li>Publique e aceite tarefas</li>
          <li>Ganhe recompensas</li>
          <li>Melhore a sua classificação</li>
        </ul>
        <p>Junte-se ao DoaTask e transforme boas ações em benefícios!</p>
          <div className={styles.buttons}>
            <a href={ROUTES.HOME}>Sobre</a>
          </div>
      </section>

      {/* Frase Section */}
      <section className={styles.letter}>
        <h2> O melhor do Voluntariado...</h2>
      </section>

      {/* Logo Section */}
      <section className={styles.image}>
        <img src="/assets/logo.png" alt="DOATASK logo"/>
      </section>

      <div className={styles.space}></div>

      {/* Features Section */}
      <section className={styles.container}>
        <div>
          <MdOutlineVolunteerActivism size={250}/>
          <h3>Voluntariado</h3>
          <p>Ajuda quem mais precisa e sente-te bem com isso!</p>
        </div>
        <div>
          <FiBookOpen size={250}/>
          <h3>Passatempo</h3>
          <p>Faz isso! Um passatempo com valor!</p>
        </div>
        <div>
          <RiHandCoinLine size={250}/>
          <h3>Recompensas</h3>
          <p>Além de ajudar, recebes por isso!</p>
        </div>
      </section>

      <div className={styles.space}></div>

      {/* Advantages */}
      <section className={styles.container2}>
        <div className={styles.textContent}>
          <h2>Vantagens</h2>
          <div className={styles.advantage}>
            <h4>Bom samaritano</h4>
            <p>Sê uma boa pessoa, um bom samaritano!</p>
          </div>
          <div className={styles.advantage}>
            <h4>Ganho de Altruísmo</h4>
            <p>Preocupa-te mais com os outros!</p>
          </div>
        </div>

        <div className={styles.imageContainer}>
          <IoPersonOutline size={250} /> 
        </div>
      </section>

      <div className={styles.space}></div>

      {/* Escolha */}
      <section className={styles.container}>
        <div>
          <BiTask size={250}/>
          <h3>Tarefador</h3>
          <p>Cria tarefas à tua escolha e disponibiliza recompensas!</p>
        </div>
        <div>
          <BiTask size={250}/>
          <h3>Ajudante</h3>
          <p>Participa em quantas tarefas tu quiseres, e recebe recompensas por isso!</p>
        </div>
      </section>

      <p className={styles.container}>O melhor de tudo... podes fazer os 2!!!!</p>
      <div className={styles.space}></div>

      {/* Testimonials */}
      <h2 className={styles.letter}>Experiências...</h2>
      <section className={styles.section}>
        
        
          {/* Citação 1 */}
          <div className={styles.box}>
            <p className={styles.quote}>"Adorei ajudar e receber por isso"</p>
            <p className={styles.author}>João</p>
            <p className={styles.details}>DoAtask User</p>
          </div>

          {/* Citação 2 */}
          <div className={styles.box}>
            <p className={styles.quote}>"Já comprei um telemóvel com as recompensas!!"</p>
            <p className={styles.author}>Luísa</p>
            <p className={styles.details}>3 anos de Conta!</p>
          </div>

          {/* Citação 3 */}
          <div className={styles.box}>
            <p className={styles.quote}>"Ajudar é uma sensação incrível"</p>
            <p className={styles.author}>Ricardo</p>
            <p className={styles.details}>DoAtask User</p>
          </div>
     
      </section>

      <div className={styles.space}></div>

      {/* Call to Action */}
      <section className={styles.fundo}>
        <div className={styles.content}>
          <h2>Participa!</h2>
            <div className={styles.buttons}>
              <a href={ROUTES.HOME}>Realiza uma tarefa</a>
              <a href={ROUTES.HOME}>Cria uma tarefa!</a>
            </div>
          </div>
      </section>
      </main>

      <Footer/>
    </div>
  );
}