'use client'
import { ImageDisplayContext } from '@/contexts/ImageDisplayProvider'
import { ImageSelectionContext } from '@/contexts/ImageSelection'
import { useContext } from 'react'
import type { Image } from '@prisma/client'

type PropTypes = {
    image: Image
}

/**
 * Sets a image to display in the ImageDisplayContext. If this component is not rendered in a ImageDisplayProvider,
 * it will intead use the imageSelectionContext.
 * @param image - the image to display
 * @returns
 */
export default function SelectImageDisplay({ image }: PropTypes) {
    const imageDisplayContext = useContext(ImageDisplayContext)
    const imageSelectionContext = useContext(ImageSelectionContext)
    if (!imageDisplayContext) {
        if (!imageSelectionContext) return <></>
        return (
            <button onClick={() => {
                console.log('Setting image to display')
                imageSelectionContext.setSelectedImage(image)
            }} />
        )
    }

    return (
        <button onClick={() => {
            console.log('Setting image to display')
            imageDisplayContext.setImage(image)
        }} />
    )
}
