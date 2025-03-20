import React from 'react';
import styles from './page.module.css';


export default function signup() {
    return (
        <>
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
                        <li><a href="#">Login</a></li>
                    </ul>
                </nav>
            </header>
            
            <main>

                {/*<div className={styles.information}>
                        <h2 className={styles.title}>Registo</h2>
                </div>*/}

                <div className={styles.container}>

                    <form className={styles.form}>

                        <div className={styles.inputGroup}>
                            <label htmlFor="fullName" className={styles.label}>Nome Completo </label>
                            <input type="text" id="fullName" className={styles.input} placeholder="Digite o seu nome completo" required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="contact" className={styles.label}>Contacto</label>
                            <input type="text" id="contact" className={styles.input} placeholder="Digite o seu contacto"/>{/*Tornar Opcional */}
                        </div> 
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input type="text" id="email" className={styles.input} placeholder="Digite o seu email" required/>
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <input type="password" id="password" className={styles.input} placeholder="Password" required minLength={8}/>
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="localidade" className={styles.label}>Localidade</label>
                            <input type="text" id="localidade" className={styles.input} placeholder="Digite a sua localidade" required/>
                        </div>
                            <button type="submit" className={styles.submitButton}>Submeter</button>
                    </form>
                </div>
                
            </main>

                <footer>
                    <div>
                        <p>DOATASK</p>
                    </div>

                </footer>
                </div>
        </>
    );
}