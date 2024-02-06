'use client'
import styles from './AddPartToArticleSection.module.scss'
import { addPart } from '@/cms/articleSections/update'
import AddParts from '@/cms/AddParts'
import { EditModeContext } from '@/context/EditMode'
import { useCallback, useContext } from 'react'
import { useRouter } from 'next/navigation'
import type { PropTypes as AddPartsPropTypes } from '@/cms/AddParts'
import type { Part } from '@/cms/articleSections/update'
import type { ReactNode } from 'react'

type PropTypes = Omit<AddPartsPropTypes, 'onClick'> & {
    articleSectionName: string
    children: ReactNode
}

export default function AddPartToArticleSection({ articleSectionName, children, ...props }: PropTypes) {
    const { refresh } = useRouter()
    const editMode = useContext(EditModeContext)
    const handleAdd = useCallback(async (part: Part) => {
        await addPart(articleSectionName, part)
        refresh()
    }, [articleSectionName])
    if (!editMode?.editMode) return children

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

