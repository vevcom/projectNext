'use server'
import type { ActionReturn } from '@/actions/Types'

export async function updateVisibilityAction(
    level: 'REGULAR' | 'ADMIN',
    formdata: FormData
): Promise<ActionReturn<void>> {
    console.log(formdata)
    return { success: true, data: undefined }
}
