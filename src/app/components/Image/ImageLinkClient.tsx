'use client'
import { useState, useEffect } from 'react'
import type { Image as ImageT, ImageLink } from '@prisma/client'
import read from '@/actions/images/links/read'
import Image from './Image'
import type { PropTypes } from './ImageLink'
import ImageLinkEditor from './ImageLinkEditor'

export default function ImageLinkClient({ name, width, alt, ...props }: PropTypes) {
    const [imageLink, setImageLink] = useState<
        ImageLink & {
            image: ImageT | null
        } | null>(null)
    useEffect(() => {
        read(name).then(({ success, data }) => {
            if (success && data) return setImageLink(data)
            return read('default_image').then(({ success: defaultSuccess, data: defaultImage }) => {
                if (defaultSuccess && defaultImage) return setImageLink(defaultImage)
                throw new Error('No default image found. To fix add a image called: default_image')
            })
        })
    }, [])

    return (
        <div>
            {imageLink && <ImageLinkEditor imageLink={imageLink}/>}
            {imageLink?.image && <Image alt={alt} image={imageLink.image} width={width} {...props}/>}
        </div>
    )
}
