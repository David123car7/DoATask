"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import style from "./page.module.css";

type TaskButtonProps = {
  title: string;
  route: string;
};

export function TaskButton({ title, route }: TaskButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <button className={style.taskbutton} onClick={handleClick}>
      <div className={style.title}>{title}</div>
    </button>
  );
}
