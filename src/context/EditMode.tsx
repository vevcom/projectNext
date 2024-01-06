'use client'
import React from 'react'
import { useState, createContext } from 'react'

type PropTypes = {
    children: React.ReactNode,
}

export const EditModeContext = createContext<{
    editMode: boolean,
    setEditMode:(editMode: boolean) => void,
        } | null>(null)

export default function EditModeProvider({ children } : PropTypes) {
    const [editMode, setEditMode] = useState(false)

    return (
        <EditModeContext.Provider value={{
            editMode,
            setEditMode,
        }}>
            {children}
        </EditModeContext.Provider>
    )
}
