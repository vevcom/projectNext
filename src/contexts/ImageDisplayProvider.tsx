'use client'

import React, { createContext, useState } from 'react'
import type { Image } from '@prisma/client'
import ImageDisplay from '@/app/_components/Image/ImageList/ImageDisplay';

/**
 * This is a contect that displays a image to the user using the imageSelectionContext.
 */
export const ImageDisplayContext = createContext<{
    setImage: (image: Image | null) => void;
    currentImage: Image | null;
        } | null>(null)

type PropTypes = {
    children: React.ReactNode,
}

/**
 * @returns - a context provider that provides the imageSelect
 */
export default function ImageDisplayProvider({ children }: PropTypes) {
    const [image, setImage] = useState<Image | null>(null)

    return (
        <ImageDisplayContext.Provider value={{
            setImage: setImage,
            currentImage: image,
        }}>
            {children}
            <ImageDisplay />
        </ImageDisplayContext.Provider>
    )
}