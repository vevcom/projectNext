import type { dynamicImageSchemas } from './schemas'
import type { InferPagingCursor } from '@/lib/paging/schema'

export type ImageCollectionCursor = InferPagingCursor<typeof dynamicImageSchemas.readCollectionPage>
