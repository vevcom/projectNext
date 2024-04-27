"use client"
import Select from "@/app/components/UI/Select";
import Form from "@/app/components/Form/Form";
import { NotificationChannelWithMethods } from "@/server/notifications/Types";
import TextInput from "@/app/components/UI/TextInput";
import Textarea from "@/app/components/UI/Textarea";
import styles from "./notificaionForm.module.scss"


export default function NotificaionForm({
    channels,
}: {
    channels: NotificationChannelWithMethods[]
}) {

    return <Form
        submitText="Send varsel"
        className={styles.notificaionForm}
    >
        <Select
            name="channelId"
            options={channels.map(c => ({
                value: c.id,
                label: c.name,
            }))}
            className={styles.select}
            label="Varlisngskanal"
        />

        <TextInput name="title" label="Tittel" />
        <Textarea name="message" label="Melding" className={styles.textArea} />
    </Form>
}