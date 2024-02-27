import type { CmsImage, Image, Ombul } from '@prisma/client'

export type ExpandedOmbul = Ombul & {
    coverImage: CmsImage & {
        image: Image | null
    }
}