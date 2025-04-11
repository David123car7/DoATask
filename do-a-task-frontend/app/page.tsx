"use server";

import styles from './page.module.css';
import Image from 'next/image';
import { ROUTES, API_ROUTES } from "../lib/constants/routes";
import { GetUser } from '../lib/utils/supabase/user/get-user';
import { CiUser, CiCircleInfo, BiBell, FaCoins} from "../lib/icons";

export default async function Home() {
  const data = await GetUser();
  
  return (
    <div className="page-auth">
      <header>
        <div>
          <h1 className="logo_title">DOATASK</h1>
        </div>
        <nav>
          <ul>
            {!data ? (
              <li>
                <a href={ROUTES.SIGNIN}>
                  <div className={styles.loginBox}>Login</div>
                </a>
              </li>
            ) : (
              <>
                <li>
                  <CiCircleInfo size={28}></CiCircleInfo>
                </li>
                <li>
                  <FaCoins size={28}/>
                </li>
                <li>
                  <p>25</p>
                </li>
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

      <main>
        <div className={styles.titleBox}>
          <div className={styles.mainTitle}>Main Page</div>
        </div>
      </main>

      <footer>
        <div>
          <p>DOATASK</p>
          <div className="footerlogo">
            <nav className="footerNav">
              <ul>
                <li>
                  <Image src="/assets/linkdinlogo.png" alt="Logo" width={30} height={30} />
                  <Image src="/assets/linkdinlogo.png" alt="Logo" width={30} height={30} />
                  <Image src="/assets/linkdinlogo.png" alt="Logo" width={30} height={30} />
                  <Image src="/assets/linkdinlogo.png" alt="Logo" width={30} height={30} />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}