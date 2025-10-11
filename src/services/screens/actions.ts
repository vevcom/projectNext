'use server'

import { createActionError, createZodActionError, safeServerCall } from '@/services/actionError'
import { RequirePermission } from '@/auth/auther/RequirePermission'
import { Session } from '@/auth/session/Session'
import { createScreen } from '@/services/screens/create'
import { destroyScreen } from '@/services/screens/destroy'
import { readScreen, readScreens } from '@/services/screens/read'
import { movePageInScreen, updateScreen } from '@/services/screens/update'
import { createScreenValidation, updateScreenValidation } from '@/services/screens/validation'
import type { ScreenPageMoveDirection } from '@/services/screens/Types'
import type { ActionReturn } from '@/services/actionTypes'
import type { CreateScreenTypes, UpdateScreenTypes } from '@/services/screens/validation'
import type { Screen } from '@prisma/client'

export const adminScreenAuther = RequirePermission.staticFields({ permission: 'SCREEN_ADMIN' })
export const readScreenAuther = RequirePermission.staticFields({ permission: 'SCREEN_READ' })

export async function createScreenAction(formdata: CreateScreenTypes['Type']): Promise<ActionReturn<Screen>> {
    const authRes = adminScreenAuther.dynamicFields({}).auth(await Session.fromNextAuth())
    if (!authRes.authorized) return createActionError(authRes.status)

    const parse = createScreenValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createScreen(data))
}

export async function destroyScreenAction(id: number): Promise<ActionReturn<void>> {
    const authRes = adminScreenAuther.dynamicFields({}).auth(await Session.fromNextAuth())
    if (!authRes.authorized) return createActionError(authRes.status)

    return await safeServerCall(() => destroyScreen(id))
}

export async function readScreenAction(id: number): Promise<ActionReturn<Screen>> {
    const authRes = readScreenAuther.dynamicFields({}).auth(await Session.fromNextAuth())
    if (!authRes.authorized) return createActionError(authRes.status)

    return await safeServerCall(() => readScreen(id))
}

export async function readScreensAction(): Promise<ActionReturn<Screen[]>> {
    const authRes = readScreenAuther.dynamicFields({}).auth(await Session.fromNextAuth())
    if (!authRes.authorized) return createActionError(authRes.status)

    return await safeServerCall(() => readScreens())
}

export async function updateScreenAction(id: number, formdata: UpdateScreenTypes['Type']): Promise<ActionReturn<Screen>> {
    const authRes = adminScreenAuther.dynamicFields({}).auth(await Session.fromNextAuth())
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
    const authRes = adminScreenAuther.dynamicFields({}).auth(await Session.fromNextAuth())
    if (!authRes.authorized) return createActionError(authRes.status)

    return await safeServerCall(() => movePageInScreen(id, direction))
}
