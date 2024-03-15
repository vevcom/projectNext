import { createPrismaActionError, createZodActionError } from "@/actions/error"
import { ExpandedCommittee } from "./Types"
import prisma from "@/prisma"
import { ActionReturn } from "@/actions/Types"
import { CreateCommitteeSchemaType, createCommitteeSchema } from "./schema"
import { readSpecialImage } from "@/server/images/read"

export async function createCommittee(data: CreateCommitteeSchemaType): Promise<ActionReturn<ExpandedCommittee>> {
    const parse = createCommitteeSchema.safeParse(data)

    if (!parse.success) return createZodActionError(parse)

    let { name, logoImageId } = parse.data
    
    if (!logoImageId) {
        const defaultLogoRes = await readSpecialImage('DAFAULT_COMMITTEE_LOGO')

        if (!defaultLogoRes.success) return defaultLogoRes

        logoImageId = defaultLogoRes.data.id
    }

    try {
        const committee = await prisma.committee.create({
            data: {
                name,
                logoImage: {
                    create: {
                        name: `Komitélogoen til ${name}`
                    }
                },
                group: {
                    create: {
                        groupType: 'COMMITTEE',
                        membershipRenewal: true,
                    }
                },
            }
        })

        return { success: true, data: committee }
    } catch(e) {
        return createPrismaActionError(e)
    }
}