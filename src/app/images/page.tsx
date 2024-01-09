import prisma from '@/prisma'
import styles from './page.module.scss'
import type { Image as ImageT } from '@prisma/client'
import MakeNewCollection from './MakeNewCollection'
import { readPage } from '@/actions/images/collections/read'
import type { PageSizeImageCollection } from '@/context/paging/ImageCollectionPaging'
import ImageCollectionList from '../components/Image/Collection/ImageCollectionList'

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

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <span className={styles.header}>
                    <h1>Fotogalleri</h1>
                    {isAdmin && <MakeNewCollection />}
                </span>
                <ImageCollectionList collections={initialCollections} />
            </div>
        </div>
    )
}
