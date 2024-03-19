import { SpecialNotificationChannel } from '@/generated/pn'
import type { PrismaClient } from '@/generated/pn'

type ChannelInfo = {
    name: string
    description: string
    defaultMethods?: {
        email: boolean
        push: boolean
        emailWeekly: boolean
    }
    availableMethods: {
        email: boolean
        push: boolean
        emailWeekly: boolean
    }
}

function createChanneInfo(obj : ChannelInfo) : ChannelInfo {
    return obj;
}


export default async function seedNotificationChannels(prisma: PrismaClient) {
    const keys = Object.keys(SpecialNotificationChannel) as SpecialNotificationChannel[]

    const channelInfo = {
        ROOT: createChanneInfo({
            name: "Alle varslinger",
            description: "Denne kanalen styrer alle varslinger",
            defaultMethods: {
                email: false,
                push: false,
                emailWeekly: false,
            },
            availableMethods: {
                email: true,
                push: true,
                emailWeekly: true,
            },
        }),
        NEW_EVENT: createChanneInfo({
            name: "Nye hendelser",
            description: "Varslinger om nye hendelser",
            defaultMethods: {
                email: true,
                push: false,
                emailWeekly: false,
            },
            availableMethods: {
                email: true,
                push: true,
                emailWeekly: true,
            },
        }),
        NEW_OMBUL: createChanneInfo({
            name: "Ny ombul",
            description: "Varsling når det kommer ny ombul",
            availableMethods: {
                email: true,
                push: true,
                emailWeekly: true,
            },
        }),
        NEW_ARTICLE: createChanneInfo({
            name: "Nye artikler",
            description: "Varslinger om nye artikler",
            availableMethods: {
                email: true,
                push: true,
                emailWeekly: true,
            },
        }),
    }

    if (Object.keys(channelInfo).toString() !== keys.toString()) {
        throw new Error("Not all special channels are handled")
    }

    await Promise.all(keys.map((special) => prisma.notificationChannel.upsert({
            where: {
                special
            },
            update: {
                name: channelInfo[special].name,
                description: channelInfo[special].description,
                availableMethods: {
                    update: channelInfo[special].availableMethods,
                },
                ...(channelInfo[special].defaultMethods ? {
                    defaultMethods: {
                        update: channelInfo[special].defaultMethods,
                    },
                } : {}),
            },
            create: {
                name: channelInfo[special].name,
                description: channelInfo[special].description,
                special,
                availableMethods: {
                    create: channelInfo[special].availableMethods,
                },
                ...(channelInfo[special].defaultMethods ? {
                    defaultMethods: {
                        create: channelInfo[special].defaultMethods,
                    },
                } : {}),
            }
        })
    ))
}
