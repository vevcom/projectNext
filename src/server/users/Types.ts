import type { userFieldsToExpose } from './ConfigVars'
import type { OmegaMembershipLevel, User } from '@prisma/client'

export type UserFiltered = Pick<User, typeof userFieldsToExpose[number]>

export type StandardMembeships = {
    class?: number
    studyProgramme?: string
    membershipType?: OmegaMembershipLevel
}

export type UserPagingReturn = UserFiltered & StandardMembeships & {
    extraInfoOnMembership?: { //If extraInfoOnMembership is not null, this will be the extra info.
        title?: string
        admin?: boolean
    }
}

/**
 * Groups is an array of group ids and order. They will be ANDed together.
 * PartOfName is a string that is part of the name of the user.
 * selectedGroup will also filter on that group, but will also return extra
 * info about that membership.
 */
export type UserDetails = {
    groups: {
        groupId: number
        groupOrder: number | 'ACTIVE' //ACTIVE means take current order.
    }[]
    partOfName: string
    selectedGroup?: {
        groupId: number
        groupOrder: number | 'ACTIVE' //ACTIVE means take current order.
    }
}
