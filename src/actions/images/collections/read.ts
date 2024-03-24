'use server'
import { createActionError } from '@/actions/error'
import { readImageCollection, readImageCollectionsPage, readSpecialImageCollection } from '@/server/images/collections/read'
import { safeServerCall } from '@/actions/safeServerCall'
import { SpecialCollection } from '@prisma/client'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { ImageCollection } from '@prisma/client'
import type {
    ExpandedImageCollection,
    ImageCollectionPageReturn
} from '@/server/images/collections/Types'
import { getUser } from '@/auth/getUser'
import { getVisibilityFilter } from '@/auth/getVisibilityFilter'
import { includeVisibility } from '@/server/visibility/read'
import { checkVisibility } from '@/auth/checkVisibility'
import { VisibilityCollapsed } from '@/server/visibility/Types'

/**
 * Action that reads an image collection by id or name
 * @param idOrName - the id or name of the image collection
 * @returns the image collection in actionrturn
 */
export async function readImageCollectionAction(
    idOrName: number | string
): Promise<ActionReturn<ExpandedImageCollection & {visibility: VisibilityCollapsed}>> {
    const collection = await safeServerCall(() => includeVisibility(
        () => readImageCollection(idOrName), 
        data => data.visibilityId
    ))
    if (!collection.success) return collection
    if (!checkVisibility(await getUser(), collection.data.visibility, 'REGULAR', 'IMAGE_ADMIN')) {
        return createActionError('UNAUTHORIZED', 'You do not have permission to view this collection')
    }

    return collection
}   

/**
 * Action that returns a page of image collections, orders by createdAt (and then name)
 * @param page - the page to read of the Page type
 * @returns - A page of image collections
 */
export async function readImageCollectionsPageAction<const PageSize extends number>(
    readPageInput: ReadPageInput<PageSize>
): Promise<ActionReturn<ImageCollectionPageReturn[]>> {
    const { memberships, permissions } = await getUser()
    const visibilityFilter = getVisibilityFilter(memberships, permissions || [], 'IMAGE_ADMIN')
    return await safeServerCall(() => readImageCollectionsPage(readPageInput, visibilityFilter))
}

/**
 * Reads a "special" collection read on this in the docs. If it does not exist it will create it.
 * @param special - the special collection to read
 * @returns the special collection
 */
export async function readSpecialImageCollectionAction(special: SpecialCollection): Promise<ActionReturn<ImageCollection>> {
    //Check that the collection actually is a special collection, as the paramter is only a compile time type check
    if (!Object.values(SpecialCollection).includes(special)) {
        return createActionError('BAD PARAMETERS', `${special} is not special`)
    }

    //TODO: Auth special image collections on permission (not visibility)
    //TODO: Check permission associated with the special collection
    return await safeServerCall(() => readSpecialImageCollection(special))
}
