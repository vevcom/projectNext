'use client'
import styles from './mailForm.module.scss'
import sendMail from '@/actions/sendmail/send'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import Textarea from '@/components/UI/Textarea'


export default function MailForm() {
    return <Form
        action={sendMail}
        submitText="Send elektronisk post"
        className={styles.mailForm}
        buttonClassName={styles.mailButton}
    >
        <TextInput name="from" label="Avsender"/>
        <TextInput name="to" label="Mottaker"/>
        <TextInput name="subject" label="Emne"/>

        <Textarea name="text" label="Melding" className={styles.textArea}/>

    </Form>
}
