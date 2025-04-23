'use client'
import React from "react";
import styles from './page.module.css'
import { useState } from "react";
import { GetNameCommunitySchemaArray } from "@/lib/schemas/community/get-communityName-schema";
import { getItemSchemaArray } from "@/lib/schemas/store/get-shop-items.schema";
import { GetCommunityItems } from "@/lib/api/store/get-community-items";
import { BuyItemButton } from "../buttons/buy-item";
import { GetMemberCoins } from "@/lib/api/member/get.member.coins";
import { memberCoinsSchema, MemberCoinsSchema} from "@/lib/schemas/member/get.member.coins.schema";
import { UserDataSchema } from "@/app/user/schema/user-data-schema";
import { HeaderShop } from "../../header/headerShop";
import ShopNavBar from "../navbar/mainPage/nav.bar";
import { Toaster } from "../../toaster/toaster";

export function AvaiableItems({community, userData}: {community: GetNameCommunitySchemaArray | null, userData: UserDataSchema | null}){
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [selectMemberCoins, setMemberCoins] = useState<MemberCoinsSchema>({ memberCoins: { coins: 0 } });
    const [items, setItems] = useState<any[]>([]);

    const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const communityName = e.target.value;
        const memberCoins = await GetMemberCoins(communityName)
        const memberCoinsValidated = memberCoinsSchema.parse(memberCoins)
        setMemberCoins(memberCoinsValidated)
        setSelectedCommunity(communityName)
    try {
        const result = await GetCommunityItems(communityName)
        const validateItems = getItemSchemaArray.parse(result);
        setItems(validateItems);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
    }
    }

    return(
        <>
            <HeaderShop userData={userData} memberCoins={selectMemberCoins}></HeaderShop>
            <Toaster/>
            <ShopNavBar/>
            <div className={styles.container}>
                <select onChange={handleSelectChange}
                    className={styles.selectCustom}>
                    <option value=""></option>
                    {(community ??[]).map((c, index) => (
                        <option key={index} value={c.communityName}>
                            {c.communityName}
                        </option>
                    ))}      
                </select>
                <div className={styles.itemsGrid}>
                    {items.length > 0 ?(
                        items.map((item, index) =>(
                            <div key={index} className={styles.task}>
                                <div className={styles.imageTask}>
                                    <img src={item.imageUrl.signedUrl} alt={item.name} className={styles.imageTask}/>
                                </div>
                                <div className={styles.title}>{item.name}</div>
                                    <p className={styles.description}><strong>Preço: </strong>{item.price}</p>
                                <div className={styles.buttonContainer}>
                                <BuyItemButton itemId={item.id} communityName={selectedCommunity}></BuyItemButton>
                                </div>
                            </div>
                        ))
                    ):(
                        <h1>A loja nao possui itens á venda</h1>
                    )}         
                </div>
            </div>
        </>
    );
}