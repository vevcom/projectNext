import { userFilterSelection } from '@/services/users/constants'
import type { Prisma } from '@/prisma-generated-pn-types'

export const committeeLogoIncluder = {
    logoImage: {
        include: {
            image: true
        }
    }
} satisfies Prisma.CommitteeInclude

export const membershipIncluder = {
    user: {
        select: {
            ...userFilterSelection,
            image: true
        }
    }
} satisfies Prisma.MembershipInclude

export const committeeExpandedIncluder = {
    ...committeeLogoIncluder,
    committeeArticle: {
        include: {
            coverImage: {
                include: {
                    image: true,
                }
            }
        }
    },
    group: {
        include: {
            memberships: {
                include: membershipIncluder,
                where: {
                    active: true,
                }
            }
        }
    }
} satisfies Prisma.CommitteeInclude
