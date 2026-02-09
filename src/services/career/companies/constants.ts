import type { Prisma } from '@/prisma-generated-pn-types'

export const logoIncluder = {
    logo: {
        include: {
            image: true
        }
    }
} as const satisfies Prisma.CompanyInclude
