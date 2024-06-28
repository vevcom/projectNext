import { SpecialNotificationChannel } from '@/generated/pn'
import type { NotificationMethod, PrismaClient } from '@/generated/pn'

type ChannelInfo = {
    special?: SpecialNotificationChannel
    name: string
    description: string
    defaultMethods: Omit<NotificationMethod, 'id'>
    availableMethods: Omit<NotificationMethod, 'id'>
    alias?: string
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
    const specialKeys = new Set(Object.keys(SpecialNotificationChannel) as SpecialNotificationChannel[])

    const channels: ChannelInfo[] = [
        {
            special: 'ROOT',
            name: 'Alle varslinger',
            description: 'Denne kanalen styrer alle varslinger',
            defaultMethods: allMethodsOn,
            availableMethods: allMethodsOn,
        },
        {
            special: 'NEW_EVENT',
            name: 'Nytt arrangement',
            description: 'Varslinger om nye arrangementer',
            defaultMethods: {
                email: true,
                emailWeekly: false,
                push: true,
            },
            availableMethods: allMethodsOn,
        },
        {
            special: 'NEW_OMBUL',
            name: 'Ny ombul',
            description: 'Varsling når det kommer ny ombul',
            defaultMethods: {
                email: false,
                emailWeekly: true,
                push: false,
            },
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
            defaultMethods: {
                email: false,
                emailWeekly: true,
                push: false,
            },
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
            special: 'EVENT_PARTICIPANT',
            name: 'Arrangements varsel',
            description: 'Varslinger sendt ut til deltakere i et arrangement du er påmeldt på',
            defaultMethods: {
                email: true,
                emailWeekly: false,
                push: true,
            },
            availableMethods: {
                email: true,
                emailWeekly: false,
                push: true,
            },
        },
        {
            name: 'Informasjon fra HS',
            description: 'Varsling når Hovedstyret vil gi ut informasjon',
            defaultMethods: {
                email: true,
                emailWeekly: false,
                push: false
            },
            availableMethods: allMethodsOn,
            alias: 'hs',
        },
        {
            name: 'Merch',
            description: 'Her kommer det varslinger om Omega Merch fra Blaest-Com',
            defaultMethods: {
                email: false,
                emailWeekly: true,
                push: false,
            },
            availableMethods: allMethodsOn,
            alias: 'bleast',
        },
        {
            name: 'Driftsstatus',
            description: 'Her kommer det varslinger dersom noe på veven ikke funnker, eller ved planlagt vedlikehld',
            defaultMethods: {
                email: true,
                emailWeekly: false,
                push: false,
            },
            availableMethods: allMethodsOn,
            alias: 'vevcom',
        },
        {
            name: 'Contactor',
            description: 'Her kommer det diverse informasjon fra contactor',
            defaultMethods: {
                email: true,
                emailWeekly: false,
                push: false,
            },
            availableMethods: allMethodsOn,
            alias: 'contactor',
        },
        {
            name: 'Mat på Gløshaugen',
            description: `Her kommer informasjon om når det er vafler på Lophtet eller 
                          noe annen mat i området rundt El-bygget`,
            defaultMethods: {
                email: true,
                emailWeekly: false,
                push: true,
            },
            availableMethods: {
                email: true,
                emailWeekly: false,
                push: true,
            },
        },
        {
            name: 'Diverse',
            description: 'Her kommer informasjon som ellers ikke passer inn i kategoriene',
            defaultMethods: allMethodsOn,
            availableMethods: allMethodsOn,
        },
    ]

    channels.forEach(c => {
        if (c.special) {
            if (!specialKeys.has(c.special)) {
                throw new Error(`The seeding data is not valid. The special key: ${c.special} is duplicate or not valid.`)
            }
            specialKeys.delete(c.special)
        }
    })

    if (specialKeys.size) {
        throw new Error(`Not all special keys are present in the seeding data. Missing: ${specialKeys}`)
    }

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

    if (seedSpecialChannels.size !== specialEnums.length) {
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

    await prisma.$queryRaw`INSERT INTO
        "NotificationChannel" (
            id,
            "parentId",
            name,
            description,
            special,
            "defaultMethodsId",
            "availableMethodsId",
            "mailAliasId"
        ) values (
            default,
            lastval(),
            ${rChan.name},
            ${rChan.description},
            'ROOT',
            ${rootDefault},
            ${rootAvailable},
            ${rootMailAlias}
        );`

    await Promise.all(channels.filter(c => c.special !== 'ROOT').map(c => prisma.notificationChannel.create({
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
                    address: c.alias ? `${c.alias}@omega.ntnu.no` : DEFAULT_NOTIFCIATION_ALIAS,
                }
            }
        }
    })))
}
