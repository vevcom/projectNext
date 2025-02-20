import type { Prisma } from '@prisma/client'

export const companyConfig = {
    relationIncluder: {
        logo: {
            include: {
                image: true
            }
        }
    } satisfies Prisma.CompanyInclude
} as const
