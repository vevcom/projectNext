import type { userFieldsToExpose } from './constants'
import type { MembershipFiltered } from '@/services/groups/memberships/types'
import type { OmegaMembershipLevel, User, Image, Permission } from '@/prisma-generated-pn-types'

export type UserFiltered = Pick<User, typeof userFieldsToExpose[number]>

export type StandardMembeships = {
    class?: number
    studyProgramme?: string
    membershipType?: OmegaMembershipLevel
}

export type UserPagingReturn = UserFiltered & StandardMembeships & {
    selectedGroupInfo?: {
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

export type RegisterNewEmailType = {
    verified: boolean,
    email: string,
}

export type UserCursor = {
    id: number
}

export type Profile = {
    user: UserFiltered & { image: Image, bio: string },
    memberships: MembershipFiltered[],
    permissions: Permission[],
}
