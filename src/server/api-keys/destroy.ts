import 'server-only'
import { ServerError } from '../error'
import prisma from '@/prisma'

export async function destroyApiKey(id: number): Promise<void> {
    const apiKey = await prisma.apiKey.findUnique({
        where: { id }
    })
    if (!apiKey) {
        throw new ServerError('NOT FOUND', 'Api key finnes ikke')
    }
    if (apiKey.active) {
        throw new ServerError('BAD PARAMETERS', 'Du kan ikke slette en aktiv nøkkel - deaktiver den først')
    }

    await prisma.apiKey.delete({
        where: { id }
    })
}
