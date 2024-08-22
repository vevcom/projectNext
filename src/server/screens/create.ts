import 'server-only'
import { createScreenValidation } from './validation'
import { prismaCall } from '../prismaCall'
import prisma from '@/prisma'
import type { CreateScreenTypes } from './validation'
import type { Screen } from '@prisma/client'

export async function createScreen(rawdata: CreateScreenTypes['Detailed']): Promise<Screen> {
    const data = createScreenValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.screen.create({
        data: {
            ...data,
            orientation: 'LANDSCAPE'
        }
    }))
}
