import { SpecialNotificationChannel } from '@/generated/pn'
import type { NotificationChannel, PrismaClient } from '@/generated/pn'
import { Prisma } from '@/generated/pn';

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
            name: "Ny hendelse",
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
            name: "Ny artikkel",
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

    async function upsertToPrisma(special : SpecialNotificationChannel) {
        return prisma.notificationChannel.upsert({
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
                parent: {
                    connect: {
                        special: "ROOT"
                    }
                },
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
                parent: {
                    connect: {
                        special: "ROOT"
                    }
                },
            }
        })
    }

    const rChan = channelInfo.ROOT

    const rootAvailable = (await prisma.notificationMethod.create({
        data: rChan.availableMethods
    })).id

    
    if (rChan.defaultMethods) {

        let rootDefault = (await prisma.notificationMethod.create({
            data: rChan.defaultMethods
        })).id

        await prisma.$queryRaw`INSERT INTO "NotificationChannel" (id, "parentId", name, description, special, "defaultMethodsId", "availableMethodsId") values(default, lastval(), ${rChan.name}, ${rChan.description}, 'ROOT', ${rootDefault}, ${rootAvailable});`
    } else {
        await prisma.$queryRaw`INSERT INTO "NotificationChannel" (id, "parentId", name, description, special, "availableMethodsId") values(default, lastval(), ${rChan.name}, ${rChan.description}, 'ROOT', ${rootAvailable});`
    }


    await Promise.all(keys.filter(special => special !== "ROOT").map((special) => upsertToPrisma(special)))
}
