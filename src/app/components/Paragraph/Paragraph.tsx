import styles from './Paragraph.module.scss'
import ParagraphEditor from './ParagraphEditor'
import React from 'react'
import type { Paragraph as ParagraphT } from '@prisma/client'

type PropTypes = {
    paragraph: ParagraphT
}

export default async function Paragraph({ paragraph }: PropTypes) {
    return (
        <div className={styles.Paragraph}>
            {paragraph.contentHtml ? (
                <div className={styles.HTMLcontent} dangerouslySetInnerHTML={{ __html: paragraph.contentHtml }} />
            ) : (
                <i>no content</i>
            )}
            <ParagraphEditor paragraph={paragraph} />
        </div>
    )
}
