'use client'

import { CiCircleInfo } from "react-icons/ci";
import { FaCoins } from "react-icons/fa6";
import Menu from "../lateralMenu/page";

export default function UserNav() {
  return (
    <>
      <li><CiCircleInfo size={28} /></li>
      <li><FaCoins size={28} /></li>
      <li><p>25</p></li>
      <li><Menu /></li>
    </>
  );
}
