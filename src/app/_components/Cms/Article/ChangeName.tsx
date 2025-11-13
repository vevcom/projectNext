'use client'
import styles from './ChangeName.module.scss'
import EditableTextField from '@/components/EditableTextField/EditableTextField'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import type { ExpandedArticle, UpdateArticleAction } from '@/cms/articles/types'
import type { ConfiguredAction } from '@/services/actionTypes'

type PropTypes = {
    article: ExpandedArticle
    updateArticleAction: ConfiguredAction<UpdateArticleAction>
}

export default function ChangeName({ article, updateArticleAction }: PropTypes) {
    const currentPath = usePathname()
    const [currentName, setCurrentName] = useState(article.name)
    const successCallback = (data: ExpandedArticle | undefined) => {
        const oldName = encodeURIComponent(currentName)
        const newName = encodeURIComponent(data ? data.name : '')
        const newPath = currentPath.replace(oldName, newName)
        setCurrentName(data ? data.name : article.name)
        if (typeof window !== 'undefined') {
            window.history.replaceState({}, '', newPath)
        }
    }
    return (
        <EditableTextField
            formProps={
                {
                    action: updateArticleAction,
                    successCallback
                }
            }
            inputName="name"
            submitButton={{
                text: 'lagre',
                className: styles.submitNameButton
            }}
            editable={true}
        >
            <h1 className={styles.title}>{currentName}</h1>
        </EditableTextField>
    )
}
