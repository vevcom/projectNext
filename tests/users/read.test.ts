import { readUserPage } from '@/actions/users/read'
import cleanDB from '../utils/cleanDB'

describe('readUser', () => {
    beforeAll(() => {})
    it('should read a user', () => {

    })

    afterAll(() => {

    })
})

describe('readUserPage', () => {
    beforeAll(async () => {
        const firstNames = ['Adam', 'Bella', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah', 'Ian', 'Julia']
        const lastNames = ['Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Fisher', 'Garcia', 'Harris', 'Ivanov', 'Johnson']
        const users = Array.from({ length: 20 }, (_, i) => ({
            username: `user${i}`,
            firstname: `${firstNames[i % firstNames.length]}${Math.floor(i / firstNames.length)}`,
            lastname: `${lastNames[i % lastNames.length]}${Math.floor(i / lastNames.length)}`,
            password: `password${i}`,
            email: `email${i}@example.com`,
        }))
        
        await prisma.user.createMany({
            data: users,
        })
    })

    it('should read a page of size 10 of users with no filter', async () => {
        const page = {
            page: 0,
            pageSize: 10,
        }
        const details = {
            partOfName: '',
            groups: [],
        }
        const res = await readUserPage({page, details})
        expect(res.success).toBe(true)
        if (!res.success) return
        expect(res.data.length).toBe(10)
    })
    it('should order users by lastname, firstname and username', async () => {
        const page = {
            page: 0,
            pageSize: 10,
        }
        const details = {
            partOfName: '',
            groups: [],
        }
        const res = await readUserPage({page, details})
        expect(res.success).toBe(true)
        if (!res.success) return
        const users = res.data
        for (let i = 1; i < users.length; i++) {
            const prev = users[i - 1]
            const curr = users[i]
            const prevName = `${prev.lastname} ${prev.firstname} ${prev.username}`
            const currName = `${curr.lastname} ${curr.firstname} ${curr.username}`
            expect(prevName.localeCompare(currName)).not.toBeGreaterThan(0);
        }
    })

    afterAll(() => cleanDB('User'))
})