import type { Prisma } from '@prisma/client'

export namespace CompanyConfig {
    export const relationIncluder = {
        logo: {
            include: {
                image: true
            }
        }
    } as const satisfies Prisma.CompanyInclude
}
