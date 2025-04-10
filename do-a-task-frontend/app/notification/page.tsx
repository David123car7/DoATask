'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { GetUser } from '@/lib/api/user/get-user';
import { URLS } from '@/lib/constants/links';

export default function NotificationClient() {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const connectSocket = async () => {
      const user = await GetUser();
      if (!user.access_token){
        console.error("wdad")
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
        console.log('Notification received:', data);
        setNotifications((prev) => [...prev, data.message]);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      return () => {
        socket.disconnect();
      };
    };

    connectSocket();
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}