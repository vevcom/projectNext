import { userFilterSelection } from '@/services/users/constants'
import { expandedImageIncluder } from '@/services/images/subservice/constants'
import type { Prisma } from '@/prisma-generated-pn-types'

export const committeeLogoIncluder = {
    logoImage: { include: expandedImageIncluder }
} satisfies Prisma.CommitteeInclude

export const membershipIncluder = {
    user: {
        select: {
            ...userFilterSelection,
            image: { include: expandedImageIncluder }
        }
    }
} satisfies Prisma.MembershipInclude

export const committeeExpandedIncluder = {
    ...committeeLogoIncluder,
    committeeArticle: {
        include: {
            coverImage: {
                include: {
                    image: { include: expandedImageIncluder },
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
