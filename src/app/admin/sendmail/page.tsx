"use client"

import sendMail from "@/actions/sendmail/send"
import Form from "@/app/components/Form/Form"
import PageWrapper from "@/components/PageWrapper/PageWrapper"
import styles from './page.module.scss'
import TextInput from "@/app/components/UI/TextInput"
import Textarea from "@/app/components/UI/Textarea"



export default function SendMail() {



    return (
        <PageWrapper title="Elektronisk post utsendelse">
            <Form
                action={sendMail}
                submitText="Send elektronisk post"
                className={styles.mailForm}
                buttonClassName={styles.mailButton}
            >
                <TextInput name="sender" label="Avsender"/>
                <TextInput name="recipient" label="Mottaker"/>
                <TextInput name="subject" label="Emne"/>

                <Textarea name="body" label="Melding" className={styles.textArea}/>

            </Form>
        </PageWrapper>
    )
}