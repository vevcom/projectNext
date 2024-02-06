'use client'
import { useCallback } from 'react'
import { addPart } from '@/cms/articleSections/update'
import { useRouter } from 'next/navigation'
import type { PropTypes as AddPartsPropTypes } from '@/cms/AddParts'
import AddParts from '@/cms/AddParts'
import type { Part } from '@/cms/articleSections/update'
import styles from './AddPartToArticleSection.module.scss'
import type { ReactNode } from 'react'
import { EditModeContext } from '@/context/EditMode'
import { useContext } from 'react'

type PropTypes = Omit<AddPartsPropTypes, 'onClick'> & {
    articleSectionName: string
    children: ReactNode
}

export default function AddPartToArticleSection({ articleSectionName, children, ...props }: PropTypes) {
    const { refresh } = useRouter()
    const editMode = useContext(EditModeContext)
    if (!editMode?.editMode) return children
    
    const handleAdd = useCallback(async (part: Part) => {
        await addPart(articleSectionName, part)
        refresh()
    }, [articleSectionName])
  
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

