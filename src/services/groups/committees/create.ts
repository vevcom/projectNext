import { createCommitteeValidation } from './validation'
import prisma from '@/prisma'
import { readSpecialImage } from '@/services/images/read'
import { prismaCall } from '@/services/prismaCall'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import type { ExpandedCommittee } from './Types'
import type { CreateCommitteeTypes } from './validation'
import { createArticle } from '@/server/cms/articles/create'

export async function createCommittee(rawdata: CreateCommitteeTypes['Detailed']): Promise<ExpandedCommittee> {
    const { name, shortName, logoImageId } = createCommitteeValidation.detailedValidate(rawdata)
    let defaultLogoImageId: number
    if (!logoImageId) {
        defaultLogoImageId = (await readSpecialImage('DAFAULT_COMMITTEE_LOGO')).id
    }
    const article = await createArticle(
        {

        }
    )

    const order = (await readCurrentOmegaOrder()).order

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
                    order,
                }
            },
            committeeArticle: {
                connect: {
                    id: article.id
                }
            }
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
