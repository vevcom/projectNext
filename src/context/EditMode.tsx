'use client'
import React, { useState, createContext } from 'react'

type PropTypes = {
    children: React.ReactNode,
    defaultValue?: boolean,
}

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
