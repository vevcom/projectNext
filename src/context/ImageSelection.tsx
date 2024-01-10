'use client'

import React, { createContext, useState } from 'react'
import type { Image } from '@prisma/client'

export const ImageSelectionContext = createContext<{
    selectionMode: boolean,
    setSelectionMode:(selectionMode: boolean) => void,
    selectedImage: Image | null,
    setSelectedImage: (image: Image | null) => void,
        } | null>(null)

type PropTypes = {
    children: React.ReactNode,
}

export default function ImageSelectionProvider({ children } : PropTypes) {
    const [image, setImage] = useState<Image | null>(null)
    const [selectionModeActive, setSelectionModeActive] = useState(false)

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
