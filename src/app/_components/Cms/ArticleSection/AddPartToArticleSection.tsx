'use client'
import styles from './AddPartToArticleSection.module.scss'
import AddParts from '@/cms/AddParts'
import useEditing from '@/hooks/useEditing'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { PropTypes as AddPartsPropTypes } from '@/cms/AddParts'
import type {
    AddPartToArticleSectionAction,
    ArticleSectionPart,
} from '@/cms/articleSections/types'
import type { ReactNode } from 'react'
import type { ConfiguredAction } from '@/services/actionTypes'

type PropTypes = Omit<AddPartsPropTypes, 'onClick'> & {
    children: ReactNode
    addPartToArticleSectionAction: ConfiguredAction<AddPartToArticleSectionAction>
}

export default function AddPartToArticleSection({
    children,
    addPartToArticleSectionAction,
    ...props
}: PropTypes) {
    const { refresh } = useRouter()
    const canEdit = useEditing({}) //TODO: check visibility of article for user and pass it to useEditing

    const handleAdd = useCallback(async (part: ArticleSectionPart) => {
        await addPartToArticleSectionAction({ data: { part } })
        refresh()
    }, [addPartToArticleSectionAction, refresh])
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

