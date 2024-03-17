import prisma from '@/prisma'
import { readSpecialImage } from '@/server/images/read'
import { prismaCall } from '@/server/prismaCall'
import type { UpdateCommitteeSchemaType } from './schema'
import type { ExpandedCommittee } from './Types'

export async function updateCommittee(
    id: number,
    { name, shortName, logoImageId }: UpdateCommitteeSchemaType
): Promise<ExpandedCommittee> {
    if (!logoImageId) {
        logoImageId = (await readSpecialImage('DAFAULT_COMMITTEE_LOGO')).id
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
                    imageId: logoImageId,
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
