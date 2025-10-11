'use client'
import { registerNewEmailAction } from '@/actions/users/update'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { configureAction } from '@/actions/configureAction'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import type { UserFiltered } from '@/services/users/Types'

export default function EmailRegistrationForm({
    user
}: {
    user: UserFiltered
}) {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/users/me'

    const { push } = useRouter()

    const [feedback, setFeedback] = useState<string | null>(null)

    const actionToCall = configureAction(registerNewEmailAction, { params: { id: user.id } })

    return <>
        <Form
            title="Sett e-posten din"
            submitText="Verifiser e-post"
            action={actionToCall}
            successCallback={(data) => {
                if (data) {
                    if (data.verified) {
                        push(`/register?callbackUrl=${callbackUrl}`)
                    } else {
                        setFeedback(`
                            For å bekrefte at dette er din e-post har vi sendt en e-post til ${data.email}.
                            Følg instruksjonene i e-posten for å fullføre registreringen.
                        `)
                    }
                }
            }}
        >
            <p>
                Velkommen til Veven! Vennligst skriv inn e-posten din.
                Du kan bruke ntnu-e-posten din,
                men vær oppmerksom på at du mister tilgang til denne når du er ferdig å studere.
            </p>
            <TextInput label="E-post" name="email" defaultValue={user.email} />
        </Form>

        {feedback && <p>{feedback}</p>}
    </>
}
