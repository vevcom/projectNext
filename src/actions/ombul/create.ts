'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { createOmbul } from '@/server/ombul/create'
import type { ActionReturn } from '@/actions/Types'
import type { Ombul } from '@prisma/client'
import { createOmbulValidation } from '@/server/ombul/schema'
import type { CreateOmbulType } from '@/server/ombul/schema'

/**
 * Create a new Ombul.
 * @param rawData includes a pdf file with the ombul issue optionaly year and issueNumber
 * @param CoverImageId is the id of the Image that will be used as the cover of the ombul
 */
export async function createOmbulAction(rawdata: FormData | CreateOmbulType): Promise<ActionReturn<Ombul>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['OMBUL_CREATE']]
    })
    if (!authorized) return createActionError(status)

    const parse = createOmbulValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createOmbul(data))
}
