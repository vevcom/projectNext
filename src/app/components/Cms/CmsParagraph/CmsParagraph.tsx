import styles from './CmsParagraph.module.scss'
import ParagraphEditor from './CmsParagraphEditor'
import React from 'react'
import type { Paragraph as ParagraphT } from '@prisma/client'

type PropTypes = {
    paragraph: ParagraphT
}

export default async function CmsParagraph({ paragraph }: PropTypes) {
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
