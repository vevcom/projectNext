'use server'

import { createActionError, createZodActionError, safeServerCall } from '@/services/actionError'
import { getUser } from '@/auth/session/getUser'
import { createPage } from '@/services/screens/pages/create'
import { destroyPage } from '@/services/screens/pages/destroy'
import { readPage, readPages } from '@/services/screens/pages/read'
import { updatePage } from '@/services/screens/pages/update'
import { updatePageValidation } from '@/services/screens/pages/validation'
import { createScreenValidation } from '@/services/screens/validation'
import type { UpdatePageTypes } from '@/services/screens/pages/validation'
import type { ExpandedScreenPage } from '@/services/screens/pages/types'
import type { ActionReturn } from '@/services/actionTypes'
import type { CreateScreenTypes } from '@/services/screens/validation'
import type { ScreenPage } from '@prisma/client'

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

export async function destroyPageAction(id: number): Promise<ActionReturn<void>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCREEN_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => destroyPage(id))
}

export async function readPageAction(id: number): Promise<ActionReturn<ExpandedScreenPage>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCREEN_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readPage(id))
}

export async function readPagesAction(): Promise<ActionReturn<ScreenPage[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCREEN_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readPages())
}

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
