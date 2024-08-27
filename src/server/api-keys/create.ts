import  'server-only'
import { CreateApiKeyTypes, createApiKeyValidation } from './validation';
import { prismaCall } from '../prismaCall';
import prisma from '@/prisma';

export async function createApiKey(rawdata: CreateApiKeyTypes['Detailed']) {
    const data = createApiKeyValidation.detailedValidate(rawdata)


    return await prismaCall(() => prisma.apiKey.create({
        data: {
            keyHashEncrypted: 'jfiewj',
            name: data.name,
            active: true,
        }
    }))
}