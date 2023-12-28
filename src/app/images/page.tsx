import prisma from '@/prisma'
import styles from './page.module.scss'
import Link from 'next/link'
import Image from '@/components/Image/Image'
import type { Image as ImageT } from '@prisma/client'
import MakeNewCollection from './MakeNewCollection'

export default async function Images() {
    const isAdmin = true //temp

    const collections = await prisma.imageCollection.findMany({
        include: {
            coverImage: true,
            images: {
                take: 1
            }
        }
    })

    const default_image = await prisma.image.findUnique({
        where: { name: "default_image" }
    })

    type Collection = {
        coverImage: ImageT | null,
        images?: ImageT[]
    }

    const findCoverImageToUse = (collection : Collection) : ImageT | null => {
        if (collection.coverImage) return collection.coverImage
        if (collection.images && collection.images.length > 0) return collection.images[0]
        return default_image
    }

    const coverImage = (collection : Collection) => {
        if (collection.coverImage) return <Image width={100} image={collection.coverImage} />
        if (collection.images && collection.images.length > 0) return <Image width={100} image={collection.images[0]} />
        if (default_image) return <Image width={100} image={default_image} />
        return <h3>Something went wrong</h3>
    }

    return (
        <>
            <div className={styles.wrapper}>
                <span className={styles.header}>
                    <h1>Fotogalleri</h1>
                    {isAdmin && <MakeNewCollection />}
                </span>
                {
                    collections.map(collection => (
                        <Link href={`/images/collections/${collection.id}`} className={styles.collection} key={collection.id}>
                            {  
                                coverImage(collection)
                            }
                            <div className={styles.info}>
                                <h2>{collection.name}</h2>
                                <h4>{collection.description}</h4>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </>
    )
}
