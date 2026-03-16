import '@pn-server-only'
import { createScreenValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import type { CreateScreenTypes } from './validation'
import type { Screen } from '@/prisma-generated-pn-types'

export async function createScreen(rawdata: CreateScreenTypes['Detailed']): Promise<Screen> {
    const data = createScreenValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.screen.create({
        data: {
            ...data,
            orientation: 'LANDSCAPE'
        }
    }))
}
