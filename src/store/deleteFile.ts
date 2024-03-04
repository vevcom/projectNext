import type { StoreLocations } from "./StoreLocations";
import { unlink } from "fs/promises";
import { join } from "path";

function isErrorWithCode(error: any): error is { code: string } {
    return error && typeof error.code === 'string';
}

/**
 * @param destination what part of the store to delete from
 * @param fsLocation the location of the file in the store to delete
 * @returns void function that deletes the file from the store throws error 
 * if file does not exist
 */
export default async function deleteFile(destination: StoreLocations, fsLocation: string) {
    const filePath = join('store', destination, fsLocation)
    try {
        await unlink(filePath)
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