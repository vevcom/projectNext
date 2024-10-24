import type { Prisma } from '@prisma/client'

export const CompanyRelationIncluder = {
    logo: {
        include: {
            image: true
        }
    }
} as const satisfies Prisma.CompanyInclude
