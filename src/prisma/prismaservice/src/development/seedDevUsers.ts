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

    const passwordHash = await hashPassword('password')

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

// TODO: WE NEED TO FIND A BETTER WAY TO SHARE CODE BETWEEN PRISMA SERVICE AND NEXT

const ENCRYPTION_ALGORITHM = 'aes-256-cbc'
const IV_LENGTH = 16 // IV = Initalization Vector

const ENCRYPTION_KEY_ENCONDING = 'base64'
const ENCRYPTION_INPUT_ENCODING = 'utf-8'
const ENCRYPTION_OUTPUT_ENCODING = 'base64'

function encryptPasswordHash(passwordHash: string): string {
    if (!process.env.PASSWORD_ENCRYPTION_KEY) {
        throw new Error('PASSWORD_ENCRYPTION_KEY is not set.')
    }

    const initializationVector = crypto.randomBytes(IV_LENGTH)
    const encryptionKeyBuffer = Buffer.from(process.env.PASSWORD_ENCRYPTION_KEY, ENCRYPTION_KEY_ENCONDING)

    const cipher = crypto.createCipheriv(
        ENCRYPTION_ALGORITHM,
        encryptionKeyBuffer,
        initializationVector,
    )

    const passwordHashBuffer = Buffer.from(passwordHash, ENCRYPTION_INPUT_ENCODING)

    // We need the IV to decrypt the hash, so we'll store it at the beginning of the encryption output.
    const encrypted = Buffer.concat([
        initializationVector,
        cipher.update(passwordHashBuffer),
        cipher.final(),
    ])

    return encrypted.toString(ENCRYPTION_OUTPUT_ENCODING)
}

export async function hashPassword(password: string) {
    if (!Number(process.env.PASSWORD_SALT_ROUNDS)) {
        throw new Error('PASSWORD_SALT_ROUNDS is not set or is zero.')
    }

    const passwordHash = await bcrypt.hash(password, Number(process.env.PASSWORD_SALT_ROUNDS))

    return encryptPasswordHash(passwordHash)
}
