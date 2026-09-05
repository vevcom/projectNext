import { expandedImageIncluder } from '@/services/images/subservice/constants'
import type { Prisma } from '@/prisma-generated-pn-types'

export const screenPageIncluder = {
    cmsImage: {
        include: {
            image: { include: expandedImageIncluder },
        }
    },
    cmsParagraph: true,
} as const satisfies Prisma.ScreenPageInclude
