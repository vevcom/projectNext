'use client'

import React, { createContext, useState } from 'react'
import type { Image } from '@prisma/client'
import ImageDisplay from '@/app/_components/Image/ImageList/ImageDisplay';
import { ImageSizeOptions } from '@/app/_components/Image/Image';

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
            setImage: setImage,
            currentImage: image,
            imageSize: imageSize,
            setImageSize: setImageSize,
        }}>
            {children}
            <ImageDisplay />
        </ImageDisplayContext.Provider>
    )
}