'use server'
import type { ActionReturn } from '@/actions/Types'
import { VisibilityLevelType } from '@/server/visibility/Types'

export async function updateVisibilityAction(
    level: VisibilityLevelType,
    formdata: FormData
): Promise<ActionReturn<void>> {
    console.log(formdata)
    return { success: true, data: undefined }
}
