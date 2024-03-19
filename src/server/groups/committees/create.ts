import prisma from '@/prisma'
import { readSpecialImage } from '@/server/images/read'
import { prismaCall } from '@/server/prismaCall'
import type { ExpandedCommittee } from './Types'
import { createCommitteeValidation } from '@/server/groups/committees/schema'
import type { CreateCommitteeType } from '@/server/groups/committees/schema'

export async function createCommittee(rawdata: CreateCommitteeType): Promise<ExpandedCommittee> {
    let { name, shortName, logoImageId } = createCommitteeValidation.detailedValidate(rawdata)
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
