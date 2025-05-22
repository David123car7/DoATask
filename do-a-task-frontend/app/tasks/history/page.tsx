"use server";

import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import styles from "./page.module.css";
import { GetAllTasksCommunity } from "@/lib/api/tasks/get.all.tasksCommunity";
import { notificationDataSchema } from "./schema/notification-data-schema";

export default async function NotificationList() {
  const resultTasks = await GetAllTasksCommunity();
  const notifications = notificationDataSchema.parse(resultNotifications);

  return (
    <div className="page">
      <HeaderWrapper />
      <h2 className={styles.title}>Histórico</h2>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.table}>
            <div className={styles.titles}>
              <p className={styles.values}>Mensagem</p>
              <p className={styles.values}>Recebida Ás</p>
            </div>

            {notifications.length > 0 &&
              notifications.map((notification, index) => (
                <div className={styles.row} key={index}>
                  <p className={styles.values}>{notification.message}</p>
                  <p className={styles.values}>{notification.createdAt}</p>
                </div>
              ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
