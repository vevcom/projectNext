import 'server-only'
import { prismaCall } from '../prismaCall'
import prisma from '@/prisma'

export async function createVisibility() : Promise<void> {
    await prismaCall(() => prisma.visibility.create({
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