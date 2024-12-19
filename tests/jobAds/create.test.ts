import { createJobAdAction } from '@/actions/jobAds/create'
import { getServerSession } from 'next-auth'
import { vi, it, describe, expect } from 'vitest'
import { mockUser, setMockSession } from 'tests/mockSession'

const testJobAd = {
    articleName: 'Next JS utvikler',
    description: 'Vi ser etter utviklere som er glade i webutvikling og kake.',
    company: 'Vevcom',
}

describe('Create Job Ads', () => {
    it('Create Job Ad with Unauthorized User', async () => {
        setMockSession({
            memberships: [],
            permissions: [],
            user: mockUser,
        })

        const createdJobAdRes = await createJobAdAction(testJobAd)

        expect(createdJobAdRes).toMatchObject({ success: false })
    })

    it('Create Job Ad with Authorized User', async () => {
        setMockSession({
            permissions: ['JOBAD_CREATE']
        })

        vi.mocked(getServerSession).mockResolvedValue({ 
            user: mockUser,
            permissions: ['CREATE_PERMISSION'],
            memberships: [],
        })

        const createdJobAdRes = await createJobAdAction(testJobAd)

        expect(createdJobAdRes).toMatchObject({ success: false })
    })
})