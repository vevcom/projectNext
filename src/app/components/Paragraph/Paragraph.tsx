import type { Paragraph } from '@prisma/client'
import React from 'react'
import styles from './Paragraph.module.scss'
import ParagraphEditor from './ParagraphEditor'

type PropTypes = {
    paragraph: Paragraph
}

export default async function Paragraph({paragraph}: PropTypes) {
    return (
        <div className={styles.Paragraph}>
            {paragraph.content ? paragraph.content : <i>no content</i>}
            <ParagraphEditor paragraph={paragraph} />
        </div>
    )
}
