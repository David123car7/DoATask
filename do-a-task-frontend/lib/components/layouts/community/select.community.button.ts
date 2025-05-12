"use server"

import styles from "@/app/tasks/create/page.module.css"

export function BuyItemButton(){

    return(
        <div className={styles.inputGroup}>
        <label className={styles.label}>Comunidade</label>
        <select {...register("communityName")} className={styles.input}>
          {communityData.map((community, index) => (
            <option key={index} value={community.communityName}>
              {community.communityName}
            </option>
          ))}
        </select>
      </div>
    )
}
