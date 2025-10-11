import type { Prisma } from '@prisma/client'

export const logoIncluder = {
    logo: {
        include: {
            image: true
        }
    }
} as const satisfies Prisma.CompanyInclude
