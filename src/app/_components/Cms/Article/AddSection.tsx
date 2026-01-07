'use client'

import styles from './AddSection.module.scss'
import AddParts from '@/cms/AddParts'
import { maxSections } from '@/cms/articles/constants'
import useEditMode from '@/hooks/useEditMode'
import { RequireNothing } from '@/auth/authorizer/RequireNothing'
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
    //TODO: Authorizer must be passed in....
    const canEdit = useEditMode({ authorizer: RequireNothing.staticFields({}).dynamicFields({}) })

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
