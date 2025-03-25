"use client"

import React, { useEffect, useState } from "react";
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { GetUserData } from "./utils/userMain.api";
import { z } from "zod";
import { userDataSchema, UserDataSchema } from "../schema/user-data-schema";
import { ROUTES } from "@/constants/links"

export default function UserMainPage() {
    const [data, setData] = useState<UserDataSchema | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await GetUserData();
                console.log(result);
                // Validate and parse the response
                const validatedData = userDataSchema.parse(result);
                setData(validatedData);
                
            } catch (err) {
                if (err instanceof z.ZodError) {
                    setError("Invalid data format from API");
                    console.error("Validation errors:", err.errors);
                } else {
                    setError((err as Error).message || 'Failed to fetch data');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data) return <div>No data available</div>;

    // Format birth date for display
    const formattedBirthDate = data.user.birthDate.split('T')[0];

    return (
        <div className="page">
            <header>
                <h1 className="logo_title">DOATASK</h1>
                <nav>
                    <ul>
                    <li><a href={ROUTES.HOME}>Home</a></li>
                    <li><a href="#">Sobre</a></li>
                    <li><a href="#">Criadores</a></li>
                    </ul>
                </nav>
            </header>

            <main>
                <div className={styles.container_options}>
                    <div>
                        <div className={styles.main_title}>
                            Olá, {data.user.name}
                        </div>
                        <div className={styles.link_fim}>
                            <Link href="#"> Terminar Sessão</Link>
                        </div>
                        <div className={styles.user_options}>
                            <ul className={styles.user_li}>
                                <li><Link href="#">Dados Pessoais</Link></li>
                                <li><Link href="#">Tarefas</Link></li>
                                <li><Link href="#">Centro de Apoio</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Personal Data Forms */}
                    <div className={styles.forms}>
                        <p>Dados Pessoais</p>
                        <div className={styles.formBox}>
                            <form className={styles.form_userData}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Nome</label>
                                    <input 
                                        type="text" 
                                        defaultValue={data.user.name}  
                                    />
                                </div>
                            </form>

                            <form className={styles.form_userData}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Contacto</label>
                                    <input 
                                        type="text" 
                                        defaultValue={data.user.contact.number.toString()} 
                                    />
                                </div>
                            </form>
                        </div>

                        <div className={styles.formBox}>
                            <form className={styles.form_userData}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Email</label>
                                    <input 
                                        type="text" 
                                        defaultValue={data.user.email} 
                                    />
                                </div>
                            </form>
                            
                            <form className={styles.form_userData}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Data Nascimento</label>
                                    <input 
                                        type="date" 
                                        defaultValue={formattedBirthDate}                                         
                                    />
                                </div>
                            </form>
                        </div>
                        <button type="submit" className={styles.submitButton}>Guardar</button>
                    </div>

                    {/* Password Change Forms */}
                    <div className={styles.forms}>
                        <p>Alterar Password</p>
                        <div className={styles.formBox}>
                            <form className={styles.form_userData}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Nova Password</label>
                                    <input type="password" />
                                </div>
                            </form>
                            <form className={styles.form_userData}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Confirmar Password</label>
                                    <input type="password" />
                                </div>
                            </form>
                        </div>
                        <div className={styles.formBox}>
                            <form className={styles.form_userData}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Password Atual</label>
                                    <input type="password" />
                                </div>
                            </form>
                        </div>
                        <button type="submit" className={styles.submitButton}>Guardar</button>
                    </div>
                </div>
            </main>

            {/* Footer remains the same */}
            <footer>
                <div>
                    <p>DOATASK</p>
                    <div className='footerlogo'>
                        <nav className='footerNav'>
                            <ul>
                                <li>
                                    <Image src="/assets/linkdinlogo.png" alt="Logo" width={30} height={30} />
                                    <Image src="/assets/linkdinlogo.png" alt="Logo" width={30} height={30} />
                                    <Image src="/assets/linkdinlogo.png" alt="Logo" width={30} height={30} />
                                    <Image src="/assets/linkdinlogo.png" alt="Logo" width={30} height={30} />
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    );
}