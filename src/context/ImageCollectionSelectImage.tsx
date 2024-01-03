'use client'

import { createContext, useState } from 'react'
import type { Image } from '@prisma/client'

export const ImageCollectionSelectImageContext = createContext<{
    selectedImage: Image | null,
    setSelectedImage: (image: Image | null) => void,
} | null>(null)

type PropTypes = {
    children: React.ReactNode,
}

export default function ImageCollectionSelectImage({ children } : PropTypes ) {
    const [image, setImage] = useState<Image | null>(null)

    return (
        <ImageCollectionSelectImageContext.Provider value={{
            selectedImage: image,
            setSelectedImage: setImage,
        }}>
            {children}
        </ImageCollectionSelectImageContext.Provider>
    )
}
