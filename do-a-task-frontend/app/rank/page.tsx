import React from "react";
import styles from './page.module.css';
import Image from 'next/image';
import Header from "@/lib/components/layouts/header/HeaderWrapper";
import Footer from "@/lib/components/layouts/footer/page";

// Mock data - replace with actual data fetching
const players = [
  { id: 1, name: "Jorge", points: 12450,  avatar: "/assets/userIcon.png" },
  { id: 2, name: "Paulo", points: 11890,  avatar: "/assets/userIcon.png" },
  { id: 3, name: "Skillz99", points: 10765,  avatar: "/assets/userIcon.png" },
  { id: 4, name: "Cristina", points: 9430,  avatar: "/assets/userIcon.png" },
  { id: 5, name: "Frederica", points: 8920,  avatar: "/assets/userIcon.png" },
  // Add more players as needed
];


async function getUserPoints() {
  
  return 500; 
}

export default async function rank(){
    const userPoints = await getUserPoints();
    
    return (
      <div className="page">
       <Header/> 
        <main> 
            <div className={styles.container_main}>
                <div className={styles.title_rank}>
                    <h1>RANKING</h1>
                    <p>Lista dos melhores participantes da comunidade</p>
                </div>
                {/* Add the points display box */}
                <div className={styles.points_display}>
                    <span className={styles.points_label}>Meus pontos:</span>
                    <span className={styles.points_value}>{userPoints.toLocaleString()}</span>
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
                        {players.map((player, index) => (
                            <tr key={player.id} className={index < 3 ? styles.top_player : ''}>
                                <td>
                                    {index + 1}
                                   
                                </td>
                                <td className={styles.player_cell}>
                                    <Image 
                                        src={player.avatar} 
                                        alt={/*`${player.name}'s avatar`*/ ''} 
                                        width={40} 
                                        height={40} 
                                        className={styles.avatar}
                                    />
                                    {player.name}
                                </td>
                                <td className={styles.points}>{player.points.toLocaleString()}
                                </td>
                                 
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <p className={styles.update_notice}>
                    Rankings updated: {new Date().toLocaleDateString()}
                </p>
            </div>
        </main>
        <Footer/>
      </div>
    );
}