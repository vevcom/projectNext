import Image from '../Image'
import type { PropTypes as ImagePropTypes } from '../Image'
import read from '@/actions/images/links/read'
import ImageLinkEditor from './ImageLinkEditor'
import styles from './ImageLink.module.scss'
import React from 'react'

export type PropTypes = Omit<ImagePropTypes, 'image' | 'children'> & {
    name: string,
    children?: React.ReactNode
}

export default async function ImageLink({ name, children, ...props }: PropTypes) {
    const { success, data } = await read(name)
    //The read inageLink action should always return a imageLink (it creates it if it does not exist)
    if (!data || !success) throw new Error(`An error with creating or loading image link: ${name}`)
    const image = data.image ? data.image : (await read('default_image')).data?.image
    if (!image) throw new Error('No default image found. To fix add a image called: default_image')
    return (
        <div className={styles.ImageLink}>
            <ImageLinkEditor imageLink={{...data, image}}/>
            <Image image={image} {...props}/>
            <div className={styles.children}>{children}</div>
        </div>
    )
}
