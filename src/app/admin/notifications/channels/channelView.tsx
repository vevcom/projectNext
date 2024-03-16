import styles from "./channelView.module.scss";
import ChannelList from "./channelList";
import type { NotificationChannelWithMethods } from "@/server/notifications/Types";

export default function ChannelView({channels} : {channels: NotificationChannelWithMethods[]}) {
  return <div className={styles.container}>
    <ChannelList channels={channels}/>
  </div>;
}