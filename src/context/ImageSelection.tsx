'use client'

import React, { createContext, useState } from 'react'
import type { Image } from '@prisma/client'

/**
 * The context for selecting an image from a list of images
 * @prop selectionMode - Whether the selection mode is active
 * @prop setSelectionMode - A function to set the selection mode
 * @prop selectedImage - The currently selected image
 * @prop setSelectedImage - A function to set the selected image
 */
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

/**
 * A context to select an image from a list of images, ImageList and other components from comonents/image
 * implement this context to allow for selection of images
 * @param children - The children to wrap the provider around (has access to the context)
 * @param defaultSelectionMode - The starting selection mode
 * @param defaultImage - The starting image that is selected
 * @returns 
 */
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
