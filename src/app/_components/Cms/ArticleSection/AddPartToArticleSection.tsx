'use client'
import styles from './AddPartToArticleSection.module.scss'
import AddParts from '@/cms/AddParts'
import useEditMode from '@/hooks/useEditMode'
import { RequireNothing } from '@/auth/auther/RequireNothing'
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
    //TODO: Auther must be passed in....
    const canEdit = useEditMode({
        auther: RequireNothing.staticFields({}).dynamicFields({})
    })
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

