import { createCommitteeValidation } from './validation'
import prisma from '@/prisma'
import { readSpecialImage } from '@/server/images/read'
import { prismaCall } from '@/server/prismaCall'
import type { ExpandedCommittee } from './Types'
import type { CreateCommitteeTypes } from './validation'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'

export async function createCommittee(rawdata: CreateCommitteeTypes['Detailed']): Promise<ExpandedCommittee> {
    const { name, shortName, logoImageId } = createCommitteeValidation.detailedValidate(rawdata)
    let defaultLogoImageId: number
    if (!logoImageId) {
        defaultLogoImageId = (await readSpecialImage('DAFAULT_COMMITTEE_LOGO')).id
    }

    const order = (await readCurrenOmegaOrder()).order

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
                    order,
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
