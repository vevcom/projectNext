import bcrypt from 'bcrypt'

/**
 * A hasher returns a method to hash and compare data. You pass it the number of rounds
 * to bind it to these methods.
 * @param saltRounds - The number of rounds to use in the hashing.
 * @returns - Methods to hash and compare data.
 */
export function hasher(saltRounds: number) {
    return {
        hash: async (data: string) => await bcrypt.hash(data, saltRounds),
        compare: async (data: string, hash: string) => await bcrypt.compare(data, hash)
    }
}
