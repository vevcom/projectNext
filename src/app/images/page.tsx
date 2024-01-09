import prisma from '@/prisma'
import styles from './page.module.scss'
import CollectionCard from '@/components/Image/Collection/CollectionCard'
import type { Image as ImageT } from '@prisma/client'
import MakeNewCollection from './MakeNewCollection'
import { readPage } from '@/actions/images/collections/read'
import type { PageSizeImageCollection } from '@/context/paging/ImageCollectionPaging'

export default async function Images() {
    const isAdmin = true //temp
    const pageSize : PageSizeImageCollection = 12

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
        if (collection.coverImage) return collection.coverImage
        if (collection.backupImage) collection.backupImage
        if (lensCamera) return lensCamera
        return null
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <span className={styles.header}>
                    <h1>Fotogalleri</h1>
                    {isAdmin && <MakeNewCollection />}
                </span>
                <div className={styles.ImageCollectionList}>
                {
                    initialCollections.map(collection => (
                        <CollectionCard collection={
                            {
                                ...collection,
                                coverImage: chooseCoverImage(collection),
                            }
                        } />
                    ))
                }
                </div>
            </div>
        </div>
    )
}
