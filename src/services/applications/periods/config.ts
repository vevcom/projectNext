import type { Prisma } from '@prisma/client'

export const committeesParticipatingincluder = {
    committeesParticipating: {
        include: {
            committee: {
                include: {
                    logoImage: {
                        include: {
                            image: true
                        }
                    },
                    paragraph: true
                }
            }
        }
    }
} as const satisfies Prisma.ApplicationPeriodInclude
