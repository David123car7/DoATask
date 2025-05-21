'use server'

import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import styles from "./page.module.css"
import { GetAllNotifications } from "@/lib/api/notifications/get.all.notifications";
import { notificationDataSchema,} from "./schema/notification-data-schema";

export default async function NotificationList(){

    const resultNotifications = await GetAllNotifications();
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
                            <p className={styles.values}>Recebida Ás</p>
                            <p className={styles.values}>Lida Ás</p>
                        </div>  
                        
                        {notifications.length > 0 && (
                            notifications.map((notification, index) => (
                                <div className={styles.row} key={index}>
                                    <p className={styles.values}>{notification.message}</p>
                                    <p className={styles.values}>{notification.createdAt}</p>
                                    {notification.read ? (
                                        <p className={styles.values}>{notification.updatedAt}</p>
                                    ) : (
                                        <p className={styles.values}>Não Lida</p>
                                    )}
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