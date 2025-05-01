import '@pn-server-only'
import { ServerError } from '@/services/error'
import { unlink } from 'fs/promises'
import { join } from 'path'
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
export async function destroyFile(
    destination: StoreLocations,
    fsLocation: string
): Promise<void> {
    const filePath = join('store', destination, fsLocation)
    try {
        await unlink(filePath)
    } catch (error) {
        if (isErrorWithCode(error) && error.code === 'ENOENT') {
            throw new ServerError('NOT FOUND', 'fil ikke funnet')
        }
        throw error
    }
}
