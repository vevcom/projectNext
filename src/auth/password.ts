import bcrypt from 'bcrypt'

const saltRounds = 12

export async function hashPassword(password: string) {
    return bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash)
}
