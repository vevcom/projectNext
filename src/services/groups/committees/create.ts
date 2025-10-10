import { createCommitteeValidation } from './validation'
import { prisma } from '@/prisma/client'
import { prismaCall } from '@/services/prismaCall'
import { createArticle } from '@/services/cms/articles/create'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { createCmsParagraph } from '@/services/cms/paragraphs/create'
import { imageOperations } from '@/services/images/operations'
import { GroupType } from '@prisma/client'
import type { ExpandedCommittee } from './Types'
import type { CreateCommitteeTypes } from './validation'

export async function createCommittee(rawdata: CreateCommitteeTypes['Detailed']): Promise<ExpandedCommittee> {
    const { name, shortName, logoImageId } = createCommitteeValidation.detailedValidate(rawdata)
    let defaultLogoImageId: number
    if (!logoImageId) {
        defaultLogoImageId = await imageOperations.readSpecial({
            params: { special: 'DAFAULT_COMMITTEE_LOGO' }, //TODO: pass session
        }).then(res => res.id)
    }
    const article = await createArticle({})

    const paragraph = await createCmsParagraph({ name: `Paragraph for ${name}` })
    const applicationParagraph = await createCmsParagraph({ name: `Søknadstekst for ${name}` })

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
            paragraph: {
                connect: {
                    id: paragraph.id,
                }
            },
            group: {
                create: {
                    groupType: GroupType.COMMITTEE,
                    order,
                }
            },
            committeeArticle: {
                connect: {
                    id: article.id
                }
            },
            applicationParagraph: {
                connect: {
                    id: applicationParagraph.id
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
