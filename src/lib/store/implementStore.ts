import '@pn-server-only'
import { ServerError } from '@/services/error'
import { v4 as uuid } from 'uuid'
import { mkdir, unlink, writeFile } from 'fs/promises'
import { join } from 'path'
import type { File } from 'buffer'

type StoreConfig = {
    staticStorePrefix: string,
    allowedExtentions: string[]
}

/**
 * This implements the store and lets a service use the store. The staticStorePrefix is where the service will store
 * its files in the store volume. The allowedExtentions is used to validate the file type before storing it.
 *
 * The implementation exposes two functions, createFile and destroyFile, that the service can use to create and
 * destroy files in the store.
 *
 * createFile takes a File, validates it, and stores it in the store volume.
 * It returns the fsLocation and ext of the stored file.
 * destroyFile takes the fsLocation of a file and deletes it from the store volume.
 */
export function implementStore(config: StoreConfig) {
    async function createFile(
        file: File,
        allowedExt: string[] | undefined = config.allowedExtentions,
        prosessor: (buffer: Buffer) => Promise<Buffer> = async (buffer) => buffer,
        dynamicStorePrefix?: string,
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

        const processedBuffer = await prosessor(buffer)
        const fsLocation = `${uuid()}.${ext}`
        const destination = dynamicStorePrefix
            ? join('store', config.staticStorePrefix, dynamicStorePrefix)
            : join('store', config.staticStorePrefix)
        await mkdir(destination, { recursive: true })
        await writeFile(join(destination, fsLocation), processedBuffer)
        return {
            fsLocation,
            ext
        }
    }

    async function destroyFile(
        fsLocation: string,
        dynamicStorePrefix?: string
    ): Promise<void> {
        const filePath = dynamicStorePrefix
            ? join('store', config.staticStorePrefix, dynamicStorePrefix, fsLocation)
            : join('store', config.staticStorePrefix, fsLocation)
        try {
            await unlink(filePath)
        } catch (error) {
            if (isErrorWithCode(error) && error.code === 'ENOENT') {
                throw new ServerError('NOT FOUND', 'Filen du forsøkte å finne ble ikke funnet')
            }
            throw error
        }
    }

    return {
        createFile,
        destroyFile,
    } as const
}

function isErrorWithCode(error: unknown): error is { code: string } {
    return typeof error === 'object' && error !== null && 'code' in error
}
