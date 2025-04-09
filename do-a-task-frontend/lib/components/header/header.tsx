"use client";

import { useState } from "react";
import { CiCircleInfo, CiUser } from "react-icons/ci";
import { FaCoins } from "react-icons/fa6";
import { ROUTES } from "@/lib/constants/routes";

interface HeaderProps {
    user: any;
  }
  
  const Header: React.FC<HeaderProps> = ({ user }) => {
    return (
      <header className="header">
        <h1 className="logo_title">DOATASK</h1>
        <nav>
          <ul style={{ display: "flex", gap: "1rem", listStyle: "none" }}>
            {!user ? (
              <li>
                <a href={ROUTES.SIGNIN}>Login</a>
              </li>
            ) : (
              <>
                <li><CiCircleInfo size={28} /></li>
                <li><FaCoins size={28} /></li>
                <li><p>25</p></li>
                <li>
                  <a href={ROUTES.USER_MAIN}>
                    <CiUser size={28} />
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
    );
  };
  
  export default Header;