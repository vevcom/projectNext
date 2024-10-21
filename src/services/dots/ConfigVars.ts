import type { Prisma } from '@prisma/client'

export const DOT_BASE_DURATION = 1000 * 60 * 60 * 24 * 14 // 14 days

export const DotWrapperWithDotsIncluder = {
    dots: {
        orderBy: {
            expiresAt: 'desc'
        }
    },
    user: {
        select: {
            firstname: true,
            lastname: true,
            username: true
        }
    },
    accuser: {
        select: {
            firstname: true,
            lastname: true,
            username: true
        }
    }
} as const satisfies Prisma.DotWrapperInclude
