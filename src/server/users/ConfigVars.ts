import { createSelection } from '@/server/createSelection'
import type { Prisma, User } from '@prisma/client'

export const maxNumberOfGroupsInFilter = 7

export const userFieldsToExpose = [
    'id',
    'username',
    'firstname',
    'lastname',
    'email',
    'createdAt',
    'updatedAt',
    'acceptedTerms'
] satisfies (keyof User)[]
export const userFilterSelection = createSelection([...userFieldsToExpose])

export const standardMembershipSelection = [
    {
        group: {
            groupType: 'CLASS'
        }
    },
    {
        group: {
            groupType: 'OMEGA_MEMBERSHIP_GROUP'
        }
    },
    {
        group: {
            groupType: 'STUDY_PROGRAMME'
        }
    },
] satisfies Prisma.MembershipWhereInput[]
