import crypto from 'crypto'

type BufferEncoding =
    | 'ascii'
    | 'utf8'
    | 'utf-8'
    | 'utf16le'
    | 'utf-16le'
    | 'ucs2'
    | 'ucs-2'
    | 'base64'
    | 'base64url'
    | 'latin1'
    | 'binary'
    | 'hex';

export type EncrypterConfig = {
    algorithm: string,
    ivLength: number,
    keyEncoding: BufferEncoding,
    inputEncoding: BufferEncoding,
    outputEncoding: BufferEncoding,
}

export const defaultEncrypterConfig: EncrypterConfig = {
    algorithm: 'aes-256-cbc',
    ivLength: 16,
    keyEncoding: 'base64',
    inputEncoding: 'utf8',
    outputEncoding: 'base64',
}

/**
 * A encrypter returns methods to encrypt and decrypt data. You pass it the config you
 * want to use in the encryption and decryption.
 * @param key - The key to use for encryption.
 * @param config - The configuration for the encryption.
 * @returns Methods to encrypt and decrypt data.
 */
export function encrypter(key: string, {
    algorithm,
    ivLength,
    keyEncoding,
    inputEncoding,
    outputEncoding
}: EncrypterConfig = defaultEncrypterConfig) {
    return {
        encrypt: (data: string) => {
            const initializationVector = crypto.randomBytes(ivLength)
            const encryptionKeyBuffer = Buffer.from(key, keyEncoding)

            const cipher = crypto.createCipheriv(
                algorithm,
                encryptionKeyBuffer,
                initializationVector,
            )

            const passwordHashBuffer = Buffer.from(data, inputEncoding)

            // We need the IV to decrypt the hash, so we'll store it at the beginning of the encryption output.
            const encrypted = Buffer.concat([
                initializationVector,
                cipher.update(passwordHashBuffer),
                cipher.final(),
            ])

            return encrypted.toString(outputEncoding)
        },
        decrypt: (encryptedData: string) => {
            const encrypted = Buffer.from(encryptedData, outputEncoding)

            const initializationVector = encrypted.subarray(0, ivLength)
            const encryptedDataBuffer = encrypted.subarray(ivLength)

            const encryptionKeyBuffer = Buffer.from(key, keyEncoding)

            const decipher = crypto.createDecipheriv(
                algorithm,
                encryptionKeyBuffer,
                initializationVector,
            )

            const decrypted = Buffer.concat([
                decipher.update(encryptedDataBuffer),
                decipher.final(),
            ])

            return decrypted.toString(inputEncoding)
        }
    }
}
