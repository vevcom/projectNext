import { createActionError } from '@/actions/error'
import { unlink } from 'fs/promises'
import { join } from 'path'
import type { ActionReturn } from '@/actions/Types'
import type { StoreLocations } from './StoreLocations'

function isErrorWithCode(error: unknown): error is { code: string } {
    return typeof error === 'object' && error !== null && 'code' in error
}

/**
 * Function to delete a file from the store
 * @param destination what part of the store to delete from
 * @param fsLocation the location of the file in the store to delete
 * @returns either an error or success in ActionReturn
 */
export default async function deleteFile(
    destination: StoreLocations,
    fsLocation: string
): Promise<ActionReturn<void, false>> {
    const filePath = join('store', destination, fsLocation)
    try {
        await unlink(filePath)
        return {
            success: true
        }
    } catch (error) {
        if (isErrorWithCode(error) && error.code === 'ENOENT') {
            return createActionError('NOT FOUND', 'Fil ikke funnet')
        }
        throw error
    }
}
