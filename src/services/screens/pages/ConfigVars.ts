import type { Prisma } from '@prisma/client'

export const screenPageIncluder = {
    cmsImage: {
        include: {
            image: true,
        }
    },
    cmsParagraph: true,
} as const satisfies Prisma.ScreenPageInclude
