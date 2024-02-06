import type { User } from '@prisma/client'

export type ReturnType = Omit<User, 'password'>