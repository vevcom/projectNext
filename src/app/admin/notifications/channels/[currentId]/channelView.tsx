"use client"

import styles from "./channelView.module.scss";
import type { NotificationChannelWithMethods } from "@/server/notifications/Types";
import LargeRadio from "@/app/components/UI/LargeRadio";
import { useState } from "react";
import ChannelSettings from "./channelSettings";
import { notFound, useRouter } from "next/navigation";

export default function ChannelView({
    channels,
    currentId,
}: {
    channels: NotificationChannelWithMethods[],
    currentId: number
}) {

    const [ allChannelsState, setAllChannelsState ] = useState(channels)
    
    const { replace } = useRouter();

    if (allChannelsState.length === 0) {
        throw new Error("No channels found, the special channels should be created.");
    }
    
    function onChannelSelect(channel: NotificationChannelWithMethods | undefined) {
        if (channel) {
            replace(`/admin/notifications/channels/${channel.id}`)
        }
    }
    
    const selectedChannel = allChannelsState.find(c => c.id === currentId);
    
    if (!selectedChannel) {
        notFound()
    }

    return <div className={styles.container}>
        <LargeRadio list={channels} defaultSelection={selectedChannel} onSelect={onChannelSelect} className={styles.channelSelect} />
        <ChannelSettings
            currentChannel={currentId}
            allChannels={allChannelsState}
            onUpdate={(channel) => {
                setAllChannelsState(allChannelsState.map(c => (c.id === channel.id) ? channel : c))
            }}
        />
    </div>
}