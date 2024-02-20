'use client'

import React, { createContext, useState } from 'react'
import type { Image } from '@prisma/client'

export const ImageSelectionContext = createContext<{
    selectionMode: boolean,
    setSelectionMode: (selectionMode: boolean) => void,
    selectedImage: Image | null,
    setSelectedImage: (image: Image | null) => void,
        } | null>(null)

type PropTypes = {
    children: React.ReactNode,
    defaultSelectionMode?: boolean,
    defaultImage?: Image,
}

export default function ImageSelectionProvider({ children, defaultSelectionMode = false, defaultImage }: PropTypes) {
    const [image, setImage] = useState<Image | null>(defaultImage || null)
    const [selectionModeActive, setSelectionModeActive] = useState(defaultSelectionMode)

    return (
        <ImageSelectionContext.Provider value={{
            selectionMode: selectionModeActive,
            setSelectionMode: setSelectionModeActive,
            selectedImage: image,
            setSelectedImage: setImage,
        }}>
            {children}
        </ImageSelectionContext.Provider>
    )
}
