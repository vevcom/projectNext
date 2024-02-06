'use client'

import AddParts from '@/cms/AddParts'
import styles from './AddSection.module.scss'
import type { Part } from '@/cms/articleSections/update'
import { useRouter } from 'next/navigation'
import { addSectionToArticle } from '@/cms/articles/update'
import { maxSections } from '@/cms/articles/ConfigVars'
import { EditModeContext } from '@/context/EditMode'
import { useContext } from 'react'

type PropTypes = {
    articleId: number,
    currentNumberSections: number,
}

export default function AddSection({ articleId, currentNumberSections }: PropTypes) {
    const { refresh } = useRouter()
    const editMode = useContext(EditModeContext)
    if (!editMode?.editMode) return null

    const handleAdd = async (part: Part) => {
        addSectionToArticle(articleId, {
            [part]: true,
        })
        refresh()
    }
    return (
        <span className={styles.AddSection}>
            {
                currentNumberSections >= maxSections ? (
                    <p className={styles.maxLength}>Maksimal lengde på {maxSections} nådd</p>
                ) : (
                    <AddParts 
                        showParagraphAdd={true}
                        showImageAdd={true}
                        showLinkAdd={true}
                        onClick={handleAdd}
                    />
                )
            }
        </span>
    )
}
