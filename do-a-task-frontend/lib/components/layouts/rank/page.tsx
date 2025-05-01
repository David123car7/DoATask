'use client'

import { GetRankCommunity } from "@/lib/api/rank/get.rankCommunity";
import { rankArraySchema } from "@/lib/schemas/Rank/get-RankCommuniy";
import { useState } from "react";
import { GetNameCommunitySchemaArray } from "@/lib/schemas/community/get-communityName-schema";
import styles from "./page.module.css"
import { GetPointsMember } from "@/lib/api/rank/get.pointsMember";
import { pointsSchema } from "@/lib/schemas/Rank/get-PointsMember";

export function ShowRank({community} : {community: GetNameCommunitySchemaArray | null }){

    const [rank , setRank] = useState<any[]>([]);
    const [user, setUser] = useState<any[]>([]);
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [pointsMember, setPointsMember] = useState<number>(0);


        const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
            const communityName = e.target.value;
            setSelectedCommunity(communityName);
            console.log(communityName);
        try {
            const result = await GetRankCommunity(communityName)
            const validateRank = rankArraySchema.parse(result.rank);
            const points = await GetPointsMember(communityName);
            const validatedPoints = pointsSchema.parse(points);
            setPointsMember(validatedPoints.points);
            setRank(validateRank);
        } catch (error) {
            console.error('Erro ao buscar Ranks:', error);
        }
        }
        return(
            <div>
                <select onChange={handleSelectChange} className={styles.selectCustom}>
                        <option value=""></option>
                            {(community ??[]).map((c, index) => (
                                <option key={index} value={c.communityName}>
                                {c.communityName}
                                </option>
                            ))}      
                </select>

                <div className={styles.container_main}>
                <div className={styles.title_rank}>
                    <h1>RANKING</h1>
                    <p>Lista dos melhores participantes da comunidade</p>
                </div>
                {/* Add the points display box */}
                <div className={styles.points_display}>
                    <span className={styles.points_label}>Meus pontos:{pointsMember}</span>
                    <span className={styles.points_value}></span>
                </div>
            </div>

            <div className={styles.ranking_container}>
            <table className={styles.ranking_table}>
            <thead>
                <tr>
                <th>Rank</th>
                <th>Membro</th>
                <th>Pontos</th>
                </tr>
            </thead>
            <tbody>
                {rank && rank.length > 0 ? (
                rank.map((r, index) => (
                    <tr key={index} className={styles.SOPARAVER}>
                        <td>{index + 1}</td>
                        <td>{r.member.user.name ?? 'Desconhecido'}</td>
                        <td>{r.points ?? 0}</td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td className={styles.text_black}colSpan={3}>Sem Membros</td>
                </tr>
                )}
            </tbody>
            </table>
            </div>
            </div>
        );
}