import { v4 as uuid } from 'uuid'
import type { PrismaClient } from '@prisma/client'

export default async function seedDevUsers(prisma: PrismaClient) {
    const fn = ['anne', 'johan', 'pål', 'lars', 'lasse', 'leo', 'noa',
        'trude', 'andreas', 'nora', 'knut', 'anne', 'sara', 'frikk', 'merete', 'klara',
        'britt helen', 'fiola', 'mika', 'helle', 'jesper']
    const ln = ['hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        'noasdatter', 'trudesdatter', 'lien', 'svendsen',
        'mattisen', 'mørk', 'ruud', 'hansen', 'johansen', 'olsen',
        'larsen', 'larsen', 'leosdatter', 'noasdatter', 'trudesdatter',
        'lien', 'svendsen', 'mattisen', 'mørk', 'ruud', 'hansen', 'johansen', 'olsen', 'larsen',
        'larsen', 'leosdatter', 'noasdatter', 'trudesdatter', 'lien',
        'svendsen', 'mattisen', 'mørk', 'ruud', 'hansen', 'johansen', 'olsen', 'larsen', 'larsen',
        'leosdatter', 'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen',
        'mørk', 'ruud', 'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen', 'mørk',
        'ruud', 'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen', 'mørk', 'ruud', 'hansen', 'johansen',
        'olsen', 'larsen', 'larsen', 'leosdatter', 'noasdatter', 'trudesdatter',
        'lien', 'svendsen', 'mattisen', 'mørk', 'ruud', 'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen', 'mørk', 'ruud',
        'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen', 'mørk', 'ruud']
    Promise.all(fn.map(async (f, i) => {
        await Promise.all(ln.map(async (l, j) => {
            await prisma.user.upsert({
                where: {
                    email: `${f}.${l}@${f}${l}.io`
                },
                update: {

                },
                create: {
                    firstname: f,
                    lastname: l,
                    email: uuid(),
                    password: 'password',
                    username: `${f}${i}${j}`,
                },
            })
        }))
    }))

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
            password: 'password',
            username: 'Harambe104',
        },
    })
    console.log(harambe)
}
