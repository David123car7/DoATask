'use client'
import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { CiUser } from "react-icons/ci";
import { FaRegUserCircle,FaTasks } from "react-icons/fa";
import { MdOutlineSupport } from "react-icons/md";

const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

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
        {/*falta fazer para quando estiver logado*/}
        <div className={styles.loginBox}>
          <div className={styles.loginTitle}>
            Ainda não fazes parte de uma comunidade?
          </div>
          <div className={styles.navbarButtons}>
            <button>
              Iniciar Sessão
            </button>
            <button>
              Registar
            </button>
          </div>
        </div>
          <ul className={styles.options}>
            <li><FaRegUserCircle />Dados Pessoais</li>
            <li><FaTasks />As Minhas Tarefas</li>
            <li><MdOutlineSupport />Centro de Apoio</li>
          </ul>
          <div className={styles.logoutBox}>
            <button className={styles.logoutButton}>Terminar Sessão</button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Menu;