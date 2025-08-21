import { RequireNothing } from "@/auth/auther/RequireNothing";
import { Session } from "@/auth/Session";
import { Context, ServiceMethod } from "@/services/ServiceMethod";
import { describe, test, expect } from "@jest/globals";

const returnContextInfo = ServiceMethod({
    auther: () => RequireNothing.staticFields({}).dynamicFields({}),
    method: async ({ prisma, session }) => {
        return {
            inTransaction: "$transaction" in prisma,
            apiKeyId: session.apiKeyId,
        }
    }
})

const callReturnContextInfo = ServiceMethod({
    auther: () => RequireNothing.staticFields({}).dynamicFields({}),
    method: async () => {
        return returnContextInfo({})
    }
})

describe('context', () => {
    const apiKeySession = Session.fromJsObject({
        apiKeyId: 0,
        user: null,
        memberships: [],
        permissions: [],
    })
    const emptySession = Session.empty()
    
    const contexts: Context[] = [
        { session: emptySession, prisma },
        { session: apiKeySession, prisma },
        { session: null, prisma },
    ]
    
    test.each(contexts)('should work', async (context) => {
        const expected = {
            inTransaction: "$transaction" in context.prisma,
            apiKeyId: context.session?.apiKeyId,
        }

        for (const func of [returnContextInfo, callReturnContextInfo]) {
            const res = await func(context)
            expect(res).toMatchObject(expected)
        }
    })
})