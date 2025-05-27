import type { Prisma } from '@prisma/client'

export namespace ApplicationPeriodConfig {
    export const includer = {
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
}
