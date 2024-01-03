'use client'

import React, { createContext, useState } from 'react'
import type { Image } from '@prisma/client'

export const ImageCollectionSelectImageContext = createContext<{ selectionMode: false } | {
    selectionMode: true,
    setSelectionMode:(selectionMode: boolean) => void,
    selectedImage: Image | null,
    setSelectedImage: (image: Image | null) => void,
}>({ selectionMode: false })

type PropTypes = {
    children: React.ReactNode,
}

export default function ImageCollectionSelectImageProvider({ children } : PropTypes) {
    const [image, setImage] = useState<Image | null>(null)
    const [selectionModeActive, setSelectionModeActive] = useState(false)

    return (
        <ImageCollectionSelectImageContext.Provider value={{
            selectionMode: selectionModeActive,
            setSelectionMode: setSelectionModeActive,
            selectedImage: image,
            setSelectedImage: setImage,
        }}>
            {children}
        </ImageCollectionSelectImageContext.Provider>
    )
}
