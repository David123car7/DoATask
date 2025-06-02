'use client'

import styles from "./page.module.css";
import { UserDataSchema } from "@/app/user/schema/user-data-schema";
import { Menu } from "../lateralMenu/page";
import { FaHome } from "@/lib/icons";
import { ROUTES } from "@/lib/constants/routes";
import { Notifications } from "../notifications/notifications";
import {RiUserCommunityFill ,MdOutlineSupport, FaRegUserCircle,FaTasks, CiUser, TiShoppingCart, PiRankingLight} from "@/lib/icons"



export function Header({ userData }: { userData: UserDataSchema | null }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo_container}>
          <img 
            src="/assets/notext.png" 
            alt="DOATASK logo" 
            className={styles.logo_image}
          />
          <h1 className={styles.logo_title}>DOATASK</h1>
        </div>
        
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <a href={ROUTES.HOME}>
                <FaHome size={28} />
              </a>
            </li>
            {userData && (
              <>
                <li>
                  <Notifications />
                </li>
              </>
            )}
            <li>
              <a href={ROUTES.USER_MAIN}><CiUser size={26}/></a><a href={ROUTES.USER_MAIN}></a>
            </li>
            <li>
              <Menu userData={userData} />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}