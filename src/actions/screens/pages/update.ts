'use server'
import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { updatePage } from '@/services/screens/pages/update'
import { updatePageValidation } from '@/services/screens/pages/validation'
import type { UpdatePageTypes } from '@/services/screens/pages/validation'
import type { ActionReturn } from '@/actions/Types'
import type { ScreenPage } from '@prisma/client'

export async function updatePageAction(id: number, formdata: UpdatePageTypes['Type']): Promise<ActionReturn<ScreenPage>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCREEN_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    const parse = updatePageValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updatePage(id, data))
}
