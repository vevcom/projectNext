import prisma from '@/prisma'
import { readSpecialImage } from '@/server/images/read'
import { prismaCall } from '@/server/prismaCall'
import { createCommitteeValidation } from '@/server/groups/committees/schema'
import type { ExpandedCommittee } from './Types'
import type { CreateCommitteeType } from '@/server/groups/committees/schema'

export async function createCommittee(rawdata: CreateCommitteeType): Promise<ExpandedCommittee> {
    const { name, shortName, logoImageId } = createCommitteeValidation.detailedValidate(rawdata)
    let defaultLogoImageId: number
    if (!logoImageId) {
        defaultLogoImageId = (await readSpecialImage('DAFAULT_COMMITTEE_LOGO')).id
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
                            id: logoImageId ?? defaultLogoImageId,
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
