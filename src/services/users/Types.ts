import type { MembershipFiltered } from '@/services/groups/memberships/Types'
import type { UserConfig } from './config'
import type { Image, OmegaMembershipLevel, Permission, Prisma } from '@prisma/client'

export type UserNameFiltered = Prisma.UserGetPayload<{
    select: typeof UserConfig.filterNameSelection
}>
export type UserContactInfoFiltered = Prisma.UserGetPayload<{
    select: typeof UserConfig.filterContactInfoSelection
}>
export type UserProfileFiltered = Prisma.UserGetPayload<{
    select: typeof UserConfig.filterProfileSelection
}>
export type UserAuthFiltered = Prisma.UserGetPayload<{
    select: typeof UserConfig.filterAuthSelection
}>
export type UserAllFiltered = Prisma.UserGetPayload<{
    select: typeof UserConfig.filterAllSelection
}>

export type StandardMembeships = {
    class?: number
    studyProgramme?: string
    membershipType?: OmegaMembershipLevel
}

export type UserPagingReturn = UserNameFiltered & StandardMembeships & {
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
    user: Omit<UserProfileFiltered, 'image'> & { image: Image },
    memberships: MembershipFiltered[],
    permissions: Permission[],
}
