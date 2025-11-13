'use client'

import styles from './AddSection.module.scss'
import AddParts from '@/cms/AddParts'
import { maxSections } from '@/cms/articles/constants'
import useEditing from '@/hooks/useEditing'
import { useRouter } from 'next/navigation'
import type { ArticleSectionPart } from '@/cms/articleSections/types'
import type { AddSectionToArticleAction } from '@/cms/articles/types'
import type { ConfiguredAction } from '@/services/actionTypes'

type PropTypes = {
    currentNumberSections: number,
    addSectionToArticleAction: ConfiguredAction<AddSectionToArticleAction>
}

export default function AddSection({
    currentNumberSections,
    addSectionToArticleAction
}: PropTypes) {
    const { refresh } = useRouter()
    const canEdit = useEditing({}) //TODO: check visibility of article for user and pass it to useEditing

    const handleAdd = async (includePart: ArticleSectionPart) => {
        await addSectionToArticleAction({
            data: {
                includeParts: {
                    [includePart]: true,
                }
            }
        })
        refresh()
    }
    if (!canEdit) return null
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
