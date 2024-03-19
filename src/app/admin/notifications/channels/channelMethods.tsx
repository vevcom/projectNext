
import type { NotificationMethod } from "@prisma/client"
import Checkbox from "@/app/components/UI/Checkbox"
import styles from "./channelMethods.module.scss"

export default function ChannelMethods({
    title,
    formPrefix,
    methods
} : {
    title: string,
    formPrefix: string,
    methods: Omit<NotificationMethod, "id">
}) {

    return <div className={styles.channelMethods}>
        <h4>{title}</h4>

        {Object.entries(methods).map(([key, value]) => {
            return <Checkbox label={key} name={`${formPrefix}_${key}`} defaultChecked={value}/>
        })}
    </div>
    
}