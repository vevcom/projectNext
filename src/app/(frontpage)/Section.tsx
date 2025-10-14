import styles from './Section.module.scss'
import SpecialCmsParagraph from '@/components/Cms/CmsParagraph/SpecialCmsParagraph'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'
import {
    readSpecialCmsParagraphFrontpageSection,
    updateSpecialCmsParagraphFrontpageSection
} from '@/services/frontpage/actions'
import React from 'react'
import Link from 'next/link'
import type {
    SpecialCmsImage as SpecialCmsImageT,
    SpecialCmsParagraph as SpecialCmsParagraphT
} from '@prisma/client'

type PropTypes = {
    specialCmsImage: SpecialCmsImageT,
    specialCmsParagraph: SpecialCmsParagraphT,
    lesMer: string,
    position: 'left' | 'right',
    imgWidth: number,
    id?: string,
}

function Section({ specialCmsImage, specialCmsParagraph, lesMer, position, imgWidth, id }: PropTypes) {
    const imgContainer = (
        <div style={{ width: imgWidth }} className={styles.imgContainer}>
            <SpecialCmsImage special={specialCmsImage} width={imgWidth} />
        </div>
    )
    return (
        <div id={id} className={`${styles.section} ${position === 'right' && styles.blue}`}>
            {position === 'left' && imgContainer}
            <div>
                <SpecialCmsParagraph
                    className={styles.paragraph}
                    special={specialCmsParagraph}
                    readSpecialCmsParagraphAction={readSpecialCmsParagraphFrontpageSection}
                    updateCmsParagraphAction={updateSpecialCmsParagraphFrontpageSection}
                />
                <Link className={styles.readMore} href={lesMer}>Les mer</Link>
            </div>
            {position === 'right' && imgContainer}
        </div>
    )
}

export default Section
