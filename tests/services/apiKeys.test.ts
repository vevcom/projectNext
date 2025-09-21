import { Session } from '@/auth/Session'
import { Smorekopp } from '@/services/error'
import { prisma } from '@/prisma/client'
import { ApiKeyMethods } from '@/services/api-keys/methods'
import { afterEach, describe, expect, test } from '@jest/globals'

afterEach(async () => {
    await prisma.apiKey.deleteMany()
})

describe('api keys', () => {
    test('create, read and update api key with authorized user', async () => {
        const session = Session.fromJsObject({
            memberships: [],
            permissions: ['APIKEY_ADMIN'],
            user: null,
        })

        const createdApiKey = await ApiKeyMethods.create({
            data: {
                name: 'Min api nøkkel',
            },
            session,
        })
        expect(createdApiKey).toMatchObject({
            name: 'Min api nøkkel',
            active: true,
            permissions: [],
        })

        const readApiKeyResult = await ApiKeyMethods.read({
            params: createdApiKey,
            session,
        })
        expect(readApiKeyResult).toMatchObject({
            name: 'Min api nøkkel',
            active: true,
            permissions: [],
        })

        await ApiKeyMethods.update({
            params: createdApiKey,
            data: {
                permissions: ['APIKEY_ADMIN'],
            },
            session,
        })
        const updatedApiKey = await prisma.apiKey.findUnique({
            where: { id: createdApiKey.id },
        })
        expect(updatedApiKey).toMatchObject({
            name: 'Min api nøkkel',
            active: true,
            permissions: ['APIKEY_ADMIN'],
        })
    })

    // TODO: Tests for authorized and unauthenticated users are quite similar,
    // so there should probably be a system in place to run the same test
    // with different session objects.
    test('create, read and update api key with unauthenticated user', async () => {
        const createdApiKeyPromise = ApiKeyMethods.create({
            data: {
                name: 'Min api nøkkel',
            },
        })
        expect(createdApiKeyPromise).rejects.toThrow(new Smorekopp('UNAUTHENTICATED'))
        expect(await prisma.apiKey.count()).toEqual(0)

        const readApiKeyPromise = ApiKeyMethods.read({
            params: {
                id: 1,
            },
        })
        expect(readApiKeyPromise).rejects.toThrow(new Smorekopp('UNAUTHENTICATED'))

        const updateApiKeyPromise = ApiKeyMethods.update({
            params: {
                id: 1,
            },
            data: {
                permissions: ['APIKEY_ADMIN'],
            },
        })
        expect(updateApiKeyPromise).rejects.toThrow(new Smorekopp('UNAUTHENTICATED'))
    })
})
