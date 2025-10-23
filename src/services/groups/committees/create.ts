import { createCommitteeValidation } from './validation'
import { prisma } from '@/prisma/client'
import { prismaCall } from '@/services/prismaCall'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { imageOperations } from '@/services/images/operations'
import { cmsParagraphOperations } from '@/cms/paragraphs/operations'
import { GroupType } from '@prisma/client'
import type { ExpandedCommittee } from './types'
import type { CreateCommitteeTypes } from './validation'
import { createArticle } from '@/services/cms/articles/create'

export async function createCommittee(rawdata: CreateCommitteeTypes['Detailed']): Promise<ExpandedCommittee> {
    const { name, shortName, logoImageId } = createCommitteeValidation.detailedValidate(rawdata)
    let defaultLogoImageId: number
    if (!logoImageId) {
        defaultLogoImageId = await imageOperations.readSpecial({
            params: { special: 'DAFAULT_COMMITTEE_LOGO' }, //TODO: pass session
        }).then(res => res.id)
    }
    const article = await createArticle({})

    const paragraph = await cmsParagraphOperations.create({
        data: { name: `Paragraph for ${name}` },
        bypassAuth: true
    })
    const applicationParagraph = await cmsParagraphOperations.create({
        data: { name: `Søknadstekst for ${name}` },
        bypassAuth: true
    })

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
