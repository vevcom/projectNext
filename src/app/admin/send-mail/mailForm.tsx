'use client'
import styles from './mailForm.module.scss'
import sendMail from '@/actions/sendmail/send'
import Form from '@/app/components/Form/Form'
import Select from '@/app/components/UI/Select'
import TextInput from '@/app/components/UI/TextInput'
import Textarea from '@/app/components/UI/Textarea'
import { MailAlias } from '@prisma/client'


export default function MailForm({
    aliases,
}: {
    aliases: MailAlias[]
}) {
    return <Form
        action={sendMail}
        submitText="Send elektronisk post"
        className={styles.mailForm}
        buttonClassName={styles.mailButton}
    >
        <Select
            name="from"
            label="Avsender"
            options={aliases.map(alias => ({
                value: alias.address
            }))}
            className={styles.select}
        />
        <TextInput name="to" label="Mottaker"/>
        <TextInput name="subject" label="Emne"/>

        <Textarea name="text" label="Melding" className={styles.textArea}/>

    </Form>
}
