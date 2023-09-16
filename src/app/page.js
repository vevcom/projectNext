import Image from 'next/image'
import styles from './page.module.scss'

import logo from '@/images/logo_white.png'

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.frontImage}>
        <div className={styles.front}>
          <div>
            <Image loading="eager" src={logo} width={300}/>
            <button>Logg in</button>
            <button>Ny student</button>
          </div>
        </div>
      </div>
    </div>
  )
}
