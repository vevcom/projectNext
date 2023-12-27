import prisma from '@/prisma'
import { notFound } from 'next/navigation'
import styles from './page.module.scss'
import Image from '@/components/Image/Image'
import CollectionAdmin from './CollectionAdmin'


type PropTypes = {
    params: {
        id: string
    }
}

export default async function Collection({ params } : PropTypes) {
    const collection = await prisma.imageCollection.findUnique({
        where: {
            id: Number(params.id),
        },
        include: {
            images: true,
        },
    })
    if (!collection) notFound()
    const isAdmin = true //temp

    return (
        <div className={styles.wrapper}>
            {isAdmin && 
            <div className={styles.admin}>
                <CollectionAdmin collectionId={collection.id} />
            </div>
            }
            <div className={styles.images}>
                <h2>{collection.name}</h2>
                {
                    collection.images.map(image =>
                        <Image width={200} key={image.id} name={image.name} />
                    )
                }
            </div>
        </div>
    )
}
