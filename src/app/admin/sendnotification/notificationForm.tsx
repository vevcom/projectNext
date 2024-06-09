'use client'
import styles from './notificaionForm.module.scss'
import Select from '@/app/components/UI/Select'
import Form from '@/app/components/Form/Form'
import TextInput from '@/app/components/UI/TextInput'
import Textarea from '@/app/components/UI/Textarea'
import { dispatchNotificationAction } from '@/actions/notifications/create'
import { useState } from 'react'
import type { NotificationChannel } from '@/server/notifications/Types'


export default function NotificaionForm({
    channels,
}: {
    channels: NotificationChannel[]
}) {
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    return <>
        <Form
            submitText="Send varsel"
            className={styles.notificaionForm}
            action={dispatchNotificationAction}
            successCallback={data => {
                if (data) {
                    setSuccessMessage(`
                        Varsling lagt til i køen til ${data.recipients} mottakere.
                        Det kan ta ganske lang tid før alle får varselet
                    `)
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

            <p>
                Dersom du ønser å gjøre varselet mer personlig kan man bruke brukerinformasjon i varselet.
                Under er en liste med kommandoer. Dersom det kun er e-post varslingere så kan du skrive i markdwon.
            </p>
            <table>
                <tr>
                    <th>%n</th>
                    <td>Fornavn</td>
                </tr>
                <tr>
                    <th>%N</th>
                    <td>Fult navn</td>
                </tr>
                <tr>
                    <th>%u</th>
                    <td>Brukernavn</td>
                </tr>
            </table>

        </Form>
        { successMessage && <p>{successMessage}</p>}
    </>
}
