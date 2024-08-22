import { UserFiltered } from '@/server/users/Types'
import { Session } from 'next-auth'
import { getServerSession } from 'next-auth'
import { vi } from 'vitest'

// TODO: Mock user is temporary and should be replaced with data from the db
export const mockUser = {
    id: 1,
    firstname: 'Test',
    lastname: 'Test',
    username: 'test',
    email: 'test@test.test',
    mobile: '12345678',
    sex: 'OTHER',
    emailVerified: new Date(),
    acceptedTerms: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
} satisfies UserFiltered

type MockedSession = { user?: Partial<Session['user']> } & Partial<Omit<Session, 'user' | 'expires'>>

export function setMockSession(session: MockedSession): void {
    vi.mocked(getServerSession).mockResolvedValue(session)
}