'use client'

import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { CiUser } from "react-icons/ci";
import { FaRegUserCircle,FaTasks } from "react-icons/fa";
import { MdOutlineSupport } from "react-icons/md";
import { UserDataSchema } from "@/app/user/schema/user-data-schema";
import { useRouter } from 'next/navigation';
import { ROUTES } from "@/lib/constants/routes";

export function Menu({userData }: {userData: UserDataSchema | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleMenu = () => setIsOpen(!isOpen);
  const router = useRouter(); 
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  return (
    <div className={styles.menuContainer} ref={menuRef}>
      <button className={styles.logoButton} onClick={toggleMenu}>
        <CiUser size={28} />
      </button>
  
      {isOpen && (
        <nav className={styles.navbar}>
          {/* Header content */}
          <div className={styles.loginBox}>
            <div className={styles.loginTitle}>
              {userData ? (
                <>Olá {userData?.user.name}</>
              ) : (
                <>Junta-te a nós</>
              )}
            </div>
            {!userData && (
              <div className={styles.navbarButtons}>
                <div className={styles.buttonLogin}>
                  <a href={ROUTES.SIGNIN}>Iniciar sessão</a>
                </div>
                <div className={styles.buttonRegister}>
                  <a href={ROUTES.SIGNUP}>Registar</a>
                </div>
              </div>
            )}
          </div>
          {/* Navigation options */}
          <ul className={styles.options}>
            <li>
              <FaRegUserCircle /> <a href={ROUTES.USER_MAIN}>Dados Pessoais</a>
            </li>
            <li>
              <FaTasks /> As Minhas Tarefas
            </li>
            <li>
              <MdOutlineSupport /> Centro de Apoio
            </li>
          </ul>
          {userData ? (
          <div className={styles.logoutBox}>
              <button className={styles.logoutButton}>Terminar Sessão</button>
          </div>
          ) : null}
        </nav>
      )}
    </div>
  )
}