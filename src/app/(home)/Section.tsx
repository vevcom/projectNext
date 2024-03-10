import styles from './Section.module.scss'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'
import React from 'react'
import Link from 'next/link'
import type { SpecialCmsImage as SpecialCmsImageT } from '@prisma/client'

type PropTypes = {
    children: React.ReactNode,
    specialCmsImage: SpecialCmsImageT,
    name: string,
    lesMer: string,
    right?: boolean,
    imgWidth: number,
    id?: string,
}

function Section({ children, specialCmsImage, name, lesMer, right, imgWidth, id }: PropTypes) {
    const imgContainer = (
        <div style={{ width: imgWidth }} className={styles.imgContainer}>
            <SpecialCmsImage special={specialCmsImage} width={imgWidth} />
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
