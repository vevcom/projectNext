"use client"

import styles from "./channelView.module.scss";
import type { NotificationChannelWithMethods } from "@/server/notifications/Types";
import LargeRadio from "@/app/components/UI/LargeRadio";
import { useState } from "react";
import ChannelSettings from "./channelSettings";
import { notFound, useRouter } from "next/navigation";
import AddHeaderItemPopUp from "@/app/components/AddHeaderItem/AddHeaderItemPopUp"
import AddNotificationChannel from "./addNotificationChannel"
import PageWrapper from "@/app/components/PageWrapper/PageWrapper"

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

    return <PageWrapper
        title="Varslingskanaler"
        headerItem={
            <AddHeaderItemPopUp PopUpKey="createNewsPop">
                <AddNotificationChannel channels={allChannelsState}/>
            </AddHeaderItemPopUp>
        }
    >
        <div className={styles.container}>
            <LargeRadio list={channels} defaultSelection={selectedChannel} onSelect={onChannelSelect} className={styles.channelSelect} />
            <ChannelSettings
                currentChannel={currentId}
                allChannels={allChannelsState}
                onUpdate={(channel) => {
                    setAllChannelsState(allChannelsState.map(c => (c.id === channel.id) ? channel : c))
                }}
            />
        </div>
    </PageWrapper>
}