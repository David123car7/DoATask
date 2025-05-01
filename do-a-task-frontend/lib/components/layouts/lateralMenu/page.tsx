'use client'

import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { UserDataSchema } from "@/app/user/schema/user-data-schema";
import { useRouter } from 'next/navigation';
import { ROUTES, API_ROUTES} from "@/lib/constants/routes";
import {RiUserCommunityFill, MdOutlineSupport, FaRegUserCircle,FaTasks, CiUser, TiShoppingCart} from "@/lib/icons"

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
          {userData && (
            <ul className={styles.options}>
            <li>
             <a href={ROUTES.USER_MAIN}><FaRegUserCircle size={26}/></a>  <a href={ROUTES.USER_MAIN}>Dados Pessoais</a>
            </li>
            <li>
              <a href={ROUTES.TASKS_USER_CREATED_LIST}><FaTasks size={26}/></a><a href={ROUTES.TASKS_USER_CREATED_LIST}>Tarefas</a>
            </li>
            <li>
              <a href={ROUTES.USER_COMMUNITY}><RiUserCommunityFill size={26}/></a> <a href={ROUTES.USER_COMMUNITY}>Comunidades</a>
            </li>
            <li>
              <a href={ROUTES.SHOPS}><TiShoppingCart size={26}/></a> <a href={ROUTES.SHOPS}>Loja</a>
            </li>
          </ul>
          )}
          {userData ? (
          <div className={styles.logoutBox}>
            <a href={API_ROUTES.SIGNOUT}>Terminar Sessao</a>
          </div>
          ) : null}
        </nav>
      )}
    </div>
  )
}