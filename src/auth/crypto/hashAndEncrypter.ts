import { hasher } from './hasher'
import { encrypter } from './encrypter'
import { ServerError } from '@/server/error'
import type { EncrypterConfig } from './encrypter'

export function hashAndEncrypter(
    salt: string | undefined,
    encryptionKey: string | undefined,
    encrypterConfig: EncrypterConfig | undefined = undefined
) {
    if (!salt || !Number(salt)) {
        throw new ServerError('SERVER ERROR', 'Serveren manger config')
    }
    if (!encryptionKey) {
        throw new ServerError('SERVER ERROR', 'Serveren manger config')
    }
    const { hash, compare } = hasher(Number(salt))
    const { encrypt, decrypt } = encrypter(encryptionKey, encrypterConfig)
    return {
        hashAndEncrypt: async (data: string) => {
            const hashed = await hash(data)
            return encrypt(hashed)
        },
        decryptAndCompare: async (data: string, encryptedData: string) => {
            const decrypted = decrypt(encryptedData)
            return compare(data, decrypted)
        }
    }
}
