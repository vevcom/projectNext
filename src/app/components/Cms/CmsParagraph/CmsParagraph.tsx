import styles from './CmsParagraph.module.scss'
import ParagraphEditor from './CmsParagraphEditor'
import React from 'react'
import type { CmsParagraph as CmsParagraphT } from '@prisma/client'

type PropTypes = {
    cmsParagraph: CmsParagraphT
    editorClassName?: string
    className?: string
}

export default async function CmsParagraph({ cmsParagraph, editorClassName, className }: PropTypes) {
    return (
        <>
        <div className={`${styles.CmsParagraph} ${className}`}>
            {cmsParagraph.contentHtml ? (
                <div className={styles.HTMLcontent} dangerouslySetInnerHTML={{ __html: cmsParagraph.contentHtml }} />
            ) : (
                <i>no content</i>
            )}
        </div>
        <ParagraphEditor editorClassName={editorClassName} cmsParagraph={cmsParagraph} />
        </>
    )
}
