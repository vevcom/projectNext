import { expandedImageIncluder } from '@/services/images/subservice/constants'
import type { Prisma } from '@/prisma-generated-pn-types'

export const promoWithImageIncluder = {
    image: { include: expandedImageIncluder }
} satisfies Prisma.PromoInclude
