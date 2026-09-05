import { userFilterSelection } from '@/services/users/constants'
import { expandedImageIncluder } from '@/services/images/subservice/constants'
import type { Prisma } from '@/prisma-generated-pn-types'

export const eventRegistrationSelection = {
    user: {
        select: {
            ...userFilterSelection,
            image: { include: expandedImageIncluder },
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
