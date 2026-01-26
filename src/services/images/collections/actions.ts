'use server'
import { createActionError, createZodActionError, safeServerCall } from '@/services/actionError'
import { createImageCollection } from '@/services/images/collections/create'
import { destroyImageCollection } from '@/services/images/collections/destroy'
import {
    readImageCollection,
    readImageCollectionsPage,
    readSpecialImageCollection } from '@/services/images/collections/read'
import { updateImageCollection } from '@/services/images/collections/update'
import { createImageCollectionValidation, updateImageCollectionValidation } from '@/services/images/collections/validation'
import { SpecialCollection } from '@/prisma-generated-pn-types'
import type { CreateImageCollectionTypes, UpdateImageCollectionTypes } from '@/services/images/collections/validation'
import type { ExpandedImageCollection,
    ImageCollectionCursor,
    ImageCollectionPageReturn } from '@/services/images/collections/types'
import type { ReadPageInput } from '@/lib/paging/types'
import type { ActionReturn } from '@/services/actionTypes'
import type { ImageCollection } from '@/prisma-generated-pn-types'

export async function createImageCollectionAction(
    rawdata: FormData | CreateImageCollectionTypes['Type']
): Promise<ActionReturn<ImageCollection>> {
    const parse = createImageCollectionValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data
    return await safeServerCall(() => createImageCollection(data))
}

export async function destroyImageCollectionAction(collectionId: number): Promise<ActionReturn<ImageCollection>> {
    //TODO: Visibility check

    return await safeServerCall(() => destroyImageCollection(collectionId))
}

/**
 * Action that reads an image collection by id or name
 * @param idOrName - the id or name of the image collection
 * @returns the image collection in actionrturn
 */
export async function readImageCollectionAction(
    idOrName: number | string
): Promise<ActionReturn<ExpandedImageCollection>> {
    const collection = await safeServerCall(() => readImageCollection(idOrName))
    if (!collection.success) return collection
    return collection
}

/**
 * Action that returns a page of image collections, orders by createdAt (and then name)
 * @param page - the page to read of the Page type
 * @returns - A page of image collections
 */
export async function readImageCollectionsPageAction<const PageSize extends number>(
    readPageInput: ReadPageInput<PageSize, ImageCollectionCursor>
): Promise<ActionReturn<ImageCollectionPageReturn[]>> {
    return await safeServerCall(() => readImageCollectionsPage(readPageInput))
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