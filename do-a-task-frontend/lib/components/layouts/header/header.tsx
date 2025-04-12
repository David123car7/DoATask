'use client'

import { CiCircleInfo } from "react-icons/ci";
import { FaCoins } from "react-icons/fa6";
import styles from "./page.module.css";
import { UserDataSchema } from "@/app/user/schema/user-data-schema";
import { Menu } from "../lateralMenu/page";
import { FaHome } from "@/lib/icons";
import {ROUTES} from "@/lib/constants/routes"

export function Header({userData }: {userData: UserDataSchema | null }) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.logo_title}>DOATASK</h1>
      </div>
      <nav className={styles.nav}>
        <ul>
        <li><a href={ROUTES.HOME}><FaHome size={28}></FaHome></a></li>
        {userData && (
          <>
            <li><FaCoins size={28} /></li>
            <li><p>{userData.user.totalCoins}</p></li>
          </>
        )}
          <>
            <li><Menu userData={userData}/></li>
          </>
        </ul>
      </nav>
    </header>
  );
};