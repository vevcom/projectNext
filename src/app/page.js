import Image from 'next/image'
import Link from 'next/link'
import SocialIcons from './components/SocialIcons/SocialIcons'
import styles from './page.module.scss'

import logo from '@/images/logo_white.png'

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.frontImage}>
        <div className={styles.front}>
          <div>
            <Image loading="eager" src={logo} width={300}/>
            <Link href="user/login">Logg inn</Link>
            <Link href="infopages/nystudent">Ny student</Link>
            <div className={styles.socials}>
              <SocialIcons />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Image></Image>
        <span>Om Omega</span>
      </div>
    </div>
  )
}
