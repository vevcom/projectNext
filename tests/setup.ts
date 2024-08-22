import { vi } from 'vitest'

vi.mock('server-only', () => ({}))

vi.mock('next-auth', () => ({
    getServerSession: vi.fn(),
}))