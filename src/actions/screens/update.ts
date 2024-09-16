'use server'
import { AdminScreenAuther } from './Authers'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { updateScreenValidation, type UpdateScreenTypes } from '@/services/screens/validation'
import { movePageInScreen, updateScreen } from '@/services/screens/update'
import { Session } from '@/auth/Session'
import type { Screen } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { ScreenPageMoveDirection } from '@/services/screens/Types'

export async function updateScreenAction(id: number, formdata: UpdateScreenTypes['Type']): Promise<ActionReturn<Screen>> {
    const authRes = AdminScreenAuther.dynamicFields({}).auth(await Session.fromNextAuth())
    if (!authRes.authorized) return createActionError(authRes.status)

    const parse = updateScreenValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateScreen(id, data))
}

export async function movePageInScreenAction(
    id: {screen: number, page: number},
    direction: ScreenPageMoveDirection
): Promise<ActionReturn<void>> {
    const authRes = AdminScreenAuther.dynamicFields({}).auth(await Session.fromNextAuth())
    if (!authRes.authorized) return createActionError(authRes.status)

    return await safeServerCall(() => movePageInScreen(id, direction))
}

