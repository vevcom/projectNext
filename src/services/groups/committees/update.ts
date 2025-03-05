import { updateCommitteeValidation } from './validation'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import { ImageMethods } from '@/services/images/methods'
import type { ExpandedCommittee } from './Types'
import type { UpdateCommitteeTypes } from './validation'

export async function updateCommittee(
    id: number,
    rawdata: UpdateCommitteeTypes['Detailed']
): Promise<ExpandedCommittee> {
    const { name, shortName, logoImageId } = updateCommitteeValidation.detailedValidate(rawdata)

    let defaultLogoImageId: number
    if (!logoImageId) {
        defaultLogoImageId = await ImageMethods.readSpecial.client(prisma).execute({
            params: { special: 'DAFAULT_COMMITTEE_LOGO' }, session: null //TODO: pass session
        }).then(res => res.id)
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
