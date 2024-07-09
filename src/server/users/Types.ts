import type { BasicMembership } from '@/server/groups/Types'
import type { userFieldsToExpose } from './ConfigVars'
import type { Image, Permission, User } from '@prisma/client'

export type UserFiltered = Pick<User, typeof userFieldsToExpose[number]>

export type UserDetails = {
    groups: string[]
    partOfName: string
}

export type UserCursor = {
    id: number
}

export type Profile = {
    user: UserFiltered & { image: Image | null, bio: string },
    memberships: BasicMembership[],
    permissions: Permission[]
}
