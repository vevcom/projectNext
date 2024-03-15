'use server'
import { createOmbulSchema } from './schema'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { createOmbul } from '@/server/ombul/create'
import type { ActionReturn } from '@/actions/Types'
import type { Ombul } from '@prisma/client'
import type { CreateOmbulSchemaType } from './schema'

/**
 * Create a new Ombul.
 * @param rawData includes a pdf file with the ombul issue optionaly year and issueNumber
 * @param CoverImageId is the id of the Image that will be used as the cover of the ombul
 */
export async function createOmbulAction(rawdata: FormData | CreateOmbulSchemaType): Promise<ActionReturn<Ombul>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['OMBUL_CREATE']]
    })
    if (!authorized) {
        return createActionError(status)
    }

    const parse = createOmbulSchema.safeParse(rawdata)
    if (!parse.success) {
        return createZodActionError(parse)
    }
    const { ombulFile, ombulCoverImage, ...data } = parse.data

    return await createOmbul(ombulFile, ombulCoverImage, data)
}
