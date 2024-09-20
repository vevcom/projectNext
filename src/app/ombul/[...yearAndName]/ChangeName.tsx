'use client'

import styles from './ChangeName.module.scss'
import EditableTextField from '@/components/EditableTextField/EditableTextField'
import { updateOmbulAction } from '@/actions/ombul/update'
import type { ReactNode } from 'react'
import type { ExpandedOmbul } from '@/services/ombul/Types'

type PropTypes = {
    children: ReactNode
    editable: boolean
    ombulId: number
}

/**
 * Component that wraps the name of ombul in a EditableTextFieldthat can be submitted to update the name
 * On success the name in the url is changed to the new name
 * @param children - The text to display and edit
 * @param editable - Whether the text should be editable
 * @param ombulId - The id of the ombul to update
 * @returns The component jsx
 */
export default function ChangeName({ children, editable, ombulId }: PropTypes) {
    const changeName = updateOmbulAction.bind(null, ombulId)

    const handleChange = async (data: ExpandedOmbul | undefined) => {
        const name = data?.name
        if (!name) return
        const url = window.location.pathname
        const urlParts = url.split('/')
        urlParts[urlParts.length - 1] = name
        const newUrl = urlParts.join('/')
        window.history.pushState({ path: newUrl }, '', newUrl)
    }

    return (
        <EditableTextField
            editable={editable}
            formProps={{
                action: changeName,
                successCallback: handleChange
            }}
            inputName='name'
            submitButton={{
                text: 'Endre',
                className: styles.changeNameButton
            }}
        >
            {children}
        </EditableTextField>
    )
}
