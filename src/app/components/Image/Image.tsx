import prisma from '@/prisma'
import { default as NextImage, ImageProps } from 'next/image'

type PropTypes = Omit<ImageProps, 'src' | 'alt'> & {
    name: string,
    width: number,
    alt?: string
}

export default async function Image({ alt, name, ...props } : PropTypes) {
    const image = await prisma.image.findUnique({
        where: { name }
    })
    try {
        if (!image) throw `no image found with name: ${name}`
        const imagesrc = await import(`./../../../../store/images/${image?.fsLocation}`)
        return (
            <NextImage alt={alt ?? image.alt} src={imagesrc} {...props} />
        )
    } catch (err) {
        const imagesrc = await import('./../../../../public/default_image.jpeg')
        return (
            <div>
                <div>Could not find image {name}</div>
                <NextImage alt="default image" src={imagesrc} {...props} />
            </div>
        )
    }
}
