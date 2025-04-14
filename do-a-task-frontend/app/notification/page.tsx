'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { GetUser } from '@/lib/utils/supabase/user/get-user';
import { URLS } from '@/lib/constants/links';
import { GetNotifications } from '@/lib/api/notifications/get.notifications';
import { setNotifications } from '@/lib/api/notifications/set.notification';

export default function NotificationClient() {
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
  }, []);

  // Basic onSubmit handler that calls setNotifications (marks them as read)
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const responseData = await setNotifications();
      console.log('Notifications marked as read:', responseData);
      // Optionally, clear the notifications list after marking as read
      setNotificationsMsg([]);
    } catch (error: any) {
      console.error('Error updating notifications:', error);
    }
  };

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={onSubmit}>
        <button type="submit">Mark Notifications as Read</button>
      </form>
    </div>
  );
}
