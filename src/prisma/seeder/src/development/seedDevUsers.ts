import { hashAndEncryptPassword } from '@/auth/password'
import { v4 as uuid } from 'uuid'
import type { PrismaClient } from '@prisma/client'

export default async function seedDevUsers(prisma: PrismaClient) {
    const fn = [
        'anne', 'johan', 'pål', 'lars', 'lasse', 'leo', 'noa',
        'trude', 'andreas', 'nora', 'knut', 'anne', 'sara', 'frikk', 'merete', 'klara',
        'britt helen', 'fiola', 'mika', 'helle', 'jesper'
    ]

    const ln = [
        'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        'noasdatter', 'trudesdatter', 'lien', 'svendsen',
        'mattisen', 'mørk', 'ruud', 'hansen', 'johansen', 'olsen',
        'larsen', 'larsen', 'leosdatter', 'noasdatter', 'trudesdatter',
        'lien', 'svendsen', 'mattisen', 'mørk', 'ruud', 'hansen', 'johansen', 'olsen', 'larsen',
        'larsen', 'leosdatter', 'noasdatter', 'trudesdatter', 'lien',
        'svendsen', 'mattisen', 'mørk', 'ruud', 'hansen', 'johansen', 'olsen', 'larsen', 'larsen',
        // 'leosdatter', 'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen',
        // 'mørk', 'ruud', 'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        // 'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen', 'mørk',
        // 'ruud', 'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        // 'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen', 'mørk', 'ruud', 'hansen', 'johansen',
        // 'olsen', 'larsen', 'larsen', 'leosdatter', 'noasdatter', 'trudesdatter',
        // 'lien', 'svendsen', 'mattisen', 'mørk', 'ruud', 'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        // 'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen', 'mørk', 'ruud',
        // 'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        // 'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen', 'mørk', 'ruud'
    ]

    const passwordHash = await hashAndEncryptPassword('password')

    Promise.all(fn.map(async (f, i) => {
        await Promise.all(ln.map(async (l, j) => {
            await prisma.user.upsert({
                where: {
                    username: `${f}${i}${j}`
                },
                update: {

                },
                create: {
                    firstname: f,
                    lastname: l,
                    email: uuid(),
                    username: `${f}${i}${j}`,
                    studentCard: `${f}-${i}-${j}`,
                    credentials: {
                        create: {
                            passwordHash,
                        },
                    },
                    acceptedTerms: new Date(),
                },
            })
        }))
    }))

    const harambeImage = await prisma.image.findFirst({
        where: {
            name: 'harambe'
        }
    })
    if (!harambeImage) {
        throw new Error('Harambe image not found')
    }

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
            username: 'harambe',
            bio: 'Harambe did nothing wrong',
            studentCard: 'harambeCard',
            credentials: {
                create: {
                    passwordHash,
                },
            },
            image: {
                connect: {
                    id: harambeImage.id
                }
            },
            acceptedTerms: new Date(),
        },
    })

    const vever = await prisma.user.upsert({
        where: {
            email: 'vever@vevcom.com'
        },
        update: {

        },
        create: {
            firstname: 'Vever',
            lastname: 'Vevsen',
            email: 'vever@vevcom.com',
            username: 'vever',
            studentCard: 'vever',
            credentials: {
                create: {
                    passwordHash: 'password',
                },
            },
            acceptedTerms: new Date(),
        },
    })
    console.log(harambe)
    console.log(vever)
}

