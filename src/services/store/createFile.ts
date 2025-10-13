import '@pn-server-only'
import { ServerError } from '@/services/error'
import { v4 as uuid } from 'uuid'
import { join } from 'path'
import { mkdir, writeFile } from 'fs/promises'
import type { StoreLocations } from './types'

/**
 * Create a file in the store volume
 * @param file - file to upload to store
 * @param destination - destination folder in store like /images or /ombul
 * @param allowedExt - allowed file extensions like ['pdf', 'jpg', 'png'],
 *                     if not provided all extensions are allowed
 * @param prosessor - a function to process the file before saving it to the store
 * @returns - either an error or the file location and ext. Its an ActionReturn
 */
export async function createFile(
    file: File,
    destination: StoreLocations,
    allowedExt: string[] | undefined = undefined,
    prosessor: (buffer: Buffer) => Promise<Buffer> = async (buffer) => buffer,
): Promise<{
    fsLocation: string,
    ext: string
}> {
    const arrBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrBuffer)
    const ext = file.type.split('/')[1]
    if (allowedExt && !allowedExt.includes(ext)) {
        throw new ServerError('BAD PARAMETERS', [
            {
                path: ['file'],
                message: 'Invalid file type'
            }
        ])
    }

    const pBuffer = await prosessor(buffer)
    const fsLocation = `${uuid()}.${ext}`
    const destination_ = join('store', destination)
    await mkdir(destination_, { recursive: true })
    await writeFile(join(destination_, fsLocation), pBuffer)
    return {
        fsLocation,
        ext
    }
}
