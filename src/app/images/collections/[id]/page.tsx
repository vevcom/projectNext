import { notFound } from 'next/navigation'
import styles from './page.module.scss'
import CollectionAdmin from './CollectionAdmin'
import read from '@/actions/images/collections/read'
import ImageCollectionList from '@/components/Image/ImageCollectionList'

type PropTypes = {
    params: {
        id: string
    }
}

export default async function Collection({ params } : PropTypes) {
    const { success, data: collection } = await read(Number(params.id), 20, 0)
    if (!success || !collection) notFound()
    const isAdmin = true //temp

    return (
        <div className={styles.wrapper}>
            {isAdmin &&
                <aside className={styles.admin}>
                    <CollectionAdmin collectionId={collection.id} />
                </aside>
            }
            <div className={styles.images}>
                <h1>{collection.name}</h1>
                <i>{collection.description}</i>
                <main>
                    <ImageCollectionList collection={collection} />
                </main>
            </div>
        </div>
    )
}
