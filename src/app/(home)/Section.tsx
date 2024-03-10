import styles from './Section.module.scss'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'
import React from 'react'
import Link from 'next/link'
import type { 
    SpecialCmsImage as SpecialCmsImageT,
    SpecialCmsParagraph as SpecialCmsParagraphT
} from '@prisma/client'
import SpecialCmsParagraph from '../components/Cms/CmsParagraph/SpecialCmsParagraph'

type PropTypes = {
    specialCmsImage: SpecialCmsImageT,
    specialCmsParagraph: SpecialCmsParagraphT,
    lesMer: string,
    right?: boolean,
    imgWidth: number,
    id?: string,
}

function Section({ specialCmsImage, specialCmsParagraph, lesMer, right, imgWidth, id }: PropTypes) {
    const imgContainer = (
        <div style={{ width: imgWidth }} className={styles.imgContainer}>
            <SpecialCmsImage special={specialCmsImage} width={imgWidth} />
        </div>
    )
    return (
        <div id={id} className={`${styles.section} ${right && styles.blue}`}>
            {!right && imgContainer}
            <div>
                <SpecialCmsParagraph special={specialCmsParagraph} />
                <Link href={lesMer}>Les mer</Link>
            </div>
            {right && imgContainer}
        </div>
    )
}

export default Section
