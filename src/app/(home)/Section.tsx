import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import styles from './Section.module.scss'

type PropTypes = {
    children: React.ReactNode,
    img: StaticImageData,
    name: string,
    lesMer: string,
    right?: boolean,
    imgWidth: number,
    id?: string,
}

function Section({children, img, name, lesMer, right, imgWidth, id}: PropTypes) {
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
        <div id={id} className={`${styles.section} ${right && styles.blue}`}>
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
