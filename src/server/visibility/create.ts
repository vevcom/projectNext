import 'server-only'
import { updateVisibility } from './update'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { Visibility, VisibilityPurpose } from '@prisma/client'
import type { VisibilityCollapsed, VisibilityCollapsedWithouPurpose } from './Types'

/**
 * A function to create visibility
 * @param data - the visibility to create with.. If not given it will create a empty visibility (accessable to all)
 * @returns
 */
export async function createVisibility(
    purpose: VisibilityPurpose, 
    data?: VisibilityCollapsedWithouPurpose
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
        published: false,
        type: 'REGULAR',
        admin: [],
        regular: []
    })
    return visibility
}
