import { SpecialNotificationChannel } from '@/generated/pn'
import type { PrismaClient } from '@/generated/pn'

export default async function seedNotificationChannels(prisma: PrismaClient) {
    const keys = Object.keys(SpecialNotificationChannel) as SpecialNotificationChannel[]

    const channelInfo = {
        ROOT: {
            name: "Alle varslinger",
            description: "Denne kanelen styrer alle varslinger",
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
        },
        NEW_EVENT: {
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
        },
        NEW_OMBUL: {
            name: "Ny ombud",
            description: "Varling når det kommer ny ombul",
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
        },
        NEW_ARTICLE: {
            name: "Nye artikler",
            description: "Varslinger om nye artikler",
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
        },
    }

    if (Object.keys(channelInfo).toString() !== keys.toString()) {
        throw new Error("Not all special channels are handled")
    }

    await Promise.all(keys.map((special) =>
        prisma.notificationChannel.upsert({
            where: {
                special
            },
            update: {
                name: channelInfo[special].name,
                description: channelInfo[special].description,
                defaultMethods: {
                    update: channelInfo[special].defaultMethods,
                },
                availableMethods: {
                    update: channelInfo[special].availableMethods,
                },
            },
            create: {
                name: channelInfo[special].name,
                description: channelInfo[special].description,
                special,
                defaultMethods: {
                    create: channelInfo[special].defaultMethods,
                },
                availableMethods: {
                    create: channelInfo[special].availableMethods,
                },
            }
        })
    ))
}
