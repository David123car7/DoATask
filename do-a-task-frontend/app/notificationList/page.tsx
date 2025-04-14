'use server'

import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import styles from "./page.module.css"
import { GetNotifications } from "@/lib/api/notifications/get.notifications";
import { notificationDataSchema } from "../user/schema/notification-data-schema";

export default async function NotificationList(){

    const resultNotifications = await GetNotifications();
    const notifications = notificationDataSchema.parse(resultNotifications);


    return(
        <div className="page">
            <HeaderWrapper/>
            <h2 className={styles.title}>As suas Notificações</h2>
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.table}>

                        <div className={styles.titles}>
                            <p className={styles.values}>Mensagem</p>
                            <p className={styles.values}>Titulo</p>
                            <p className={styles.values}>Recebida Ás</p>
                            <p className={styles.values}>Recebida Ás</p>
                            <p className={styles.values}>Enviado Por</p>
                        </div>  
                        
                        {notifications.notifications.length > 0 && (
                            notifications.notifications.map((notification, index) => (
                            <div className={styles.row} key={index}>
                                <p className={styles.values}>{notification.message}</p>
                                <p className={styles.values}>{notification.title}</p>
                                <p className={styles.values}>{notification.createdAt}</p>
                                <p className={styles.values}>{notification.createdAt}</p>
                                <p className={styles.values}>{notification.id}</p>
                            </div>
                            ))

                        )}
                    </div>
                </div>
            </main>

            <Footer/>
        </div>
    );
}