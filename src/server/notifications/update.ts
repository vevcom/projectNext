import "server-only"
import { NotificationChannelWithMethods } from "./Types"
import { prismaCall } from "@/server/prismaCall"
import type { NotificationMethodType } from "./Types"
import type { NotificationMethod, Prisma } from "@prisma/client"
import { ServerError } from "@/server/error"
import { convertFromPrismaMethods } from "./ConfigVars"
import { readChannelsAsFlatObject } from "./read"

export async function updateNotificationChannel({
    id,
    name,
    description,
    parentId,
    availableMethods,
    defaultMethods,
}: Omit<NotificationChannelWithMethods, 'special'>): Promise<NotificationChannelWithMethods> {

    const allChannels = await readChannelsAsFlatObject();
    const currentChannel = allChannels[id];
    if (!currentChannel) {
        throw new ServerError("NOT FOUND", "Channel not found");
    }

    function appendParentId() {
        if (parentId === id && currentChannel?.special !== "ROOT") {
            throw new ServerError("BAD PARAMETERS", "Cannot set parent to self, unless the channel is ROOT")
        }

        // Prevent loops from beeing created
        let channelPointer = parentId;
        let iterations = 0;
        while (allChannels[channelPointer]?.special !== "ROOT") {
            if (channelPointer === id) {
                throw new ServerError("BAD PARAMETERS", "Cannot set parent in a loop")
            }
            channelPointer = allChannels[channelPointer]?.parentId;
            iterations++;

            if (iterations > 1000) {
                throw new ServerError("UNKNOWN ERROR", "Unknown error when checking for loops in parent chain")
            }
        }

        return {
            parent: {
                connect: {
                    id: parentId
                }
            }
        }
    }

    function appendMethods(
        name: NotificationMethodType,
        value: Omit<NotificationMethod, 'id'> | undefined,
    ) {
        if (!currentChannel?.[name] && value) {
            return {
                [name]: {
                    create: value
                }
            }
        }
        if (currentChannel?.[name] && !value) {
            return {
                [name]: {
                    delete: true
                }
            }
        }
        if (currentChannel?.[name] && value) {
            return {
                [name]: {
                    update: value
                }
            }
        }
    }

    // To prevent a child channel from having more available methods than the parent
    if (availableMethods) {
        let parentChannel = allChannels[parentId];
        if (!parentChannel) {
            throw new ServerError("UNKNOWN ERROR", "A relation is pointing to a non-existing parent channel")
        }

        // In the case where the availableMethods is null, search upward the three
        while (!parentChannel?.availableMethods && parentChannel?.special !== "ROOT") {
            parentChannel = allChannels[parentChannel?.parentId];
            if (!parentChannel) {
                throw new ServerError("UNKNOWN ERROR", "A relation is pointing to a non-existing parent channel")
            }
        }

        if (parentChannel?.special === "ROOT" && !parentChannel?.availableMethods) {
            throw new ServerError("UNKNOWN ERROR", "The ROOT channel should have available methods")
        }

        Object.entries(prisma.notificationMethod)
            .map(([key]) => key)
            .forEach((key) => {
                if (parentChannel.availableMethods?.[key] || availableMethods[key] !== parentChannel.availableMethods?.[key]) {
                    throw new ServerError(
                        "BAD PARAMETERS",
                        "Child channel cannot have more available methods than its parent"
                    )
                }
            })
    }

    const results = await prisma.notificationChannel.update({
        where: {
            id,
        },
        data: {
            name: name,
            description: description,
            ...appendParentId(),
            ...appendMethods("availableMethods", availableMethods),
            ...appendMethods("defaultMethods", defaultMethods),
        },
        include: {
            availableMethods: true,
            defaultMethods: true,
        }
    })

    return convertFromPrismaMethods(results)
}