'use client'
import { registerNewEmailAction } from '@/actions/users/update'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { useUser } from '@/auth/useUser'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default async function EmailRegistrationForm() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || 'users/me'

    const [feedback, setFeedback] = useState<string | null>(null)

    const { push } = useRouter()

    const userAuth = useUser({
        userRequired: true,
        shouldRedirect: true,
    })

    if (userAuth.user?.acceptedTerms) {
        push(callbackUrl)
    }

    if (userAuth.user?.emailVerified) {
        push(`/register?callbackUrl=${callbackUrl}`)
    }

    return <>
        <Form
            title="Sett e-posten din"
            submitText="Verifiser e-post"
            action={registerNewEmailAction}
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
            <TextInput label="E-post" name="email" defaultValue={userAuth.user?.email}/>
        </Form>

        { feedback && <p>{ feedback }</p> }
    </>
}
