import manifest from '@/seeder/src/logger'

export type IdMapper = {
    owId: number
    pnId: number
}[]

/**
 * Looks up the PN id for an Omegaweb-basic id in a migrated IdMapper (images, image
 * collections, ...). Returns null if no id is found.
 * @param mapper - IdMapper - A map of the old and new id's for the given resource
 * @param owId - number - The id of the resource on Omegaweb-basic
 * @param resource - what the mapper maps, used to give an accurate error message. Images
 * are commonly missing because migration limits skip most of them (see migrationLimits.ts)
 * - that isn't a bug, so it gets called out separately from other resources.
 * @returns - number | null - The id of the resource on PN
 */
export function owIdToPnId(mapper: IdMapper, owId: number | null, resource: 'images' | 'image collections'): number | null {
    if (!owId) return null
    const id = mapper.find(_id => _id.owId === owId)?.pnId
    if (!id) {
        const hint = resource === 'images'
            ? ' - likely skipped by migration limits (see migrationLimits.ts), not necessarily a bug'
            : ''
        manifest.error(`No pnId found for owId ${owId} while mapping ${resource}${hint}`)
        return null
    }
    return id
}
