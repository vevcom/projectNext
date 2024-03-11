import type { Image, CmsImage } from '@prisma/client'

export type ExpandedCmsImage = CmsImage & {
    image: Image | null
}
