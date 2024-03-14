'use server'

import 'server-only'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import { createstudyProgrammeSchema } from './schema'
import { createZodActionError } from '@/actions/error'
import { createGroup } from '@/actions/groups/create'
import type { CreatestudyProgrammeSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedstudyProgramme } from './Types'

export async function createstudyProgramme(
    rawData: FormData | CreatestudyProgrammeSchemaType
): Promise<ActionReturn<ExpandedstudyProgramme>> {
    const parse = createstudyProgrammeSchema.safeParse(rawData)

    if (!parse.success) {
        return createZodActionError(parse)
    }

    const { name } = parse.data

    const createGroupRes = await createGroup('STUDY_PROGRAMME', {
        membershipRenewal: true,
        name,
        details: {
            // TODO - Add details for study prog
        }
    })

    if (!createGroupRes.success) {
        return createGroupRes
    }

    return {
        success: true,
        data: createGroupRes.data
    }
}
