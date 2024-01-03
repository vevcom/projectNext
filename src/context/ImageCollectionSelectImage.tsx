'use client'

import { createContext, useState } from 'react'
import type { Image } from '@prisma/client'

export const ImageCollectionSelectImageContext = createContext<{
    selectionMode: boolean,
    setSelectionMode: (selectionMode: boolean) => void,
    selectedImage: Image | null,
    setSelectedImage: (image: Image | null) => void,
} | null>(null)

type PropTypes = {
    children: React.ReactNode,
}

export default function ImageCollectionSelectImage({ children } : PropTypes ) {
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
