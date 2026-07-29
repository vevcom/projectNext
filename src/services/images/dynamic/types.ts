import type { dynamicImageSchemas } from './schemas'
import type { InferPagingCursor, InferPagingDetails } from '@/lib/paging/schema'

export type ImageCollectionCursor = InferPagingCursor<typeof dynamicImageSchemas.readCollectionPage>

export type ImageCollectionPagingDetails = InferPagingDetails<typeof dynamicImageSchemas.readCollectionPage>
