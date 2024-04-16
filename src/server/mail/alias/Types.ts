import type { Prisma } from "@prisma/client"


export type MailAliasExtended = Prisma.MailAliasGetPayload<{
    include: {
        groups: {
            include: {
                group: true,
            },
        },
        users: {
            include: {
                user: true,
            },
        },
        forwardsFrom: {
            include: {
                source: true,
            },
        },
        forwardsTo: {
            include: {
                drain: true,
            }
        },
        rawAddress: true,
    }
}>