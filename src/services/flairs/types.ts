import type { Flair } from '@/prisma-generated-pn-types'
import type { ExpandedImage } from '@/services/images/subservice/types'

export type FlairWithImage = Pick<Flair, 'id'> & {
    image: ExpandedImage
}
