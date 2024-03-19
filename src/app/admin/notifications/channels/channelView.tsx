"use client"

import styles from "./channelView.module.scss";
import type { NotificationChannelWithMethods } from "@/server/notifications/Types";
import LargeRadio from "@/app/components/UI/LargeRadio";
import { useState } from "react";
import ChannelSettings from "./channelSettings";

export default function ChannelView({ channels }: { channels: NotificationChannelWithMethods[] }) {

    if (channels.length === 0) {
        throw new Error("No channels found, the special channels should be created.");
    }

    const [selectedChannel, setSelectedChannel] = useState<NotificationChannelWithMethods>(channels[0]);


    function onChannelSelect(channel: NotificationChannelWithMethods | undefined) {
        if (channel) {
            setSelectedChannel(channel);
        }
    }

    return <div className={styles.container}>
        <LargeRadio list={channels} defaultSelection={selectedChannel} onSelect={onChannelSelect} className={styles.channelSelect} />
        <ChannelSettings channel={selectedChannel} allChannels={channels}/>
    </div>;
}