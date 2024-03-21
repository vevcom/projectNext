import prisma from '@/prisma'
import { readSpecialImage } from '@/server/images/read'
import { prismaCall } from '@/server/prismaCall'
import { createCommitteeValidation } from './validation'
import type { ExpandedCommittee } from './Types'
import type { CreateCommitteeTypes } from './validation'

export async function createCommittee(rawdata: CreateCommitteeTypes['Type']): Promise<ExpandedCommittee> {
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
