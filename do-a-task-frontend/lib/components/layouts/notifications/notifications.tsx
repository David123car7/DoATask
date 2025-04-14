'use client'

import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { IoIosNotificationsOutline } from "react-icons/io";
import { UserDataSchema, userDataSchema} from "@/app/user/schema/user-data-schema";
import { NotificationDataSchema } from "@/app/notificationList/schema/notification-data-schema";
import { useRouter } from 'next/navigation';
import { IoCheckmark } from "react-icons/io5";
import { ROUTES } from "@/lib/constants/routes";
import { io } from 'socket.io-client';
import { GetUser } from '@/lib/utils/supabase/user/get-user';
import { URLS } from '@/lib/constants/links';
import { GetNotifications } from '@/lib/api/notifications/get.notifications';
import { setNotifications } from '@/lib/api/notifications/set.notification';

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const notifiMenu = useRef<HTMLDivElement>(null);
  const toggleMenu = () => setIsOpen(!isOpen);
  const [notifications, setNotificationsMsg] = useState<string[]>([]);


  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await GetNotifications();
        console.log('Loaded notifications:', data);
        if (data && data.notifications) {
          const messages = data.notifications.map((notif: any) => notif.message);
          setNotificationsMsg(messages);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    // Function to connect the socket for real-time updates
    const connectSocket = async () => {
      const user = await GetUser();
      if (!user) {
        console.error("Access token not found");
        return;
      }

      const socket = io(URLS.NESTJS, {
        auth: {
          token: user.access_token,
        },
        withCredentials: true,
      });

      socket.on('connect', () => {
        console.log('Connected to socket server');
      });

      socket.on('notification', (data) => {
        console.log('Real-time notification received:', data);
        if (data?.message) {
          setNotificationsMsg((prev) => [...prev, data.message]);
        }
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      return () => {
        socket.disconnect();
      };
    };

    loadNotifications();
    const cleanupSocket = connectSocket();
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

  const handleButtonClick = async () => {
    try {
      const responseData = await setNotifications();
      console.log('Notifications marked as read:', responseData);
      // Optionally, clear the notifications list after marking as read
      setNotificationsMsg([]);
    } catch (error: any) {
      console.error('Error updating notifications:', error);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const responseData = await setNotifications();
      setNotificationsMsg([]);
    } catch (error: any) {
      console.error('Error updating notifications:', error);
    }
  };
  return (
    <div className={styles.menuContainer} ref={notifiMenu}>
      <button className={styles.notiButton} onClick={toggleMenu}>
      <IoIosNotificationsOutline size={28} />
      </button>

      {isOpen &&(
        <nav className={styles.navbar}>
          <div className={styles.title}>
            Notificações
            <button onClick={handleButtonClick}><IoCheckmark size={26}/></button>
          </div>
          <ul className={styles.options}>
          {notifications.length > 0 ? (
              notifications.map((msg, index) => (
                <li key={index} className={styles.notificationItem}>
                  <div className={styles.notification}>
                    <p>{msg}</p>
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