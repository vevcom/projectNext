'use client'
import React, { useState } from 'react'
import EditableTextField from '@/components/EditableTextField/EditableTextField'
import styles from './ChangeName.module.scss'
import { updateArticle } from '@/actions/cms/articles/update'
import { ReturnType } from '@/actions/cms/articles/ReturnType'
import { usePathname } from 'next/navigation'

type PropTypes = {
    article: ReturnType
}

export default function ChangeName({ article }: PropTypes) {
    const changeName = updateArticle.bind(null, article.id)
    const currentPath = usePathname()
    const [currentName, setCurrentName] = useState(article.name)
    const successCallback = (data: ReturnType | undefined) => {
        const oldName = encodeURIComponent(currentName);
        const newName = encodeURIComponent(data ? data.name : '');
        const newPath = currentPath.replace(oldName, newName);
        setCurrentName(data ? data.name : article.name);
        if (typeof window !== 'undefined') {
            window.history.replaceState({}, '', newPath);
        }
    }
    return (
        <EditableTextField
            formProps={
                {
                    action: changeName,
                    successCallback: successCallback
                }
            }
            submitButton={{
                name: 'name',
                text: 'lagre',
                className: styles.submitNameButton
            }}
            editable={true}
        >
            <h1 className={styles.title}>{currentName}</h1>
        </EditableTextField>
    )
}
