'use client'
import React, { useState, createContext } from 'react'

type PropTypes = {
    children: React.ReactNode,
    defaultValue?: boolean,
}

/**
 * EditModeContext is a context used to set if the app is in editmode. If the app is
 * in editmode, the pencil icon will be shown in the top right corner of the app.
 */
export const EditModeContext = createContext<{
    editMode: boolean,
    setEditMode: (editMode: boolean) => void,
        } | null>(null)

export default function EditModeProvider({ defaultValue = false, children }: PropTypes) {
    const [editMode, setEditMode] = useState(defaultValue)

    return (
        <EditModeContext.Provider value={{
            editMode,
            setEditMode,
        }}>
            {children}
        </EditModeContext.Provider>
    )
}
