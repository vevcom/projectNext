import 'server-only'
import { prismaCall } from '../prismaCall'
import prisma from '@/prisma'
import { Visibility } from '@prisma/client'
import { VisibilityCollapsed } from './Types'
import { updateVisibility } from './update'

/**
 * A function to create visibility
 * @param data - the visibility to create with.. If not given it will create a empty visibility (accessable to all)
 * @returns 
 */
export async function createVisibility(data?: VisibilityCollapsed) : Promise<Visibility> {
    const visibility = await prismaCall(() => prisma.visibility.create({
        data: {
            regularLevel: {
                create: {}
            },
            adminLevel: {
                create: {}
            }
        }
    }))
    await updateVisibility(visibility.id, data || {
        type: 'REGULAR',
        admin: [],
        regular: []
    })
    return visibility
}