import  'server-only'
import { CreateApiKeyTypes, createApiKeyValidation } from './validation';
import { prismaCall } from '../prismaCall';
import prisma from '@/prisma';
import crypto from 'crypto'
import { apiKeyFilterSelection } from './ConfigVars';
import { apiKeyHashAndEncrypt } from './hashEncryptKey';

export async function createApiKey(rawdata: CreateApiKeyTypes['Detailed']) {
    const data = createApiKeyValidation.detailedValidate(rawdata)

    const NODE_ENV = process.env.NODE_ENV
    const prepend = NODE_ENV === 'production' ? 'prod' : 'dev'

    const key = prepend + crypto.randomBytes(32).toString('utf8')
    const keyHashEncrypted = await apiKeyHashAndEncrypt(key)

    return await prismaCall(() => prisma.apiKey.create({
        data: {
            keyHashEncrypted,
            name: data.name,
            active: true,
        },
        select: apiKeyFilterSelection
    }))
}