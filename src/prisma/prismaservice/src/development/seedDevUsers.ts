import type { PrismaClient } from '@prisma/client'

export default async function seedDevUsers(prisma: PrismaClient) {
    const harambe = await prisma.user.upsert({
        where: {
            email: 'harambe@harambesen.io'
        },
        update: {

        },
        create: {
            firstname: 'Harambe',
            lastname: 'Harambesen',
            email: 'harambe@harambesen.io',
            username: 'Harambe104',
            credentials: {
                create: {
                    passwordHash: 'password',
                },
            },
        },
    })
    console.log(harambe)
}
