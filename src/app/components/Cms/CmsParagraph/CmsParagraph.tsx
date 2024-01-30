import styles from './CmsParagraph.module.scss'
import ParagraphEditor from './CmsParagraphEditor'
import React from 'react'
import type { CmsParagraph as CmsParagraphT } from '@prisma/client'

type PropTypes = {
    cmsParagraph: CmsParagraphT
    className?: string
}

export default async function CmsParagraph({ cmsParagraph, className }: PropTypes) {
    return (
        <>
            <div className={`${styles.CmsParagraph} ${className}`}>
                {cmsParagraph.contentHtml ? (
                    <div className={styles.HTMLcontent} dangerouslySetInnerHTML={{ __html: cmsParagraph.contentHtml }} />
                ) : (
                    <i>Her var det ikke noe inhold</i>
                )}
                <ParagraphEditor cmsParagraph={cmsParagraph} />
            </div>
        </>
    )
}
