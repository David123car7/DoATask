'use client'

import { CiCircleInfo } from "react-icons/ci";
import { FaCoins } from "react-icons/fa6";
import styles from "./page.module.css";
import { UserDataSchema } from "@/app/user/schema/user-data-schema";
import { Menu } from "../lateralMenu/page";
import { FaHome } from "@/lib/icons";
import { ROUTES } from "@/lib/constants/routes";
import { Notifications } from "../notifications/notifications";
import { NotificationDataSchema } from "@/app/notificationList/schema/notification-data-schema";
import {RiUserCommunityFill, MdOutlineSupport, FaRegUserCircle,FaTasks, CiUser, TiShoppingCart, PiRankingLight} from "@/lib/icons"


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
            {!userData ? (
              <li>
              <a href={ROUTES.SIGNIN}><FaRegUserCircle size={26}/></a>
              </li>
            ) :(
              <li>
                <a href={ROUTES.USER_MAIN}><FaRegUserCircle size={26}/></a>
              </li>
            )}
            <li>
              <Menu userData={userData} />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}