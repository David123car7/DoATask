'use client'

import { useState, useEffect, useRef } from "react";
import { IoIosAdd } from "react-icons/io";
import { styleText } from "util";
import styles from './page.module.css'
import Styles from '@/app/user/main/page.module.css'
import { GetAllAddresses } from "@/lib/api/address/get-allAddresses";
import { AddressSchema, addressSchemaData } from "../../../../schemas/address/address.schema";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateAddress } from "@/lib/api/address/create-addressUser";
import { createAddressSchema, CreateAddressSchema } from "@/lib/schemas/address/createAddress.schema";
import { toast } from "react-toastify";
import { Toaster } from "../../toaster/toaster";

export function AddAdress({allAddresses} : {allAddresses: AddressSchema}){

    const [isOpen, setIsOpen] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    const { register, handleSubmit, formState: { errors }} = useForm<CreateAddressSchema>({resolver: zodResolver(createAddressSchema)});

    const toggleMenu = () => setIsOpen(!isOpen);

    const onSubmit = async (data: CreateAddressSchema) => {
      try {
        const responseData = await CreateAddress(data);
        toast.success(responseData.message)
      } catch (error: any) {
        toast.error(error.message)
      }
    };
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
        <Toaster/>
        <div className={styles.forms}>
          <p>Moradas:</p>
    
          {allAddresses && allAddresses.length > 0 ? (
            <div className={styles.boxAddress}>
                {allAddresses.map((address, index) => (
                <div key={index}>
                    <p>Rua: {address.street}</p>
                    <p>Número: {address.port}</p>
                    <p>Código Postal: {address.postalCode}</p>
                </div>
                ))}
            </div>
            ) : (
            <p>Sem Morada</p>
            )}
    
          {isOpen && (
            <>
            
            <div className={styles.overlay}></div>
            <div ref={formRef} className={styles.addressBox}>
              
              <div className={styles.boxTitle}>
                Adicionar Nova Morada
              </div>
              <form  onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <input type="text" {...register('locality')} placeholder="Localidade"/>
                {errors.locality && <p>{errors.locality.message}</p> }
                <input type="text" {...register('street')} placeholder="Rua"/>
                {errors.street && <p>{errors.street.message}</p> }
                <input type="number" {...register('port', {valueAsNumber: true})} placeholder="Porta"/>
                {errors.port && <p>{errors.port.message}</p> }
                <input type="text" {...register('postalCode')} placeholder="Código Postal (1234-567)" />
                {errors.postalCode && <p className={styles.error_message}>{errors.postalCode.message}</p> }
                <button type ="submit" className={styles.button}>Guardar</button>
              </form>

            </div>
            </>
          )}
          <button className={styles.addButton} onClick={toggleMenu}>Adicionar Morada</button>
        </div>
      </div>
    );
}