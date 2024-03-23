'use client'

import styles from './AddSection.module.scss'
import AddParts from '@/cms/AddParts'
import { addSectionToArticleAction } from '@/cms/articles/update'
import { maxSections } from '@/cms/articles/ConfigVars'
import useEditing from '@/hooks/useEditing'
import { useRouter } from 'next/navigation'
import type { ArticleSectionPart } from '@/server/cms/articleSections/Types'

type PropTypes = {
    articleId: number,
    currentNumberSections: number,
}

export default function AddSection({ articleId, currentNumberSections }: PropTypes) {
    const { refresh } = useRouter()
    const canEdit = useEditing() //TODO: check visibility of article for user and pass it to useEditing
    if (!canEdit) return null

    const handleAdd = async (part: ArticleSectionPart) => {
        addSectionToArticleAction(articleId, {
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
