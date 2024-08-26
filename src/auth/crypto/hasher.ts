import bcrypt from 'bcrypt'

export function hasher(saltRounds: number) {
    return {
        hash: async (data: string) => await bcrypt.hash(data, saltRounds),
        compare: async (data: string, hash: string) => await bcrypt.compare(data, hash)
    }
}
