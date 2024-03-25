import type { userFieldsToExpose } from './ConfigVars'
import type { User } from '@prisma/client'

export type UserFiltered = Pick<User, typeof userFieldsToExpose[number]>

/**
 * Groups is an array of group ids and order. They will be ANDed together.
 * PartOfName is a string that is part of the name of the user.
 */
export type UserDetails = {
    groups: {
        groupId: number
        groupOrder: number | null //null means take current order.
    }[]
    partOfName: string
}
