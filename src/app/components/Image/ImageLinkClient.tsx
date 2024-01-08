'use client'
import { useState, useEffect } from 'react'
import type { Image as ImageT } from '@prisma/client'
import read from '@/actions/images/links/read'
import Image from './Image'
import type { PropTypes } from './ImageLink'

export default function ImageLinkClient({ name, width, alt, ...props }: PropTypes) {
    const [image, setImage] = useState<ImageT | null>()
    useEffect(() => {
        read(name).then(({ success, data }) => {
            if (success && data) return setImage(data.image)
            return read('default_image').then(({ success: defaultSuccess, data: defaultImage }) => {
                if (defaultSuccess && defaultImage) return setImage(defaultImage)
                throw new Error('No default image found. To fix add a image called: default_image')
            })
        })
    }, [])

    return (
        <div>
            {image && <Image alt={alt} image={image} width={width} {...props}/>}
        </div>
    )
}
