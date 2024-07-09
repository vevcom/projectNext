import type { userFieldsToExpose } from './ConfigVars'
import type { User } from '@prisma/client'

export type UserFiltered = Pick<User, typeof userFieldsToExpose[number]>

export type UserDetails = {
    groups: string[]
    partOfName: string
}

export type RegisterNewEmailType = {
    verified: boolean,
    email: string,
}

export type UserCursor = {
    id: number
}
