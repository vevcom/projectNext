"use client"

import { resetPasswordAction } from "@/actions/auth/resetPassword";
import Form from "@/app/components/Form/Form";
import TextInput from "@/app/components/UI/TextInput";
import { useState } from "react";



export default function ResetPassword() {

    const [ feedback, setFeedback ] = useState("")

    return <>
        <Form
            submitText="Send epost"
            title="Glemt passord"
            action={resetPasswordAction}
            successCallback={(email) => {
                setFeedback(`
                    Hvis eposten finnes i databasen, er en epost er sendt til ${email} med instruksjoner for
                    å nullstille passordet. Det kan ta noen minutter før den kommer fram`)
            }}
        >
            <TextInput label="Epost" name="email" />
        </Form>
        <p>{ feedback }</p>
    </>
}