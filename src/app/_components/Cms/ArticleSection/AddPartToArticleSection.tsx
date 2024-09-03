'use client'
import styles from './AddPartToArticleSection.module.scss'
import { addArticleSectionPartAction } from '@/cms/articleSections/update'
import AddParts from '@/cms/AddParts'
import useEditing from '@/hooks/useEditing'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { PropTypes as AddPartsPropTypes } from '@/cms/AddParts'
import type { ArticleSectionPart } from '@/cms/articleSections/Types'
import type { ReactNode } from 'react'

type PropTypes = Omit<AddPartsPropTypes, 'onClick'> & {
    articleSectionName: string
    children: ReactNode
}

export default function AddPartToArticleSection({ articleSectionName, children, ...props }: PropTypes) {
    const { refresh } = useRouter()
    const canEdit = useEditing({}) //TODO: check visibility of article for user and pass it to useEditing
    const handleAdd = useCallback(async (part: ArticleSectionPart) => {
        await addArticleSectionPartAction(articleSectionName, part)
        refresh()
    }, [articleSectionName])
    if (!canEdit) return children

    return (
        <div className={styles.AddPartToArticleSection}>
            <div className={
                props.showImageAdd || props.showLinkAdd || props.showParagraphAdd ?
                    `${styles.wrapper} ${styles.paddingBottom}`
                    :
                    styles.wrapper
            }>
                {children}
                <AddParts onClick={handleAdd} {...props} />
            </div>
        </div>
    )
}

