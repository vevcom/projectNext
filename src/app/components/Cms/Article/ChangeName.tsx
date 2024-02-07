'use client'
import React from 'react'
import EditableTextField from '@/components/EditableTextField/EditableTextField'
import styles from './ChangeName.module.scss'
import type { PropTypes } from './Article'
import { updateArticle } from '@/actions/cms/articles/update'
import { ReturnType } from '@/actions/cms/articles/ReturnType'
import { useRouter, usePathname } from 'next/navigation'

export default function ChangeName({ article }: PropTypes) {
    const changeName = updateArticle.bind(null, article.id)
    const { replace } = useRouter()
    const currentPath = usePathname()
    const successCallback = (data: ReturnType | undefined) => {
        const oldName = encodeURIComponent(article.name);
        const newName = encodeURIComponent(data ? data.name : '');
        const newPath = currentPath.replace(oldName, newName);

        replace(newPath);
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
            <h1 className={styles.title}>{article.name}</h1>
        </EditableTextField>
    )
}
