import type { User } from '@prisma/client'

export const userFieldsToExpose = ['id', 'username', 'email', 'createdAt', 'updatedAt'] as const
export type UserFiltered = Pick<User, typeof userFieldsToExpose[number]>
export type UserDetails = {
    groups: string[]
    partOfName: string
}