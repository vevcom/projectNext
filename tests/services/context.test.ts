import { RequireNothing } from '@/auth/auther/RequireNothing'
import { Session } from '@/auth/Session'
import { serviceMethod } from '@/services/serviceMethod'
import { prisma as globalPrisma } from '@/prisma/client'
import { describe, test, expect } from '@jest/globals'
import type { ServiceMethodContext } from '@/services/serviceMethod'

const returnContextInfo = serviceMethod({
    authorizer: () => RequireNothing.staticFields({}).dynamicFields({}),
    method: async ({ prisma, session }) => ({
        inTransaction: '$transaction' in prisma,
        apiKeyId: session.apiKeyId,
    })
})

const callReturnContextInfo = serviceMethod({
    authorizer: () => RequireNothing.staticFields({}).dynamicFields({}),
    method: async () => returnContextInfo({})
})

describe('context', () => {
    const apiKeySession = Session.fromJsObject({
        apiKeyId: 0,
        user: null,
        memberships: [],
        permissions: [],
    })
    const emptySession = Session.empty()

    const contexts: ServiceMethodContext[] = [
        { session: emptySession, prisma: globalPrisma, bypassAuth: false },
        { session: apiKeySession, prisma: globalPrisma, bypassAuth: false },
        { session: emptySession, prisma: globalPrisma, bypassAuth: true },
    ]

    test.each(contexts)('should work', async (context) => {
        const expected = {
            inTransaction: '$transaction' in context.prisma,
            apiKeyId: context.session?.apiKeyId,
        }

        for (const func of [returnContextInfo, callReturnContextInfo]) {
            const res = await func(context)
            expect(res).toMatchObject(expected)
        }
    })
})
