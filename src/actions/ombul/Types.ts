import type { Image, Ombul } from '@prisma/client'

export type ExpandedOmbul = Ombul & {
    coverImage: Image | null
}