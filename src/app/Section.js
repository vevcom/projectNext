import Image from 'next/image'
import Link from 'next/link'
import styles from './Section.module.scss'

function Section({children, img, name, lesMer, right, imgWidth}) {
    const alt = "image of " + name
    const imgContainer = (
        <div style={{width: imgWidth}} className={styles.imgContainer}>
            <Image 
                src={img}
                alt={alt}
                width={imgWidth}
                />
        </div>
    )
    return (
        <div className={`${styles.section} ${right && styles.blue}`}>
            {!right && imgContainer}
            <div>
                <h3>{name}</h3>
                <p>
                    {children}
                </p>
                <Link href={lesMer}>Les mer</Link>
            </div>
            {right && imgContainer}
        </div>
    )
}

export default Section