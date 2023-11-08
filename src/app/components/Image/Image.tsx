import prisma from '@/prisma'
import { join } from 'path'
import { default as NextImage, ImageProps } from 'next/image'

type PropTypes = Omit<ImageProps, 'src' | 'alt'> & {
    name: string,
    width: number,
}

export default async function Image({ name, ...props } : PropTypes) {
    const image = await prisma.image.findUnique({
        where: { name }
    })
    try {
        if (!image) throw `no image found with name: ${name}`
        const imagesrc = require(`./../../../../store/images/${image?.fsLocation}`)
        return (
            <NextImage alt={image.alt} src={imagesrc} {...props} />
        )
    } catch (err) {
        const imagesrc = require(`./../../../../public/default_image.jpeg`)
        return (
            <div>
                <div>Could not find image {name}</div>
                <NextImage alt={'default image'} src={imagesrc} {...props} />
            </div>
        )
    }
}
