import type { Prisma } from '@/prisma-generated-pn-types'

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
