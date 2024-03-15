'use client'
import React, { useState, createContext, useEffect } from 'react'

type PropTypes = {
    children: React.ReactNode,
    defaultValue?: boolean,
}

/**
 * WARNING: This context should not be consumed directly, except for through the EditModeSwitch.
 * instead use the useEtiting hook.
 * EditModeContext is a context used to set if the app is in editmode. If the app is
 * in editmode, the pencil icon will be shown in the top right corner of the app.
 */
export const EditModeContext = createContext<{
    editMode: boolean,
    setEditMode: (editMode: boolean) => void,
    somethingToEdit: boolean,
    addEditableContent: (key: string) => void,
    removeEditableContent: (key: string) => void,
        } | null>(null)

export default function EditModeProvider({ defaultValue = false, children }: PropTypes) {
    const [editMode, setEditMode_] = useState(defaultValue)
    const [editableContent, setEditableContent] = useState<string[]>([])

    const setEditMode = (newEditMode: boolean) => {
        if (newEditMode === false) setEditMode_(false)
        if (newEditMode === true && editableContent.length > 0) setEditMode_(true)
    }

    const addEditableContent = (key: string) => {
        setEditableContent((prev) => {
            if (prev.includes(key)) {
                return prev
            }
            return [...prev, key]
        })
    }

    const removeEditableContent = (key: string) => {
        setEditableContent((prev) => prev.filter((k) => k !== key))
    }

    useEffect(() => {
        if (editableContent.length === 0) setEditMode_(false)
    }, [editableContent])

    return (
        <EditModeContext.Provider value={{
            editMode,
            setEditMode,
            somethingToEdit: editableContent.length > 0,
            addEditableContent,
            removeEditableContent,
        }}>
            {children}
        </EditModeContext.Provider>
    )
}
