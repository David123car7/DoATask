import styles from './page.module.css';
import Image from 'next/image';
import { ROUTES } from "../../lib/constants/routes"

export default function HomeAuthenticated() {
    return (
      <div className="page-auth">
      <header>
          <div>
              <h1 className="logo_title">DOATASK</h1>
          </div>
          <nav>
              <ul>
                  <li><a href="#">Sobre</a></li>
                  <li><a href="#">Criadores</a></li>
                  <li><a href="#">Conta</a></li>
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
                  <div className='footerlogo'>
                    <nav className='footerNav'>
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