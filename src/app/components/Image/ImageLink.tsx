import Image from './Image'
import type { PropTypes as ImagePropTypes } from './Image'
import read from '@/actions/images/read'

export type PropTypes = Omit<ImagePropTypes, 'image'> & {
    name: string,
}

export default async function ImageLink({ name, ...props }: PropTypes) {
    const { success, data } = await read(name)
    const image = success && data ? data : (await read('default_image')).data
    if (!image) throw new Error('No default image found. To fix add a image called: default_image')
    return (
        <div>
            <Image image={image} {...props}/>
        </div>
    )
}
