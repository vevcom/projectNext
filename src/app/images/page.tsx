import prisma from '@/prisma'
import styles from './page.module.scss'
import Link from 'next/link'
import Image from '@/components/Image/Image'
import type { Image as ImageT } from '@prisma/client'
import MakeNewCollection from './MakeNewCollection'
import { readPage } from '@/actions/images/collections/read'
import type { PageSizeImageCollection } from '@/context/paging/ImageCollectionPaging'

export default async function Images() {
    const isAdmin = true //temp
    const pageSize : PageSizeImageCollection = 15

    const {success, data: initialCollections = [], error} = await readPage({
        page: {
            pageSize,
            page: 0
        },
        details: null,
    })
    if (!success) throw error ? error[0].message : new Error('Unknown error')

    const lensCamera = await prisma.image.findUnique({
        where: { name: 'lens_camera' }
    })


    type Collection = {
        coverImage: ImageT | null,
        backupImage: ImageT | null,
    }

    const chooseCoverImage = (collection : Collection) => {
        if (collection.coverImage) return <Image width={100} image={collection.coverImage} />
        if (collection.backupImage) {return <Image width={100} image={collection.backupImage} />}
        if (lensCamera) return <Image width={100} image={lensCamera} />
        return <h3>Something went wrong</h3>
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <span className={styles.header}>
                    <h1>Fotogalleri</h1>
                    {isAdmin && <MakeNewCollection />}
                </span>
                {
                    initialCollections.map(collection => (
                        <Link href={`/images/collections/${collection.id}`} className={styles.collection} key={collection.id}>
                            {
                                chooseCoverImage(collection)
                            }
                            <div className={styles.info}>
                                <h2>{collection.name}</h2>
                                <i>{collection.description}</i>
                                <p>{collection.createdAt.toLocaleDateString()}</p>
                            </div>
                            <p className={styles.imageCount}>{collection.numberOfImages}</p>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}
