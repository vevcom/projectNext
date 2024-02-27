import type { CmsImage, Ombul } from '@prisma/client'

export type ExpandedOmbul = Ombul & {
    coverImage: CmsImage
}