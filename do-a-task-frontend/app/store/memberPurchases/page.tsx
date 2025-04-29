'use server'

import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import styles from "./page.module.css"
import { ExitCommunityButton } from "@/lib/components/layouts/community/exit.community.button";
import { GetMemberPurchases } from "@/lib/api/store/get-member-purchases";
import { getMemberPurchasesSchema } from "@/lib/schemas/store/get-member-purchases-schema";
import ShopNavBar from "@/lib/components/layouts/shop/navbar/mainPage/nav.bar";
import { GetUserStores } from "@/lib/api/store/get-userStores";
export default async function MemberPurchasesPage(){

    const purchasess = await GetMemberPurchases();
    const purchasesValidated = getMemberPurchasesSchema.parse(purchasess)
    const UserStore = await GetUserStores();

    return(
        <div className="page">
            <HeaderWrapper/>
            <ShopNavBar UserStore={!!UserStore}/>
            <p className={styles.title}>Historico de compras</p>
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.table}>

                        <div className={styles.titles}>
                            <p className={styles.values}>Item</p>
                            <p className={styles.values}>Preço</p>
                            <p className={styles.values}>Data</p>
                            <p className={styles.values}>Comunidade</p>
                        </div>  
            
                        {purchasesValidated.purchases.length > 0 && (
                            purchasesValidated.purchases.map((purchase, index) => {
                                const community = purchasesValidated.communities[index];
                                return (
                                    <div className={styles.row} key={index}>
                                        <p className={styles.values}>{purchase.Item.name}</p>
                                        <p className={styles.values}>{purchase.Item.price}</p>
                                        <p className={styles.values}>{purchase.date ? purchase.date.toLocaleDateString() : 'N/A'}</p>
                                        <p className={styles.values}>{community.communityName}</p>                                
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
    
}