import { UserConfig } from '@/services/users/config'
import type { Prisma } from '@prisma/client'


export namespace CommitteeConfig {

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
                ...UserConfig.filterSelection,
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
}
