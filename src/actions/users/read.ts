'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { Image } from '@prisma/client'
import type { ActionReturn, ReadPageInput } from '@/actions/type'
import { ReturnType } from './ReturnType

export default async function readUserPage<const PageSize extends number>({ 
    page, 
    details 
}: ReadPageInput<PageSize, {collectionId: number}>
): Promise<ActionReturn<ReturnType>> {
    try {

    } catch (error) {
        errorHandler(error)
    }
}