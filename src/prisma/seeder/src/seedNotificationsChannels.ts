import { allNotificationMethodsOn } from '@/services/notifications/constants'
import type { PrismaClient } from '@/prisma-generated-pn-client'
import type { NotificationMethod } from '@/prisma-generated-pn-types'
import { SpecialNotificationChannel } from '@/prisma-generated-pn-types'
import { connect } from 'http2'

type ChannelInfo = {
    special?: SpecialNotificationChannel
    name: string
    description: string
    defaultMethods: Omit<NotificationMethod, 'id'>
    availableMethods: Omit<NotificationMethod, 'id'>
    alias?: string
}

export default async function seedNotificationChannels(prisma: PrismaClient) {
    const specialKeys = new Set(Object.keys(SpecialNotificationChannel) as SpecialNotificationChannel[])

    const channels: ChannelInfo[] = [
        {
            special: 'ROOT',
            name: 'Alle varslinger',
            description: 'Denne kanalen styrer alle varslinger',
            defaultMethods: allNotificationMethodsOn,
            availableMethods: allNotificationMethodsOn,
        },
        {
            special: 'NEW_EVENT',
            name: 'Nytt arrangement',
            description: 'Varslinger om nye arrangementer',
            defaultMethods: {
                email: false,
                emailWeekly: true,
            },
            availableMethods: allNotificationMethodsOn,
        },
        {
            special: 'NEW_OMBUL',
            name: 'Ny ombul',
            description: 'Varsling når det kommer ny ombul',
            defaultMethods: allNotificationMethodsOn,
            availableMethods: allNotificationMethodsOn,
        },
        {
            special: 'NEW_NEWS_ARTICLE',
            name: 'Ny nyhetsartikkel',
            description: 'Varslinger om nye artikler',
            defaultMethods: allNotificationMethodsOn,
            availableMethods: allNotificationMethodsOn,
        },
        {
            special: 'NEW_JOBAD',
            name: 'Ny jobbannonse',
            description: 'Varslinger at en ny jobbanonse er ute',
            defaultMethods: allNotificationMethodsOn,
            availableMethods: allNotificationMethodsOn,
        },
        {
            special: 'NEW_OMEGAQUOTE',
            name: 'Ny omegaquote',
            description: 'Varslinger om en ny omega quote',
            defaultMethods: allNotificationMethodsOn,
            availableMethods: allNotificationMethodsOn,
        },
        {
            special: 'EVENT_WAITINGLIST_PROMOTION',
            name: 'Venteliste opprykk',
            description: 'Varsling ved opprykk fra venteliste',
            defaultMethods: {
                email: true,
                emailWeekly: false,
            },
            availableMethods: {
                email: true,
                emailWeekly: false,
            },
        },
        {
            special: 'CABIN_BOOKING_CONFIRMATION',
            name: 'Bekreftelse på heuttebooking',
            description: 'Få en mail som bekreftelse på at du har booka heutta',
            defaultMethods: {
                email: true,
                emailWeekly: false,
            },
            availableMethods: {
                email: true,
                emailWeekly: false,
            },
            alias: 'heuttebooking'
        },
        {
            name: 'Informasjon fra HS',
            description: 'Varsling når Hovedstyret vil gi ut informasjon',
            defaultMethods: {
                email: true,
                emailWeekly: false,
            },
            availableMethods: allNotificationMethodsOn,
            alias: 'hs',
        },
        {
            name: 'Merch',
            description: 'Her kommer det varslinger om Omega Merch fra Blaest-Com',
            defaultMethods: {
                email: true,
                emailWeekly: false,
            },
            availableMethods: allNotificationMethodsOn,
            alias: 'bleast',
        },
        {
            name: 'Driftsstatus',
            description: 'Her kommer det varslinger dersom noe på veven ikke funnker, eller ved planlagt vedlikehld',
            defaultMethods: {
                email: true,
                emailWeekly: false,
            },
            availableMethods: allNotificationMethodsOn,
            alias: 'vevcom',
        },
        {
            name: 'Contactor',
            description: 'Her kommer det diverse informasjon fra contactor',
            defaultMethods: {
                email: true,
                emailWeekly: false,
            },
            availableMethods: allNotificationMethodsOn,
            alias: 'contactor',
        },
        {
            name: 'Mat på Gløshaugen',
            description: `Her kommer informasjon om når det er vafler på Lophtet eller 
                          noe annen mat i området rundt El-bygget`,
            defaultMethods: {
                email: true,
                emailWeekly: false,
            },
            availableMethods: {
                email: true,
                emailWeekly: false,
            },
        },
        {
            name: 'Diverse',
            description: 'Her kommer informasjon som ellers ikke passer inn i kategoriene',
            defaultMethods: {
                email: true,
                emailWeekly: false,
            },
            availableMethods: allNotificationMethodsOn,
        },
    ]

    channels.forEach(channel => {
        if (channel.special) {
            if (!specialKeys.has(channel.special)) {
                throw new Error(
                    `The seeding data is not valid. The special key: ${channel.special} is duplicate or not valid.`
                )
            }
            specialKeys.delete(channel.special)
        }
    })

    if (specialKeys.size) {
        throw new Error(`Not all special keys are present in the seeding data. Missing: ${specialKeys}`)
    }

    const DEFAULT_NOTIFCIATION_ALIAS = 'noreply@omega.ntnu.no'

    const rChan = channels.find(channel => channel.special === 'ROOT')

    if (!rChan) {
        throw new Error('No ROOT channel found')
    }

    const seedSpecialChannels = new Set<SpecialNotificationChannel>()
    const specialEnums = Object.keys(SpecialNotificationChannel)
    for (const channel of channels) {
        if (channel.special) {
            if (!specialEnums.includes(channel.special)) {
                throw new Error(`Invalid special channel type ${channel.special}`)
            }
            seedSpecialChannels.add(channel.special)
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

    // The root is its own parent so we need to set its id explicitly.
    // To do so we find the next available id. This might not be safe in
    // a highly concurrent environment, but for seeding it should be fine.
    const availableId = (await prisma.notificationChannel.aggregate({
        _max: {
            id: true,
        },
    }))._max.id || 1

    await prisma.notificationChannel.create({
        data: {
            parentId: availableId,
            name: rChan.name,
            description: rChan.description,
            special: 'ROOT',
            defaultMethodsId: rootDefault,
            availableMethodsId: rootAvailable,
            mailAliasId: rootMailAlias,
        }
    })

    await Promise.all(channels
        .filter(channel => channel.special !== 'ROOT')
        .map(channel => prisma.notificationChannel.create({
            data: {
                name: channel.name,
                description: channel.description,
                availableMethods: {
                    create: channel.availableMethods,
                },
                defaultMethods: {
                    create: channel.defaultMethods,
                },
                special: channel.special,
                parent: {
                    connect: {
                        special: 'ROOT',
                    }
                },
                mailAlias: {
                    connect: {
                        address: channel.alias ? `${channel.alias}@omega.ntnu.no` : DEFAULT_NOTIFCIATION_ALIAS,
                    }
                }
            }
        }))
    )
}
