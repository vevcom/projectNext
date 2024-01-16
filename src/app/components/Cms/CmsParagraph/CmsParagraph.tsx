import styles from './CmsParagraph.module.scss'
import ParagraphEditor from './CmsParagraphEditor'
import React from 'react'
import type { CmsParagraph as CmsParagraphT } from '@prisma/client'

type PropTypes = {
    cmsParagraph: CmsParagraphT
}

export default async function CmsParagraph({ cmsParagraph }: PropTypes) {
    return (
        <div className={styles.CmsParagraph}>
            {cmsParagraph.contentHtml ? (
                <div className={styles.HTMLcontent} dangerouslySetInnerHTML={{ __html: cmsParagraph.contentHtml }} />
            ) : (
                <i>no content</i>
            )}
            <ParagraphEditor cmsParagraph={cmsParagraph} />
        </div>
    )
}
