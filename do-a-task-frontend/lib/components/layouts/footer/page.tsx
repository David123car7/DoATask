import React from "react";
import Image from "next/image";
import styles from "./page.module.css"

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div>
            <p>DOATASK</p>
            <div className={styles.footerlogo}>
                <nav className={styles.footerNav}>
                </nav>
            </div>
            </div>
        </footer>
    );
};
  