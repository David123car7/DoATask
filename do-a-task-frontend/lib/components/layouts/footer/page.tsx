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
    );
};
  