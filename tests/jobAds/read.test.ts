import { createJobAdAction } from '@/actions/jobAds/create'
import { getServerSession } from 'next-auth'
import { vi, it, describe, expect } from 'vitest'
import { mockUser, setMockSession } from 'tests/mockSession'
import { readJobAdAction } from '@/actions/jobAds/read'
import { beforeEach } from 'node:test'
import type { Prisma } from '@prisma/client'
import { createJobAd } from '@/services/jobAds/create'
import { createOmegaOrder } from '@/services/omegaOrder/create'

const testJobAd = {
    articleName: 'Next JS utvikler',
    description: 'Vi ser etter utviklere som er glade i webutvikling og kake.',
    company: 'Vevcom',
}

describe('Read Job Ads', () => {
    beforeEach(async () => {
        await prisma.omegaOrder.create({
            data: { order: 104 }
        })

        await prisma.jobAd.create({
            data: {
                company: 'Vevcom',
                description: 'Vi ser etter utviklere som er glade i webutvikling og kake.',
                article: {
                    create: {
                        name: "Next JS utvikler",
                        coverImage: {},
                    },
                },
                omegaOrder: {
                    connect: {
                        order: 104
                    }
                }
            }
        })
    })

    it('Read Job Ad with Unauthorized User', async () => {
        setMockSession({
            memberships: [],
            permissions: [],
            user: mockUser,
        })

        const readJobAdRes = await readJobAdAction({
            articleName: "Next JS utvikler",
            order: 104,
        })

        expect(readJobAdRes).toMatchObject({ success: false })
    })

    // it('Create Job Ad with Authorized User', async () => {
    //     setMockSession({
    //         permissions: ['JOBAD_CREATE']
    //     })

    //     vi.mocked(getServerSession).mockResolvedValue({ 
    //         user: mockUser,
    //         permissions: ['CREATE_PERMISSION'],
    //         memberships: [],
    //     })

    //     const createdJobAdRes = await createJobAdAction(testJobAd)

    //     expect(createdJobAdRes).toMatchObject({ success: false })
    // })
})