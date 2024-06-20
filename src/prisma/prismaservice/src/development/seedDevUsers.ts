import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import type { PrismaClient } from '@/generated/pn'

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
        'leosdatter', 'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen',
        'mørk', 'ruud', 'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen', 'mørk',
        'ruud', 'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen', 'mørk', 'ruud', 'hansen', 'johansen',
        'olsen', 'larsen', 'larsen', 'leosdatter', 'noasdatter', 'trudesdatter',
        'lien', 'svendsen', 'mattisen', 'mørk', 'ruud', 'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen', 'mørk', 'ruud',
        'hansen', 'johansen', 'olsen', 'larsen', 'larsen', 'leosdatter',
        'noasdatter', 'trudesdatter', 'lien', 'svendsen', 'mattisen', 'mørk', 'ruud'
    ]

    if (!process.env.PASSWORD_PEPPER) {
        throw new Error("PASSWORD_PEPPER is not set.")
    }
    
    const hmac = crypto.createHmac('sha256', process.env.PASSWORD_PEPPER)
    const encryptedPassword = hmac.update('password').digest().toString('base64')

    if (!Number(process.env.PASSWORD_SALT_ROUNDS)) {
        throw new Error("PASSWORD_SALT_ROUNDS is not set or is zero.")
    }

    const passwordHash = await bcrypt.hash(encryptedPassword, Number(process.env.PASSWORD_SALT_ROUNDS))

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
                    username: `${f}${i}${j}`,
                    credentials: {
                        create: {
                            passwordHash,
                        },
                    },
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
            username: 'Harambe104',
            credentials: {
                create: {
                    passwordHash,
                },
            },
        },
    })
    console.log(harambe)
}
