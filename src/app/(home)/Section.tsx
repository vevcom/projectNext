import styles from './Section.module.scss'
import CmsImage from '@/components/Cms/CmsImage/CmsImage'
import React from 'react'
import Link from 'next/link'

type PropTypes = {
    children: React.ReactNode,
    imagename: string,
    name: string,
    lesMer: string,
    right?: boolean,
    imgWidth: number,
    id?: string,
}

function Section({ children, imagename, name, lesMer, right, imgWidth, id }: PropTypes) {
    const imgContainer = (
        <div style={{ width: imgWidth }} className={styles.imgContainer}>
            <CmsImage name={imagename} width={imgWidth} />
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
