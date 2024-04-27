"use client"
import Select from "@/app/components/UI/Select";
import Form from "@/app/components/Form/Form";
import { NotificationChannelWithMethods } from "@/server/notifications/Types";
import TextInput from "@/app/components/UI/TextInput";
import Textarea from "@/app/components/UI/Textarea";
import styles from "./notificaionForm.module.scss"
import { dispatchNotificationAction } from "@/actions/notifications/create";
import { useState } from "react";


export default function NotificaionForm({
    channels,
}: {
    channels: NotificationChannelWithMethods[]
}) {

    const [ successMessage, setSuccessMessage] = useState<string | null>(null);

    return <>
        <Form
            submitText="Send varsel"
            className={styles.notificaionForm}
            action={dispatchNotificationAction}
            successCallback={data => {
                if (data) {
                    setSuccessMessage(`Varsling lagt til i køen til ${data.recipients} mottakere. Det kan ta ganske lang tid før alle får varselet`)
                }
            }}
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
        { successMessage && <p>{successMessage}</p>}
    </>
}