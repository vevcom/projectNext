import type { Prisma } from '@prisma/client'

export namespace DotConfig {
    const baseDurationDays = 14
    export const baseDuration = 1000 * 60 * 60 * 24 * baseDurationDays
    export const wrapperWithDotsIncluder = {
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
}
