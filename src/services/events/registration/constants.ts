import { userFilterSelection } from '@/services/users/constants'
import type { Prisma } from '@prisma/client'

export const eventRegistrationSelection = {
    user: {
        select: {
            ...userFilterSelection,
            image: true,
        },
    },
    contact: {
        select: {
            name: true,
        },
    }
} satisfies Prisma.EventRegistrationSelect

export const eventRegistrationIncluderDetailed = {
    ...eventRegistrationSelection,
    contact: true,
} satisfies Prisma.EventRegistrationInclude

export enum REGISTRATION_READER_TYPE {
    REGISTRATIONS = 'REGISTRATIONS',
    WAITING_LIST = 'WAITING_LIST',
}
