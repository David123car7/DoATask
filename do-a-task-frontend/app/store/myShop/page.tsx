'use server'

import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import styles from "./page.module.css"
import { ExitCommunityButton } from "@/lib/components/layouts/community/exit.community.button";
import { GetMemberShopItems } from "@/lib/api/store/get-member-shop-items";
import { getItemSchemaArray } from "@/lib/schemas/store/get-shop-items.schema";
import MyShopNavBar from "@/lib/components/layouts/shop/navbar/myShopPage/nav.bar";
import { HideItemButton } from "@/lib/components/layouts/shop/buttons/hide.item.button";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { ShowItemButton } from "@/lib/components/layouts/shop/buttons/show.item.button";

export default async function MemberShopPage(){

    const items = await GetMemberShopItems();
    const itemsValidated = getItemSchemaArray.parse(items)

    return(
        <div className="page">
            <HeaderWrapper/>
            <Toaster/>
            <MyShopNavBar/>
            <h2 className={styles.title}>Minha Loja</h2>
            <main className={styles.main}>
                <div className={styles.container}>
                        <div className={styles.itemsGrid}>
                            {itemsValidated.length > 0 ?(
                                itemsValidated.map((item, index) =>(
                                    <div key={index} className={styles.item}>
                                        <div className={styles.imageItem}>
                                            <img src={item.imageUrl.signedUrl} alt={item.name} className={styles.imageItem}/>
                                        </div>
                                        <div className={styles.title}>{item.name}</div>
                                            <p className={styles.description}><strong>Preço: </strong>{item.price}</p>
                                            <p className={styles.description}><strong>Disponivel: </strong>{item.available}</p>
                                        <div className={styles.buttonContainer}>
                                            {item.available ? (
                                                <HideItemButton itemId={item.id}/>
                                            ) :
                                            (
                                                <ShowItemButton itemId={item.id}/>
                                            )
                                            }
                                            
                                        </div>
                                    </div>
                                ))
                            ):(
                                <h1>A sua loja nao possui itens á venda</h1>
                            )}         
                        </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}