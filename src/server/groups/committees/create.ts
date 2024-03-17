import prisma from '@/prisma'
import { readSpecialImage } from '@/server/images/read'
import { prismaCall } from '@/server/prismaCall'
import type { CreateCommitteeSchemaType } from './schema'
import type { ExpandedCommittee } from './Types'

export async function createCommittee({
    name,
    shortName,
    logoImageId
}: CreateCommitteeSchemaType): Promise<ExpandedCommittee> {
    if (!logoImageId) {
        logoImageId = (await readSpecialImage('DAFAULT_COMMITTEE_LOGO')).id
    }

    return await prismaCall(() => prisma.committee.create({
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
    }))
}
