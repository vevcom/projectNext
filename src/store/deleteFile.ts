import { unlink } from 'fs/promises'
import { join } from 'path'
import type { ActionReturn } from '@/actions/Types'
import type { StoreLocations } from './StoreLocations'

function isErrorWithCode(error: any): error is { code: string } {
    return error && typeof error.code === 'string'
}

/**
 * Function to delete a file from the store
 * @param destination what part of the store to delete from
 * @param fsLocation the location of the file in the store to delete
 * @returns either an error or success in ActionReturn
 */
export default async function deleteFile(destination: StoreLocations, fsLocation: string): Promise<ActionReturn<void, false>> {
    const filePath = join('store', destination, fsLocation)
    try {
        await unlink(filePath)
        return {
            success: true
        }
    } catch (error) {
        if (isErrorWithCode(error) && error.code === 'ENOENT') {
            return {
                success: false,
                error: [{
                    message: 'Fil ikke funnet'
                }]
            }
        }
        throw error
    }
}
