'use client'
import CollectionAdmin from './CollectionAdmin'
import ImagePanel from '@/components/Image/ImagePanel/ImagePanel'
import { readImagesPageInDynamicCollectionAction } from '@/services/images/dynamic/actions'
import { useCallback, useState } from 'react'
import type { ImagePanelCursor } from '@/components/Image/ImagePanel/ImagePanel'
import type { Page } from '@/lib/paging/types'
import type { ExpandedImageCollection } from '@/services/images/subservice/types'
import type { DoubleLevelVisibilityMatrix } from '@/services/visibility/types'

const pageSize = 30

type PropTypes = {
    collection: ExpandedImageCollection,
    doubleLevelVisibility: DoubleLevelVisibilityMatrix,
}

/**
 * The client bridge between the server rendered collection page and the ImagePanel: binds the
 * collection into the dynamic pager (a lambda the server page cannot create itself) with a stable
 * identity per collection, and renders the collection admin beside the panel. Uploads remount the
 * panel through its key, since new images invalidate every loaded page.
 */
export default function DynamicCollectionPanel({ collection, doubleLevelVisibility }: PropTypes) {
    const [panelGeneration, setPanelGeneration] = useState(0)

    const readPageOfImagesInCollectionAction = useCallback(
        (page: Page<typeof pageSize, ImagePanelCursor>) =>
            readImagesPageInDynamicCollectionAction({
                params: {
                    paging: { page },
                    collectionId: collection.id,
                },
            }),
        [collection.id]
    )

    return (
        <>
            <main>
                <ImagePanel
                    key={panelGeneration}
                    readPageOfImagesInCollectionAction={readPageOfImagesInCollectionAction}
                    pageSize={pageSize}
                    withImageDisplay
                />
            </main>
            <CollectionAdmin
                collection={collection}
                doubleLevelVisibility={doubleLevelVisibility}
                refreshImages={() => setPanelGeneration(generation => generation + 1)}
            />
        </>
    )
}
