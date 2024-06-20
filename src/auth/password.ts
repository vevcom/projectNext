import bcrypt from 'bcrypt'

const saltRounds = 12

/**
 * Wrapper for the bcrypt `hash` function.
 *
 * @param password The password to be hashed.
 * @returns Hashed password string.
 */
export async function hashPassword(password: string) {
    return bcrypt.hash(password, saltRounds)
}

/**
 * Wrapper for the bcrypt `compare` function.
 *
 * @param password The unhashed password to check.
 * @param passwordHash The password hash to compare against.
 * @returns `true` if the password matches, else `false`.
 */
export async function comparePassword(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash)
}
