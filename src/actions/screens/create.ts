'use server'
import { safeServerCall } from '../safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { createPageValidation } from '@/server/screens/pages/validation'
import { createScreen } from '@/server/screens/create'
import { getUser } from '@/auth/getUser'
import type { UpdateScreenTypes } from '@/server/screens/validation'
import type { Screen } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function createScreenAction(formdata: UpdateScreenTypes['Type']): Promise<ActionReturn<Screen>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['SCREEN_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    const parse = createPageValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createScreen(data))
}
