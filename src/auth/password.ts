import 'server-only'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const ENCRYPTION_ALGORITHM = 'aes-256-cbc'
const IV_LENGTH = 16 // IV = Initalization Vector

const ENCRYPTION_KEY_ENCONDING = 'base64'
const ENCRYPTION_INPUT_ENCODING = 'utf-8'
const ENCRYPTION_OUTPUT_ENCODING = 'base64'

/**
 * Encrypts a password hash for safe storage.
 *
 * @param passwordHash The password hash to encrypt.
 * @returns Encrypted password hash.
 */
function encryptPasswordHash(passwordHash: string): string {
    if (!process.env.PASSWORD_ENCRYPTION_KEY) {
        throw new Error('PASSWORD_ENCRYPTION_KEY is not set.')
    }

    const initializationVector = crypto.randomBytes(IV_LENGTH)
    const encryptionKeyBuffer = Buffer.from(process.env.PASSWORD_ENCRYPTION_KEY, ENCRYPTION_KEY_ENCONDING)

    const cipher = crypto.createCipheriv(
        ENCRYPTION_ALGORITHM,
        encryptionKeyBuffer,
        initializationVector,
    )

    const passwordHashBuffer = Buffer.from(passwordHash, ENCRYPTION_INPUT_ENCODING)

    // We need the IV to decrypt the hash, so we'll store it at the beginning of the encryption output.
    const encrypted = Buffer.concat([
        initializationVector,
        cipher.update(passwordHashBuffer),
        cipher.final(),
    ])

    return encrypted.toString(ENCRYPTION_OUTPUT_ENCODING)
}

/**
 * Decrypts an encrypted password hash.
 *
 * @param encryptedPasswordHash Encrypted password hash to decrypt.
 * @returns Decrypted password hash.
 */
function decryptPasswordHash(encryptedPasswordHash: string): string {
    if (!process.env.PASSWORD_ENCRYPTION_KEY) {
        throw new Error('PASSWORD_ENCRYPTION_KEY is not set.')
    }

    const encrypted = Buffer.from(encryptedPasswordHash, ENCRYPTION_OUTPUT_ENCODING)

    const initializationVector = encrypted.subarray(0, IV_LENGTH)
    const encryptedPasswordHashBuffer = encrypted.subarray(IV_LENGTH)

    const encryptionKeyBuffer = Buffer.from(process.env.PASSWORD_ENCRYPTION_KEY, ENCRYPTION_KEY_ENCONDING)

    const decipher = crypto.createDecipheriv(
        ENCRYPTION_ALGORITHM,
        encryptionKeyBuffer,
        initializationVector
    )

    const decrypted = Buffer.concat([
        decipher.update(encryptedPasswordHashBuffer),
        decipher.final()
    ])

    return decrypted.toString(ENCRYPTION_INPUT_ENCODING)
}

/**
 * Wrapper for the bcrypt `hash` function.
 * In addition, it encrypts the password for safe storage.
 *
 * @param password The password to be hashed.
 * @returns Encrypted and hashed password string.
 */
export async function hashPassword(password: string) {
    if (!Number(process.env.PASSWORD_SALT_ROUNDS)) {
        throw new Error('PASSWORD_SALT_ROUNDS is not set or is zero.')
    }

    const passwordHash = await bcrypt.hash(password, Number(process.env.PASSWORD_SALT_ROUNDS))

    return encryptPasswordHash(passwordHash)
}

/**
 * Wrapper for the bcrypt `compare` function.
 *
 * @param password Entered password from user to to check.
 * @param encryptedPasswordHash The encrypted password hash to compare against.
 * @returns `true` if the password matches, else `false`.
 */
export async function comparePassword(password: string, encryptedPasswordHash: string) {
    const passwordHash = decryptPasswordHash(encryptedPasswordHash)

    return bcrypt.compare(password, passwordHash)
}
