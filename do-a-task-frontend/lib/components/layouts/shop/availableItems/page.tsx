'use client'
import React from "react";
import styles from './page.module.css'
import { useState } from "react";
import { GetNameCommunitySchemaArray } from "@/lib/schemas/community/get-communityName-schema";
import { getItemSchemaArray } from "@/lib/schemas/store/get-shop-items.schema";
import { GetCommunityItems } from "@/lib/api/store/get-community-items";
import { BuyItemButton } from "../buttons/buy-item";

export function AvaiableItems({community }: {community: GetNameCommunitySchemaArray | null }){
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [items, setItems] = useState<any[]>([]);

    const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const communityName = e.target.value;
        setSelectedCommunity(communityName);
        console.log(communityName);
    try {
        const result = await GetCommunityItems(communityName)
        const validateItems = getItemSchemaArray.parse(result);
        setItems(validateItems);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
    }
    }

    return(
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
    );
}