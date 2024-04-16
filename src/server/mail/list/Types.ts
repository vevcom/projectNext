import type { Prisma } from "@prisma/client"

export type MailingListExtended = Prisma.MailingListGetPayload<{
    include: {
        mailAliases: {
            include: {
                mailAlias: true,
            },
        },
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
        rawMailAddresses: {
            include: {
                rawMailAddress: true,
            },
        },
    }
}>