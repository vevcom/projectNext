export type IdMapper = {
    owId: number
    pnId: number
}[]

/**
 * A function to get the id of the image collection on PN from the id of the image collection on Omegaweb-basic
 * The function will return null if no id is found
 * @param mapper - IdMapper - A map of the old and new id's of the image collections
 * @param owId - number - The id of the image collection on Omegaweb-basic
 * @returns - number | null - The id of the image collection on PN
 */
export function owIdToPnId(mapper: IdMapper, owId: number | null): number | null {
    if (!owId) return null
    const id = mapper.find(_id => _id.owId === owId)?.pnId
    if (!id) {
        console.error(`No id found for owId: ${owId}. Are you sure you have migrated the image collections?`)
        return null
    }
    return id
}
