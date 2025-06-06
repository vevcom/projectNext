import { UserConfig } from '@/services/users/config'
import type { Prisma } from '@prisma/client'

export namespace EventRegistrationConfig {

    export const selection = {
        user: {
            select: {
                ...UserConfig.filterSelection,
                image: true,
            },
        },
        contact: {
            select: {
                name: true,
            },
        }
    } satisfies Prisma.EventRegistrationSelect

    export const includerDetailed = {
        ...selection,
        contact: true,
    } satisfies Prisma.EventRegistrationInclude

    export enum REGISTRATION_READER_TYPE {
        REGISTRATIONS = 'REGISTRATIONS',
        WAITING_LIST = 'WAITING_LIST',
    }
}
