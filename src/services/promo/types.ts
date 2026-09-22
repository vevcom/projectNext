import type { Promo } from '@/prisma-generated-pn-types'
import type { ExpandedImage } from '@/services/images/subservice/types'

export type PromoWithImage = Promo & {
    image: ExpandedImage
}
