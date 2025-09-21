import { RequireNothing } from '@/auth/auther/RequireNothing'
import { RequireServerOnly } from '@/auth/auther/ServerOnly'
import { Session } from '@/auth/Session'
import { serviceMethod } from '@/services/serviceMethod'
import { default as globalPrisma } from '@/prisma'
import { describe, expect, test } from '@jest/globals'
import { z } from 'zod'

describe('service method', () => {
    describe('simple', () => {
        const addPositiveOnly = serviceMethod({
            authorizer: ({ data: { a, b } }) => {
                if (a < 0 || b < 0) {
                    return RequireServerOnly.staticFields({}).dynamicFields({})
                }

                return RequireNothing.staticFields({}).dynamicFields({})
            },
            dataSchema: z.object({
                a: z.number(),
                b: z.number(),
            }),
            method: ({ data: { a, b } }) => a + b,
        })

        test('method result', async () => {
            const res = await addPositiveOnly({
                data: {
                    a: 1,
                    b: 2,
                },
            })

            expect(res).toBe(3)
        })

        test('auth fail', async () => {
            await expect(addPositiveOnly({
                data: {
                    a: -1,
                    b: 2,
                },
            })).rejects.toThrow()
        })

        test('bypass auth', async () => {
            const res = await addPositiveOnly({
                data: {
                    a: -1,
                    b: 2,
                },
                bypassAuth: true,
            })

            expect(res).toBe(1)
        })
    })

    describe('nested', () => {
        // Simple service method that just returns its own context
        const inner = serviceMethod({
            authorizer: () => RequireNothing.staticFields({}).dynamicFields({}),
            method: async (context) => context,
        })

        // Outer service method that calls the inner one and returns its context
        const outer = serviceMethod({
            authorizer: () => RequireNothing.staticFields({}).dynamicFields({}),
            method: async () => await inner({}),
        })

        test('nested context global defaults', async () => {
            const res = await outer({})

            expect(res.bypassAuth).toBe(false)
            expect(res.session).toBeInstanceOf(Session)
            expect(res.prisma).toBe(globalPrisma)
        })

        test('nested context override bypassAuth', async () => {
            const res = await outer({ bypassAuth: true })

            expect(res.bypassAuth).toBe(true)
            expect(res.session).toBeInstanceOf(Session)
            expect(res.prisma).toBe(globalPrisma)
        })

        test('nested context override session', async () => {
            const customSession = Session.fromJsObject({
                apiKeyId: 1919,
                memberships: [],
                permissions: [],
                user: null,
            })

            const res = await outer({ session: customSession })

            expect(res.bypassAuth).toBe(false)
            expect(res.session).toBe(customSession)
            expect(res.prisma).toBe(globalPrisma)
        })

        test('nested context override prisma', async () => {
            await globalPrisma.$transaction(async (tx) => {
                const res = await outer({ prisma: tx })

                expect(res.bypassAuth).toBe(false)
                expect(res.session).toBeInstanceOf(Session)
                expect(res.prisma).toBe(tx)
            })
        })
    })
})
