"use client"

import sendMail from "@/actions/sendmail/send"
import Form from "@/app/components/Form/Form"
import PageWrapper from "@/components/PageWrapper/PageWrapper"
import styles from './page.module.scss'
import TextInput from "@/app/components/UI/TextInput"
import Textarea from "@/app/components/UI/Textarea"
import { useUser } from "@/auth/client"
import { notFound } from "next/navigation"



export default function SendMail() {

    // TODO: permission checks
    const user = useUser({
        required: true,
    })

    if (!user.authorized) {
        notFound();
    }


    return (
        <PageWrapper title="Elektronisk postutsendelse">
            <Form
                action={sendMail}
                submitText="Send elektronisk post"
                className={styles.mailForm}
                buttonClassName={styles.mailButton}
            >
                <TextInput name="sender" label="Avsender"/>
                <TextInput name="recipient" label="Mottaker"/>
                <TextInput name="subject" label="Emne"/>

                <Textarea name="text" label="Melding" className={styles.textArea}/>

            </Form>
        </PageWrapper>
    )
}