import { createCommitteeSchema } from './schema'
import { createPrismaActionError, createZodActionError } from '@/actions/error'
import prisma from '@/prisma'
import { readSpecialImage } from '@/server/images/read'
import type { ActionReturn } from '@/actions/Types'
import type { CreateCommitteeSchemaType } from './schema'
import type { ExpandedCommittee } from './Types'

export async function createCommittee(data: CreateCommitteeSchemaType): Promise<ActionReturn<ExpandedCommittee>> {
    const parse = createCommitteeSchema.safeParse(data)

    if (!parse.success) return createZodActionError(parse)

    const { name, shortName } = parse.data
    let { logoImageId } = parse.data

    if (!logoImageId) {
        const defaultLogoRes = await readSpecialImage('DAFAULT_COMMITTEE_LOGO')

        if (!defaultLogoRes.success) return defaultLogoRes

        logoImageId = defaultLogoRes.data.id
    }

    try {
        const committee = await prisma.committee.create({
            data: {
                name,
                shortName,
                logoImage: {
                    create: {
                        name: `Komitélogoen til ${name}`,
                        image: {
                            connect: {
                                id: logoImageId,
                            },
                        },
                    },
                },
                group: {
                    create: {
                        groupType: 'COMMITTEE',
                        membershipRenewal: true,
                    }
                },
            },
            include: {
                logoImage: {
                    include: {
                        image: true,
                    },
                },
            },
        })

        return { success: true, data: committee }
    } catch (e) {
        return createPrismaActionError(e)
    }
}
