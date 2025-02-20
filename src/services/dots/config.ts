import type { Prisma } from '@prisma/client'

export const dotConfig = {
    baseDuration: 1000 * 60 * 60 * 24 * 14, // 14 days
    wrapperWithDotsIncluder: {
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
    } satisfies Prisma.DotWrapperInclude,
} as const
