'use client'
import styles from './mailForm.module.scss'
import sendMail from '@/actions/sendmail/send'
import { MailAlias } from '@prisma/client'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import Textarea from '@/components/UI/Textarea'
import { SelectString } from '@/components/UI/Select'


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
        <SelectString
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
