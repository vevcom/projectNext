'use client'
import { ImageDisplayContext } from '@/contexts/ImageDisplayProvider'
import type { Image } from '@prisma/client'
import { useContext } from 'react'

type PropTypes = {
    image: Image
}

/**
 * Sets a image to display in the ImageDisplayContext
 * @param image - the image to display
 * @returns 
 */
export default function SelectImageDisplay({ image }: PropTypes) {
    const imageDisplayContext = useContext(ImageDisplayContext)
    if (!imageDisplayContext) return <></>
    
    return (
        <button onClick={() => {
            console.log('Setting image to display')
            imageDisplayContext.setImage(image)
        }} />
    )
}
