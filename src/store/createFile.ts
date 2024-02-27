import { join } from 'path'
import { mkdir, writeFile } from 'fs/promises'
import { v4 as uuid } from 'uuid'
import type { ActionReturn } from '@/actions/Types'

type StoreLocations = 'images' | 'ombul'
/**
 * 
 * @param file - file to upload to store
 * @param destination - destination folder in store like /images or /ombul
 * @param allowedExt - allowed file extensions like ['pdf', 'jpg', 'png']
 * @returns - either an error or the file location. Its an ActionReturn
 */
export default async function createFile(
    file: File, 
    destination: StoreLocations, 
    allowedExt?: string[]
) : Promise<ActionReturn<string>> {
    const arrBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrBuffer)
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
        data: fsLocation
    }
}