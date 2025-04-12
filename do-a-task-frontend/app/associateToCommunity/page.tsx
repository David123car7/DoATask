'use client'
import { GetUser } from "@/lib/api/user/get-user";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";


export default function ConnectToCommunity(){

    const [showBlur, setShowBlur] = useState(true); // Controle do efeito de blur

    return(
        <div className="page">

            <header>
                <h1 className="logo_title">DoATask</h1>
                <nav>
                    <ul>
                        <li>
                            sobre
                        </li>
                        <li>
                            nao
                        </li>
                        <li>
                            sei
                        </li>
                    </ul>
                </nav>
            </header>

<div className={styles.blur}>

                <div className={styles.container}>
                    <p className={styles.title}>Novas Tarefas</p>
                </div>

                <div className={styles.taskBox}>

                    <div className={styles.infoBox}>
                        <div className={styles.task}>
                            <Image src="/assets/linkdinlogo.png" alt="Logo" fill className={styles.taskImage} />
                        </div>
                        <p className={styles.info}>
                            Tarefa adda ad ad ad ad ad ad a daddadad a add adada ad  dadadadadadadad
                            adadadadadadasd asd ASd ad asd a da dad  a ad ad asda a  adadad asd asda
                            dadaddaddad
                        </p>
                        <button className={styles.button}>Ver Mais</button>
                    </div>
                    <div className={styles.infoBox}>
                        <div className={styles.task}>
                            <Image src="/assets/linkdinlogo.png" alt="Logo" fill className={styles.taskImage} />
                        </div>
                        <p className={styles.info}>
                            Tarefa adda ad ad ad ad ad ad a daddadad a add adada ad  dadadadadadadad
                            adadadadadadasd asd ASd ad asd a da dad  a ad ad asda a  adadad asd asda
                            dadaddaddad
                        </p>
                        <button className={styles.button}>Ver Mais</button>
                    </div>
                    <div className={styles.infoBox}>
                        <div className={styles.task}>
                            <Image src="/assets/linkdinlogo.png" alt="Logo" fill className={styles.taskImage} />
                        </div>
                        <p className={styles.info}>
                            Tarefa adda ad ad ad ad ad ad a daddadad a add adada ad  dadadadadadadad
                            adadadadadadasd asd ASd ad asd a da dad  a ad ad asda a  adadad asd asda
                            dadaddaddad
                        </p>
                        <button className={styles.button}>Ver Mais</button>
                    </div>
                    <div className={styles.infoBox}>
                        <div className={styles.task}>
                            <Image src="/assets/linkdinlogo.png" alt="Logo" fill className={styles.taskImage} />
                        </div>
                        <p className={styles.info}>
                            Tarefa adda ad ad ad ad ad ad a daddadad a add adada ad  dadadadadadadad
                            adadadadadadasd asd ASd ad asd a da dad  a ad ad asda a  adadad asd asda
                            dadaddaddad
                        </p>
                        <button className={styles.button}>Ver Mais</button>
                    </div>
                </div>


                <div className={styles.container}>
                    <p className={styles.title}>Novos Produtos Na Loja</p>
                </div>
                <div className={styles.taskBox}>
                    
                    <div className={styles.infoBox}>
                        <div className={styles.task}>
                            <Image src="/assets/linkdinlogo.png" alt="Logo" fill className={styles.taskImage} />
                        </div>
                        <p className={styles.info}>
                            Tarefa adda ad ad ad ad ad ad a daddadad a add adada ad  dadadadadadadad
                            adadadadadadasd asd ASd ad asd a da dad  a ad ad asda a  adadad asd asda
                            dadaddaddad
                        </p>
                        <button className={styles.button}>Ver Mais</button>
                    </div>
                    <div className={styles.infoBox}>
                        <div className={styles.task}>
                            <Image src="/assets/linkdinlogo.png" alt="Logo" fill className={styles.taskImage} />
                        </div>
                        <p className={styles.info}>
                            Tarefa adda ad ad ad ad ad ad a daddadad a add adada ad  dadadadadadadad
                            adadadadadadasd asd ASd ad asd a da dad  a ad ad asda a  adadad asd asda
                            dadaddaddad
                        </p>
                        <button className={styles.button}>Ver Mais</button>
                    </div>
                    <div className={styles.infoBox}>
                        <div className={styles.task}>
                            <Image src="/assets/linkdinlogo.png" alt="Logo" fill className={styles.taskImage} />
                        </div>
                        <p className={styles.info}>
                            Tarefa adda ad ad ad ad ad ad a daddadad a add adada ad  dadadadadadadad
                            adadadadadadasd asd ASd ad asd a da dad  a ad ad asda a  adadad asd asda
                            dadaddaddad
                        </p>
                        <button className={styles.button}>Ver Mais</button>
                    </div>
                    <div className={styles.infoBox}>
                        <div className={styles.task}>
                            <Image src="/assets/linkdinlogo.png" alt="Logo" fill className={styles.taskImage} />
                        </div>
                        <p className={styles.info}>
                            Tarefa adda ad ad ad ad ad ad a daddadad a add adada ad  dadadadadadadad
                            adadadadadadasd asd ASd ad asd a da dad  a ad ad asda a  adadad asd asda
                            dadaddaddad
                        </p>
                        <button className={styles.button}>Ver Mais</button>
                    </div>
                </div>
                

            </div>
            <footer>

            </footer> 
            {showBlur && (
                <Link href="#"> {/* Substitua com o caminho para a página de associação */}
                    <button className={styles.associateButton}>
                        Associar Morada
                    </button>
                </Link>
            )}

        </div>
    );
}