'use server'
import { createZodActionError, safeServerCall } from '@/services/actionError'
import { createScreen } from '@/services/screens/create'
import { destroyScreen } from '@/services/screens/destroy'
import { readScreen, readScreens } from '@/services/screens/read'
import { movePageInScreen, updateScreen } from '@/services/screens/update'
import { createScreenValidation, updateScreenValidation } from '@/services/screens/validation'
import type { ScreenPageMoveDirection } from '@/services/screens/types'
import type { ActionReturn } from '@/services/actionTypes'
import type { CreateScreenTypes, UpdateScreenTypes } from '@/services/screens/validation'
import type { Screen } from '@/prisma-generated-pn-types'

export async function createScreenAction(formdata: CreateScreenTypes['Type']): Promise<ActionReturn<Screen>> {
    const parse = createScreenValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createScreen(data))
}

export async function destroyScreenAction(id: number): Promise<ActionReturn<void>> {
    return await safeServerCall(() => destroyScreen(id))
}

export async function readScreenAction(id: number): Promise<ActionReturn<Screen>> {
    return await safeServerCall(() => readScreen(id))
}

export async function readScreensAction(): Promise<ActionReturn<Screen[]>> {
    return await safeServerCall(() => readScreens())
}

export async function updateScreenAction(id: number, formdata: UpdateScreenTypes['Type']): Promise<ActionReturn<Screen>> {
    const parse = updateScreenValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateScreen(id, data))
}

export async function movePageInScreenAction(
    id: {screen: number, page: number},
    direction: ScreenPageMoveDirection
): Promise<ActionReturn<void>> {
    return await safeServerCall(() => movePageInScreen(id, direction))
}
