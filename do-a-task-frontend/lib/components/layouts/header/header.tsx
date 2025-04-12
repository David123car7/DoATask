'use client'

import { CiCircleInfo } from "react-icons/ci";
import { FaCoins } from "react-icons/fa6";
import Menu from "../lateralMenu/page";
import styles from "./page.module.css";
import { ROUTES } from "@/lib/constants/routes";
import { UserDataSchema } from "@/app/user/schema/user-data-schema";

export function Header({ userData }: { userData: UserDataSchema | null }) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.logo_title}>DOATASK</h1>
      </div>
      <nav className={styles.nav}>
        <ul>
          {!userData ? (
            <li>
              <a href={ROUTES.SIGNIN}>
                <div className={styles.loginBox}>Login</div>
              </a>
            </li>
          ) : (
            <>
              <li><CiCircleInfo size={28} /></li>
              <li><FaCoins size={28} /></li>
              <li><p>{userData.user.totalCoins}</p></li>
              <li><Menu /></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};