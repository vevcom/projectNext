import Image from './Image'
import { ImageProps } from 'next/image'
import read from '@/actions/images/read'

export type PropTypes = Omit<ImageProps, 'src' | 'alt'> & {
    name: string,
    width: number,
    alt?: string
}

export default async function ImageLink({ name, width, alt, ...props }: PropTypes) {
    let { success, data: image } = await read(name)
    if (!success || !image) image = (await read('default_image')).data
    if (!image) throw new Error('No default image found. To fix add a image called: default_image')
    return (
        <div>
            <Image image={image} width={width} {...props}/>
        </div>
    )
}
