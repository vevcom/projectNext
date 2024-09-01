'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { createOmbul } from '@/services/ombul/create'
import { createOmbulValidation } from '@/services/ombul/validation'
import type { ActionReturn } from '@/actions/Types'
import type { Ombul } from '@prisma/client'
import type { CreateOmbulTypes } from '@/services/ombul/validation'

/**
 * Create a new Ombul.
 * @param rawData includes a pdf file with the ombul issue optionaly year and issueNumber
 * @param CoverImageId is the id of the Image that will be used as the cover of the ombul
 */
export async function createOmbulAction(rawdata: FormData | CreateOmbulTypes['Type']): Promise<ActionReturn<Ombul>> {
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
