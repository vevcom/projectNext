import styles from './page.module.scss'
import MakeNewCollection from './MakeNewCollection'
import ImageCollectionList from './ImageCollectionList'
import ToggleShowAdminCollections from './ToggleShowAdminCollections'
import { DynamicImageCollectionPagingProvider } from '@/contexts/paging/DynamicImageCollectionPaging'
import CollectionCardLink from '@/components/Image/Collection/CollectionCardLink'
import { ServerSession } from '@/auth/session/ServerSession'
import { dynamicImageAuth } from '@/services/images/dynamic/auth'
import { readDynamicImageCollectionsPageAction } from '@/services/images/dynamic/actions'
import { QueryParams } from '@/lib/queryParams/queryParams'
import type { PageSizeDynamicImageCollection } from '@/contexts/paging/DynamicImageCollectionPaging'
import type { SearchParamsServerSide } from '@/lib/queryParams/types'

type PropTypes = SearchParamsServerSide

export default async function Images({ searchParams }: PropTypes) {
    const session = await ServerSession.fromNextAuth()
    const canCreateCollection = dynamicImageAuth.createCollection.dynamicFields({ }).auth(session)
    const pageSize: PageSizeDynamicImageCollection = 12

    const showOnlyCollectionsSessionAdministrates =
        QueryParams.onlyAdministratedCollections.decode(await searchParams) ?? false
    const details = { showOnlyCollectionsSessionAdministrates }

    const collectionPage = await readDynamicImageCollectionsPageAction({
        params: {
            paging: {
                page: {
                    pageSize,
                    page: 0,
                    cursor: null,
                },
                details,
            },
        },
    })

    if (!collectionPage.success) {
        throw collectionPage.error ? collectionPage.error[0].message : new Error('Unknown error')
    }

    const collections = collectionPage.data

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <DynamicImageCollectionPagingProvider
                    startPage={{
                        pageSize,
                        page: 1,
                    }}
                    details={details}
                    serverRenderedData={collections}
                >
                    <span className={styles.header}>
                        <h1>Fotogalleri</h1>
                        {canCreateCollection.authorized && <MakeNewCollection />}
                    </span>
                    <ToggleShowAdminCollections
                        showOnlyCollectionsSessionAdministrates={showOnlyCollectionsSessionAdministrates}
                    />
                    <ImageCollectionList
                        serverRendered={collections.map(collection => (
                            <CollectionCardLink key={collection.id} collection={collection} />
                        ))}
                    />
                </DynamicImageCollectionPagingProvider>
            </div>
        </div>
    )
}
