"use client"

import type { NotificationChannelWithMethods } from "@/server/notifications/Types"

export default async function ChannelList({
    channels
}: {
    channels: NotificationChannelWithMethods[],
}) {
    return (
        <div>
            {channels.map(channel => (
                <div>
                    <h2>{channel.name}</h2>
                </div>
            ))}
        </div>
    )
}