'use server'
import type { VisibilityLevelType } from '@/services/visibility/Types'
import type { ActionReturn } from '@/actions/Types'

export async function updateVisibilityAction(
    level: VisibilityLevelType,
    formdata: FormData
): Promise<ActionReturn<void>> {
    console.log(formdata)
    return { success: true, data: undefined }
}
