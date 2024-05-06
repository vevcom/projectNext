import { SpecialNotificationChannel, Prisma } from '@/generated/pn'
import type { NotificationChannel, NotificationMethod, PrismaClient } from '@/generated/pn'

type ChannelInfo = {
    special?: SpecialNotificationChannel
    name: string
    description: string
    defaultMethods: Omit<NotificationMethod, 'id'>
    availableMethods: Omit<NotificationMethod, 'id'>
}

function createChanneInfo(obj: ChannelInfo): ChannelInfo {
    return obj
}

const allMethodsOn = {
    email: true,
    emailWeekly: true,
    push: true,
} as const

const allMethodsOff = {
    email: false,
    emailWeekly: false,
    push: false,
} as const

export default async function seedNotificationChannels(prisma: PrismaClient) {
    const keys = Object.keys(SpecialNotificationChannel) as SpecialNotificationChannel[]

    const channels: ChannelInfo[] = [
        {
            special: 'ROOT',
            name: 'Alle varslinger',
            description: 'Denne kanalen styrer alle varslinger',
            defaultMethods: allMethodsOff,
            availableMethods: allMethodsOn,
        },
        {
            special: 'NEW_EVENT',
            name: 'Ny hendelse',
            description: 'Varslinger om nye hendelser',
            defaultMethods: allMethodsOn,
            availableMethods: allMethodsOn,
        },
        {
            special: 'NEW_OMBUL',
            name: 'Ny ombul',
            description: 'Varsling når det kommer ny ombul',
            defaultMethods: allMethodsOff,
            availableMethods: allMethodsOn,
        },
        {
            special: 'NEW_NEWS_ARTICLE',
            name: 'Ny nyhetsartikkel',
            description: 'Varslinger om nye artikler',
            defaultMethods: allMethodsOff,
            availableMethods: allMethodsOn,
        },
        {
            special: 'NEW_JOBAD',
            name: 'Ny jobbannonse',
            description: 'Varslinger at en ny jobbanonse er ute',
            defaultMethods: allMethodsOff,
            availableMethods: allMethodsOn,
        },
        {
            special: 'NEW_OMEGAQUOTE',
            name: 'Ny omegaquote',
            description: 'Varslinger om en ny omega quote',
            defaultMethods: allMethodsOff,
            availableMethods: allMethodsOn,
        },
        {
            name: 'Informasjon fra HS',
            description: 'Varsling når Hovedstyret vil gi ut informasjon',
            defaultMethods: {
                email: true,
                emailWeekly: false,
                push: false
            },
            availableMethods: {
                email: true,
                emailWeekly: false,
                push: false
            },
        },
        {
            name: 'Informasjon fra Blæstcom',
            description: 'Her kommer det varslinger om Omega Merch',
            defaultMethods: allMethodsOn,
            availableMethods: allMethodsOn,
        },
    ]

    const DEFAULT_NOTIFCIATION_ALIAS = 'noreply@omega.ntnu.no'

    const rChan = channels.find(c => c.special === 'ROOT')

    if (!rChan) {
        throw new Error('No ROOT channel found')
    }

    const seedSpecialChannels = new Set<SpecialNotificationChannel>()
    const specialEnums = Object.keys(SpecialNotificationChannel)
    for (const c of channels) {
        if (c.special) {
            if (!specialEnums.includes(c.special)) {
                throw new Error(`Invalid special channel type ${c.special}`)
            }
            seedSpecialChannels.add(c.special)
        }
    }

    if (seedSpecialChannels.size != specialEnums.length) {
        throw new Error('Missing a least one special notification channel')
    }

    const rootAvailable = (await prisma.notificationMethod.create({
        data: rChan.availableMethods
    })).id

    const rootDefault = (await prisma.notificationMethod.create({
        data: rChan.defaultMethods
    })).id

    const rootMailAlias = (await prisma.mailAlias.findUniqueOrThrow({
        where: {
            address: DEFAULT_NOTIFCIATION_ALIAS,
        }
    })).id

    await prisma.$queryRaw`INSERT INTO "NotificationChannel" (id, "parentId", name, description, special, "defaultMethodsId", "availableMethodsId", "mailAliasId") values(default, lastval(), ${rChan.name}, ${rChan.description}, 'ROOT', ${rootDefault}, ${rootAvailable}, ${rootMailAlias});`

    await Promise.all(channels.filter(c => c.special != 'ROOT').map(c => prisma.notificationChannel.create({
        data: {
            name: c.name,
            description: c.description,
            availableMethods: {
                create: c.availableMethods,
            },
            defaultMethods: {
                create: c.defaultMethods,
            },
            special: c.special,
            parent: {
                connect: {
                    special: 'ROOT',
                }
            },
            mailAlias: {
                connect: {
                    address: DEFAULT_NOTIFCIATION_ALIAS,
                }
            }
        }
    })))
}
