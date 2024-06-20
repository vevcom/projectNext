import bcrypt from 'bcrypt'
import crypto from 'crypto'

function pepperPassword(password: string) {
    if (!process.env.PASSWORD_PEPPER) {
        throw new Error("PASSWORD_PEPPER is not set.")
    }
    
    const hmac = crypto.createHmac('sha256', process.env.PASSWORD_PEPPER)
    
    const encryptedPassword = hmac.update(password).digest()

    // Convert "encryptedPassword" to base64 to avoid accidental null terminators
    return encryptedPassword.toString('base64')
}

/**
 * Wrapper for the bcrypt `hash` function.
 *
 * @param password The password to be hashed.
 * @returns Hashed password string.
 */
export async function hashPassword(password: string) {
    if (!Number(process.env.PASSWORD_SALT_ROUNDS)) {
        throw new Error("PASSWORD_SALT_ROUNDS is not set or is zero.")
    }

    const encryptedPassword = pepperPassword(password)

    return bcrypt.hash(encryptedPassword, Number(process.env.PASSWORD_SALT_ROUNDS))
}

/**
 * Wrapper for the bcrypt `compare` function.
 *
 * @param password The unhashed password to check.
 * @param passwordHash The password hash to compare against.
 * @returns `true` if the password matches, else `false`.
 */
export async function comparePassword(password: string, passwordHash: string) {
    if (!Number(process.env.PASSWORD_SALT_ROUNDS)) {
        throw new Error("PASSWORD_SALT_ROUNDS is not set or is zero.")
    }

    const encryptedPassword = pepperPassword(password)

    return bcrypt.compare(encryptedPassword, passwordHash)
}
