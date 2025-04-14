'use client'

import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { IoIosNotificationsOutline } from "react-icons/io";
import { UserDataSchema } from "@/app/user/schema/user-data-schema";
import { NotificationDataSchema } from "@/lib/components/layouts/notifications/notification-data-schema";
import { useRouter } from 'next/navigation';
import { IoCheckmark } from "react-icons/io5";
import { ROUTES } from "@/lib/constants/routes";
import { setNotifications } from "@/lib/api/notifications/set.notification";

export function Notifications({userData,  }: {userData: NotificationDataSchema  | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const notifiMenu = useRef<HTMLDivElement>(null);
  const unreadNotifications = userData ? userData.notifications.filter((notif) => !notif.read) : [];//filtra a notificaçoes nao lidas
  const toggleMenu = () => setIsOpen(!isOpen);
  const router = useRouter(); // Initialize router from next/navigation
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifiMenu.current && !notifiMenu.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.menuContainer} ref={notifiMenu}>
      <button className={styles.notiButton} onClick={toggleMenu}>
      <IoIosNotificationsOutline size={28} />
      </button>

      {isOpen &&(
        <nav className={styles.navbar}>
          <div className={styles.title}>
            Notificações
            <button onClick={async() => {await setNotifications();}}><IoCheckmark size={26}/></button>
          </div>
          <ul className={styles.options}>
          {unreadNotifications.length > 0 ? (
              unreadNotifications.map((notif, index) => (
                <li key={index} className={styles.notificationItem}>
                  <div className={styles.notification}>
                    <span>{notif.title}</span>
                    <p>{notif.message}</p>
                  </div>
                </li>
              ))
          ) : (
            <p className={styles.withoutNoti}>Sem novas notificações.</p>
          )}
          </ul>
          <div className={styles.allNotifi}>
            <a href={ROUTES.NOTIFICATION_LIST}>Ver Todas</a>
          </div>
        </nav>
      )}

    </div>
  )
}