import prisma from '@/prisma'
import { join } from 'path'
import { default as NextImage, ImageProps } from 'next/image'

type PropTypes = Omit<ImageProps, 'src' | 'alt'> & {
    name: string,
    width: number,
    height: number,
}

export default async function Image({ name, ...props } : PropTypes) {
    const image = await prisma.image.findUnique({
        where: { name }
    })
    let imagesrc
    try {
        console.log(`./../../store/images/${image?.fsLocation}`)
        imagesrc = require(`./../../../../store/images/${image?.fsLocation}`);
    } catch (err) {
        imagesrc = require(`./../../../../public/default_image.jpeg`)
    }

    return (
        image ? (
            <div>
                <NextImage alt={image.alt} src={imagesrc} {...props} />
            </div>
        ) : (
            <div>Image not found</div>
        )
    )
}
