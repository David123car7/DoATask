'use server'

import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import styles from "./page.module.css"
import { EnterCommunityButton } from "@/lib/components/layouts/community/enter.community.button";
import { getUserCommunitySchemaArray } from "@/lib/schemas/community/get-user-community-schema";
import { GetUserCommunities } from "@/lib/api/communities/get.user.communities";
import { ExitCommunityButton } from "@/lib/components/layouts/community/exit.community.button";

export default async function CommunitiesListPage(){
    const communitiesData = await GetUserCommunities();
    const communitiesDataValidated = getUserCommunitySchemaArray.parse(communitiesData)

    return(
        <div className="page">
            <HeaderWrapper/>
            <h2 className={styles.title}>As suas Notificações</h2>
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.table}>

                        <div className={styles.titles}>
                            <p className={styles.values}>Comunidade</p>
                            <p className={styles.values}>Moedas</p>
                        </div>  
                        
                        {communitiesDataValidated.length > 0 && (
                            communitiesDataValidated.map((community, index) => 
                                <div className={styles.row} key={index}>
                                    <p className={styles.values}>{community.community.communityName}</p>
                                    <p className={styles.values}>{community.coins}</p>
                                    <ExitCommunityButton communityName={community.community.communityName}/>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}