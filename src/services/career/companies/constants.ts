import { expandedImageIncluder } from '@/services/images/subservice/constants'
import type { Prisma } from '@/prisma-generated-pn-types'

export const logoIncluder = {
    logo: {
        include: {
            image: { include: expandedImageIncluder }
        }
    }
} as const satisfies Prisma.CompanyInclude
