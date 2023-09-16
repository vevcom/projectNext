import Image from 'next/image'
import Link from 'next/link'
import styles from './Section.module.scss'

function Section({children, img, name, lesMer, right, imgWidth}) {
  return (
    <div className={`${styles.section} ${right && styles.blue}`}>
        {!right && <Image width={imgWidth} src={img}/>}
        <div>
          <h3>{name}</h3>
          <p>
            {children}
          </p>
          <Link href={lesMer}>Les mer</Link>
        </div>
        {right && <Image width={imgWidth} src={img}/>}
    </div>
  )
}

export default Section