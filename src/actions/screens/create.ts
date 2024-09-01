'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { createScreenValidation, type CreateScreenTypes } from '@/services/screens/validation'
import { createScreen } from '@/services/screens/create'
import { getUser } from '@/auth/getUser'
import type { Screen } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function createScreenAction(formdata: CreateScreenTypes['Type']): Promise<ActionReturn<Screen>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['SCREEN_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    const parse = createScreenValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createScreen(data))
}
