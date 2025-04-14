"use server";

import styles from './page.module.css';
import Image from 'next/image';
import { ROUTES, API_ROUTES } from "../lib/constants/routes";
import { GetUser } from '../lib/utils/supabase/user/get-user';
import Footer from '@/lib/components/layouts/footer/page';
import HeaderWrapper from '@/lib/components/layouts/header/HeaderWrapper';
import{MdOutlineVolunteerActivism} from "@/lib/icons/index";
import { FiBookOpen } from "@/lib/icons/index";
import { RiHandCoinLine } from "@/lib/icons/index";

export default async function Home() {

  return (
    <div className="page">
      <HeaderWrapper/>

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

      {/* Advantages */}
      <section className="px-6 py-10 text-center">
        <h2 className="text-xl font-bold mb-4">Vantagens</h2>
        <p className="mb-2 font-semibold">Bom samaritano</p>
        <p className="mb-4">Sê uma boa pessoa, um bom samaritano!</p>
        <p className="mb-2 font-semibold">Ganho de Altruísmo</p>
        <p>Preocupa-te mais com os outros!</p>
      </section>

      {/* Escolha */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-10 text-center">
        <div>
          <img src="/tarefas-icon.png" alt="Tarefas" className="mx-auto mb-2 w-12" />
          <h3 className="font-bold">Tarefador</h3>
          <p>Cria tarefas à tua escolha e disponibiliza recompensas!</p>
        </div>
        <div>
          <img src="/ajudante-icon.png" alt="Ajudante" className="mx-auto mb-2 w-12" />
          <h3 className="font-bold">Ajudante</h3>
          <p>Participa em quantas tarefas tu quiseres, e recebe recompensas por isso!</p>
        </div>
      </section>

      <p className="text-center italic">O melhor de tudo... podes fazer os 2!!!!</p>

      {/* Testimonials */}
      <section className="px-6 py-10 text-center">
        <h2 className="text-xl font-bold mb-4">Experiências...</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white text-black p-4 rounded shadow">
            <p>"Adorei ajudar e receber por isso"</p>
            <p className="text-sm mt-2 font-bold">- João, DoaTask user</p>
          </div>
          <div className="bg-white text-black p-4 rounded shadow">
            <p>"Já comprei um telemóvel com as recompensas!"</p>
            <p className="text-sm mt-2 font-bold">- Luísa, 2 meses de Curitiba</p>
          </div>
          <div className="bg-white text-black p-4 rounded shadow">
            <p>"Ajudar é uma sensação incrível!"</p>
            <p className="text-sm mt-2 font-bold">- Ricardo, DoaTask user</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white text-black px-6 py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Participa!</h2>
        <div className="space-x-4">
          <button className="bg-black text-white px-4 py-2 rounded">Realiza uma tarefa</button>
          <button className="border border-black px-4 py-2 rounded">Cria uma tarefa!</button>
        </div>
      </section>
      </main>

      
      <Footer/>
    </div>
  );
}