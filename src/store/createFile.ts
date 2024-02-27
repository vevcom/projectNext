import { join } from 'path'
import { mkdir, writeFile } from 'fs/promises'
import { v4 as uuid } from 'uuid'
import type { ActionReturn } from '@/actions/Types'
import type { StoreLocations } from './StoreLocations'

/**
 * Create a file in the store volume
 * @param file - file to upload to store
 * @param destination - destination folder in store like /images or /ombul
 * @param allowedExt - allowed file extensions like ['pdf', 'jpg', 'png'], 
 *                     if not provided all extensions are allowed
 * @param prosessor - a function to process the file before saving it to the store
 * @returns - either an error or the file location and ext. Its an ActionReturn
 */
export default async function createFile(
    file: File, 
    destination: StoreLocations, 
    allowedExt: string[] | undefined = undefined,
    prosessor: (buffer: Buffer) => Promise<Buffer> = async (buffer) => buffer,
) : Promise<ActionReturn<{
    fsLocation: string,
    ext: string
}>> {
    const arrBuffer = await file.arrayBuffer()
    let buffer = await prosessor(Buffer.from(arrBuffer))
    const ext = file.type.split('/')[1]
    if (allowedExt && !allowedExt.includes(ext)) {
        return {
            success: false, 
            error: [
                {
                    path: ['file'],
                    message: 'Invalid file type'
                }
            ]
        }
    }
    const fsLocation = `${uuid()}.${ext}`
    const destination_ = join('store', destination)
    await mkdir(destination_, { recursive: true })
    await writeFile(join(destination_, fsLocation), buffer)
    return {
        success: true,
        data: {
            fsLocation,
            ext
        }
    }
}