import { updateCommitteeValidation } from './validation'
import prisma from '@/prisma'
import { readSpecialImage } from '@/server/images/read'
import { prismaCall } from '@/server/prismaCall'
import type { ExpandedCommittee } from './Types'
import type { UpdateCommitteeTypes } from './validation'

export async function updateCommittee(
    id: number,
    rawdata: UpdateCommitteeTypes['Detailed']
): Promise<ExpandedCommittee> {
    const { name, shortName, logoImageId } = updateCommitteeValidation.detailedValidate(rawdata)

    let defaultLogoImageId: number
    if (!logoImageId) {
        defaultLogoImageId = (await readSpecialImage('DAFAULT_COMMITTEE_LOGO')).id
    }

    return await prismaCall(() => prisma.committee.update({
        where: {
            id,
        },
        data: {
            name,
            shortName,
            logoImage: {
                update: {
                    imageId: logoImageId ?? defaultLogoImageId,
                },
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
