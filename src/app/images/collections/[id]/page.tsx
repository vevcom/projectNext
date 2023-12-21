import prisma from '@/prisma'
import { notFound } from 'next/navigation';
import styles from './page.module.scss'
import Image from '@/components/Image/Image'
import ImageUploader from '@/components/ImageUploader/ImageUploader'


type PropTypes = {
    params: {
        id: string
    }
}

export default async function Collection({ params } : PropTypes) {
    const collection = await prisma.imageCollection.findUnique({
        where: {
            id: Number(params.id)
        },
        include: {
            images: true
        }
    })
    if (!collection) notFound()
    
    return (
        <div className={styles.wrapper}>
            <ImageUploader />
            <h2>collection {collection.name}</h2>
            <span className={styles.images}>
                {
                    collection.images.map(image => 
                        <Image width={200} key={image.id} name={image.name} />
                    )
                }
            </span>
        </div>
    )
}
