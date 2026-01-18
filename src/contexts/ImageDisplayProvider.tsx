'use client'

import ImageDisplay from '@/components/Image/ImageList/ImageDisplay'
import React, { createContext, useState } from 'react'
import type { Image } from '@/prisma-generated-pn-types'
import type { ImageSizeOptions } from '@/components/Image/Image'

/**
 * This is a contect that displays a image to the user using the imageSelectionContext.
 */
export const ImageDisplayContext = createContext<{
    setImage: (image: Image | null) => void;
    currentImage: Image | null;
    imageSize: ImageSizeOptions;
    setImageSize: (size: ImageSizeOptions) => void;
        } | null>(null)

type PropTypes = {
    children: React.ReactNode,
}

/**
 * @returns - a context provider that provides the imageSelect
 */
export default function ImageDisplayProvider({ children }: PropTypes) {
    const [image, setImage] = useState<Image | null>(null)
    const [imageSize, setImageSize] = useState<ImageSizeOptions>('LARGE')

    return (
        <ImageDisplayContext.Provider value={{
            setImage,
            currentImage: image,
            imageSize,
            setImageSize,
        }}>
            {children}
            <ImageDisplay />
        </ImageDisplayContext.Provider>
    )
}
