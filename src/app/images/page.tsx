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

    const lens_camera = await prisma.image.findUnique({
        where: { name: "lens_camera" }
    })

    type Collection = {
        coverImage: ImageT | null,
        images?: ImageT[]
    }

    const chooseCoverImage = (collection : Collection) => {
        if (collection.coverImage) return <Image width={100} image={collection.coverImage} />
        if (collection.images && collection.images.length > 0) return <Image width={100} image={collection.images[0]} />
        if (lens_camera) return <Image width={100} image={lens_camera} />
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
                                chooseCoverImage(collection)
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
