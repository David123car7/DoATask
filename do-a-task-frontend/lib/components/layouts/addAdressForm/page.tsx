'use client'

import { useState, useEffect, useRef } from "react";
import { IoIosAdd } from "react-icons/io";
import { styleText } from "util";
import styles from './page.module.css'
import Styles from '@/app/user/main/page.module.css'
import { GetAllAddresses } from "@/lib/api/address/get-allAddresses";
import { AddressSchema } from "./Schema/address.schema";

export function AddAdress({allAddresses} : {allAddresses: AddressSchema}){

    const [isOpen, setIsOpen] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setIsOpen(!isOpen);


    useEffect(() => {

      const handleClickOutside = (event: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);
  


    return(
        <div className={styles.container}>
        <div className={styles.forms}>
          <p>Moradas:</p>
    
          {allAddresses && allAddresses.length > 0 ? (
            <div className={styles.boxAddress}>
                {allAddresses.map((address, index) => (
                <div key={index}>
                    <p>Rua: {address.address.street}</p>
                    <p>Número: {address.address.port}</p>
                </div>
                ))}
            </div>
            ) : (
            <p>Sem Morada</p>
            )}
    
          {isOpen && (
            <div ref={formRef} className={styles.addressBox}>
              <div className={styles.boxTitle}>
                <p>Adicionar Nova Morada</p>
              </div>
              <form className={styles.form}>
                <input type="text" placeholder="Rua" name="street" />
                <input type="number" placeholder="Número" name="port" />
                <input type="text" placeholder="Localidade" />
                <input type="text" placeholder="Freguesia" />
                <input type="text" placeholder="Código Postal" />
              </form>
              <button className={styles.button}>
                <p>Guardar</p>
              </button>
            </div>
          )}
          <button className={styles.addButton} onClick={toggleMenu}>Adicionar Morada</button>
        </div>
      </div>
    );
}