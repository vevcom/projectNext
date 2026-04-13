import seed from '@/prisma/seeder/src/seeder'
import { beforeAll, jest } from '@jest/globals'

// React email rendering uses dynamic imports which are not supported in Jest by default.
// We mock the render function to avoid issues during tests.
jest.mock('@react-email/render', () => ({
    render: jest.fn().mockImplementation(() => 'Email rendering is disabled during tests.'),
}))

beforeAll(
    async () => await seed(false, false, false),
    30 * 1000 // Timeout 30 seconds
)
