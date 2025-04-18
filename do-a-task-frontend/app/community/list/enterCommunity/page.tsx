'use server'

import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import styles from "./page.module.css"
import { GetAllCommunities } from "@/lib/api/communities/get.all.communities";
import { getCommunitySchemaArray } from "@/lib/schemas/community/get-community-shema";
import { EnterCommunityButton } from "@/lib/components/layouts/community/enter.community.button";
import CommunityNavBar from "@/lib/components/layouts/community/navbar/nav.bar";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";

export default async function CommunitiesListPage(){
    const communitiesData = await GetAllCommunities();
    const communitiesDataValidated = getCommunitySchemaArray.parse(communitiesData)

    return(
        <div className="page">
            <HeaderWrapper/>
            <Toaster/>
            <CommunityNavBar/>
            <h2 className={styles.title}>As suas Notificações</h2>
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.table}>

                        <div className={styles.titles}>
                            <p className={styles.values}>Comunidade</p>
                            <p className={styles.values}>Localidade</p>
                        </div>  
                        
                        {communitiesDataValidated.length > 0 && (
                            communitiesDataValidated.map((community, index) => (
                                <div className={styles.row} key={index}>
                                    <p className={styles.values}>{community.communityName}</p>
                                    <p className={styles.values}>{community.locality.name}</p>
                                    <EnterCommunityButton communityName={community.communityName}/>
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