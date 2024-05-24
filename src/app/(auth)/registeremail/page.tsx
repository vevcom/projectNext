'use client'
import { registerNewEmailAction } from '@/actions/users/update'
import Form from '@/app/components/Form/Form'
import TextInput from '@/app/components/UI/TextInput'
import { useUser } from '@/auth/useUser'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default async function Register() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || 'users/me'

    const [ feedback, setFeedback ] = useState<string | null>(null)

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
            title="Sett eposten din"
            submitText="Verifiser epost"
            action={registerNewEmailAction}
            successCallback={(data) => {
                if (data) {
                    if (data.verified) {
                        push(`/register?callbackUrl=${callbackUrl}`)
                    } else {
                        setFeedback(`
                            For å bekrefte at dette er din epost har vi sendt en epost til ${data.email}.
                            Følge instruksjonene i eposten for å fullføre registreringen.
                        `)
                    }
                }
            }}
        >
            <p>
                Velkommen til Veven! Vennligst skriv inn eposten din.
                Du kan bruke ntnu-eposten din, men vær oppmerksom på at du mister tilgang til denne når du er ferdig å studere.
            </p>
            <TextInput label="Epost" name="email" defaultValue={userAuth.user?.email}/>
        </Form>

        { feedback && <p>{ feedback }</p> }
    </>
}
