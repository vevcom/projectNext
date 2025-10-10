import type { Prisma } from '@prisma/client'

const dotBaseDurationDays = 14

export const dotBaseDuration = 1000 * 60 * 60 * 24 * dotBaseDurationDays

export const dotsIncluder = {
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
