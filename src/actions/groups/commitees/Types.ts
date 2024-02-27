import type { Commitee as PrismaCommittee, Group } from '@prisma/client'

export type Committe = PrismaCommittee & Pick<Group, 'name'>
