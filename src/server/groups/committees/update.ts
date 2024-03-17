import { updateCommitteeSchema } from './schema'
import { createPrismaActionError, createZodActionError } from '@/actions/error'
import prisma from '@/prisma'
import { readSpecialImage } from '@/server/images/read'
import type { ActionReturn } from '@/actions/Types'
import type { UpdateCommitteeSchemaType } from './schema'
import type { ExpandedCommittee } from './Types'

export async function updateCommittee(
    id: number,
    data: UpdateCommitteeSchemaType
): Promise<ActionReturn<ExpandedCommittee>> {
    const parse = updateCommitteeSchema.safeParse(data)

    if (!parse.success) return createZodActionError(parse)

    const { name } = parse.data
    let { logoImageId } = parse.data

    if (!logoImageId) {
        const defaultLogoRes = await readSpecialImage('DAFAULT_COMMITTEE_LOGO')

        if (!defaultLogoRes.success) return defaultLogoRes

        logoImageId = defaultLogoRes.data.id
    }

    try {
        const committee = await prisma.committee.update({
            where: {
                id,
            },
            data: {
                name,
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
        })

        return { success: true, data: committee }
    } catch (e) {
        return createPrismaActionError(e)
    }
}
