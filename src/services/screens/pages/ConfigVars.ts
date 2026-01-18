import type { Prisma } from '@/prisma-generated-pn-types'

export const screenPageIncluder = {
    cmsImage: {
        include: {
            image: true,
        }
    },
    cmsParagraph: true,
} as const satisfies Prisma.ScreenPageInclude
