
import type { NotificationMethod } from "@prisma/client"
import Checkbox from "@/app/components/UI/Checkbox"
import styles from "./channelMethods.module.scss"

export default function ChannelMethods({
    title,
    formPrefix,
    methods,
    editable,
} : {
    title: string,
    formPrefix: string,
    methods: Omit<NotificationMethod, "id">
    editable?: Omit<NotificationMethod, "id"> & {[key: string]: boolean}
}) {

    return <div className={styles.channelMethods}>
        <h4>{title}</h4>

        {Object.entries(methods).map(([key, value]) => {
            const canEdit = editable && editable[key];
            return <Checkbox label={key} name={`${formPrefix}_${key}`} defaultChecked={value} disabled={!canEdit} />
        })}
    </div>
    
}