'use client'
import styles from './AddSection.module.scss'
import AddParts from '@/cms/AddParts'
import { maxSections } from '@/cms/articles/constants'
import useEditMode from '@/hooks/useEditMode'
import { useRouter } from 'next/navigation'
import type { ArticleSectionPart } from '@/cms/articleSections/types'
import type { AddSectionToArticleAction } from '@/cms/articles/types'
import type { ConfiguredAction } from '@/services/actionTypes'
import type { AuthResultTypeAny } from '@/auth/auther/AuthResult'

type PropTypes = {
    currentNumberSections: number,
    addSectionToArticleAction: ConfiguredAction<AddSectionToArticleAction>
    canEdit: AuthResultTypeAny
}

export default function AddSection({
    currentNumberSections,
    addSectionToArticleAction,
    canEdit,
}: PropTypes) {
    const { refresh } = useRouter()
    const editable = useEditMode({ authResult: canEdit })

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

    if (!editable) return null
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
