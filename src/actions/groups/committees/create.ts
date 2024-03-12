'use server'
import { createCommitteeSchema } from './schema'
import { createPrismaActionError, createZodActionError } from '@/actions/error'
import prisma from '@/prisma'
import { createCmsImage } from '@/actions/cms/images/create'
import { z } from 'zod'
import type { ActionReturn } from '@/actions/Types'
import type { createCommitteeSchemaType } from './schema'
import type { Committee } from '@prisma/client'

export default async function createCommittee(
    committeeLogoImageId: number,
    rawdata: FormData | createCommitteeSchemaType
): Promise<ActionReturn<Committee>> {
    const parse = createCommitteeSchema.safeParse(rawdata)

    if (!parse.success) return createZodActionError(parse)

    const { name } = parse.data

    try {
        const committeLogo = await prisma.cmsImage.create({
            data: {
                name: `${name}_logo`,
                image: {
                    connect: {
                        id: committeeLogoImageId
                    }
                }
            }
        })

        const committee = await prisma.committee.create({
            data: {
                name,
                logoImage: {
                    connect: {
                        id: committeLogo.id
                    }
                }
            },
        })

        return { success: true, data: committee }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
