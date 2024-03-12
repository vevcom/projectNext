import type { User } from '@prisma/client'
import { userFieldsToExpose } from './ConfigVars'

export type UserFiltered = Pick<User, typeof userFieldsToExpose[number]>

export type UserDetails = {
    groups: string[]
    partOfName: string
}
