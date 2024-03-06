export type IdMapper = {
    vevenId: number
    pnId: number
}[]

/**
 * A function to get the id of the image collection on PN from the id of the image collection on veven
 * The function will return null if no id is found
 * @param mapper - IdMapper - A map of the old and new id's of the image collections
 * @param vevenId - number - The id of the image collection on veven
 * @returns - number | null - The id of the image collection on PN
 */
export function vevenIdToPnId(mapper: IdMapper, vevenId: number | null): number | null {
    if (!vevenId) return null
    const id = mapper.find(id => id.vevenId === vevenId)?.pnId
    if (!id) {
        console.error(`No id found for vevenId: ${vevenId}. Are you sure you have migrated the image collections?`)
        return null
    }
    return id
}