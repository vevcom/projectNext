"use client"

import styles from "./channelView.module.scss";
import type { NotificationChannelWithMethods } from "@/server/notifications/Types";
import LargeRadio from "@/app/components/UI/LargeRadio";

export default function ChannelView({channels} : {channels: NotificationChannelWithMethods[]}) {
  return <div className={styles.container}>
    <LargeRadio list={channels} onSelect={console.log}/>
  </div>;
}