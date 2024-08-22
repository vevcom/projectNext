'use server'
import { createScreenValidation } from '@/server/screens/validation'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { createActionError, createZodActionError } from '@/actions/error'
import { createPage } from '@/server/screens/pages/create'
import type { ScreenPage } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { CreateScreenTypes } from '@/server/screens/validation'

export async function createPageAction(formdata: CreateScreenTypes['Type']): Promise<ActionReturn<ScreenPage>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['SCREEN_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    const parse = createScreenValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createPage(data))
}
