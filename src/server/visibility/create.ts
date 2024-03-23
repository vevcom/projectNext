import 'server-only'
import { prismaCall } from '../prismaCall'
import prisma from '@/prisma'
import { Visibility } from '@prisma/client'

export async function createVisibility() : Promise<Visibility> {
    return await prismaCall(() => prisma.visibility.create({
        data: {
            regularLevel: {
                create: {}
            },
            adminLevel: {
                create: {}
            }
        }
    }))
}