import { UserConfig } from '@/services/users/config'
import type { Prisma } from '@prisma/client'

export namespace EventRegistrationConfig {

    export const includer = {
        user: {
            select: {
                ...UserConfig.filterSelection,
                image: true,
            },
        },
    } satisfies Prisma.EventRegistrationInclude
}
