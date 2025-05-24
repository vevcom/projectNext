import '@pn-server-only'
import { updateVisibility } from './update'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { Visibility, VisibilityPurpose } from '@prisma/client'
import type { VisibilityLevelMatrices } from './Types'

/**
 * A function to create visibility
 * @param data - the visibility to create with.. If not given it will create a empty visibility (accessable to all)
 * @returns
 */
export async function createVisibility(
    purpose: VisibilityPurpose,
    data?: VisibilityLevelMatrices
): Promise<Visibility> {
    const visibility = await prismaCall(() => prisma.visibility.create({
        data: {
            purpose,
            regularLevel: {
                create: {}
            },
            adminLevel: {
                create: {}
            }
        }
    }))
    await updateVisibility(visibility.id, data || {
        admin: [],
        regular: []
    })
    return visibility
}
