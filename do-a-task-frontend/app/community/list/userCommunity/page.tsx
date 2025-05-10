'use server'

import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import styles from "./page.module.css"
import { EnterCommunityButton } from "@/lib/components/layouts/community/enter.community.button";
import { getCommunitiesWithMembersCountSchema } from "@/lib/schemas/community/get-user-community-schema";
import { GetUserCommunities } from "@/lib/api/communities/get.user.communities";
import { ExitCommunityButton } from "@/lib/components/layouts/community/exit.community.button";
import CommunityNavBar from "@/lib/components/layouts/community/navbar/nav.bar";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
export default async function CommunitiesListPage(){
    const communitiesData = await GetUserCommunities();
    const communitiesDataValidated = getCommunitiesWithMembersCountSchema.parse(communitiesData)

    return(
        <div className="page">
            <HeaderWrapper/>
            <Toaster/>
            <CommunityNavBar/>
            <h2 className={styles.title}>As suas Comunidades</h2>
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.table}>

                       <div className={styles.titles}>
  <p 
    className={styles.values} 
    data-tooltip="Nome identificador da comunidade"
  >
    Comunidade
  </p>
  <p 
    className={styles.values} 
    data-tooltip="Cidade/região onde a comunidade atua"
  >
    Localidade
  </p>
  <p 
    className={styles.values} 
    data-tooltip="Moedas internas para recompensas"
  >
    Moedas
  </p>
  <p 
    className={styles.values} 
    data-tooltip="Pontos acumulados por atividades"
  >
    Pontos
  </p>
  <p 
    className={styles.values} 
    data-tooltip="Número total de membros"
  >
    Membros
  </p>
</div> 
                        
                        {communitiesDataValidated.communities.length > 0 && (
                            communitiesDataValidated.communities.map((community, index) => {
                                const membersCount = communitiesDataValidated.membersCount[index]
                                const points = communitiesDataValidated.communities[index].PointsMember[index].points
                                return (
                                <div className={styles.row} key={index}>
                                    <p className={styles.values}>{community.Community.communityName}</p>
                                    <p className={styles.values}>{community.Community.Locality.name}</p>
                                    <p className={styles.values}>{community.coins}</p>
                                    <p className={styles.values}>{points}</p>
                                    <p className={styles.values}>{membersCount}</p>
                                    <div className={'${styles.values} ${styles.buttonBox}'}>
                                        <ExitCommunityButton communityName={community.Community.communityName}/>
                                    </div>
                                </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}