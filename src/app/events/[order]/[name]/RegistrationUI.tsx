'use client'
import Button from '@/components/UI/Button'
import { createEventRegistrationAction, eventRegistrationUpdateNotesAction } from '@/actions/events/registration'
import CountDown from '@/components/countDown/CountDown'
import Form from '@/components/Form/Form'
import { bindParams } from '@/actions/bind'
import TextInput from '@/components/UI/TextInput'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import type { Event, EventRegistration } from '@prisma/client'


enum RegistrationButtonState {
    NOT_REGISTERED = 'NOT_REGISTERED',
    REGISTERED = 'REGISTERED',
    FULL = 'FULL',
    REGISTRATION_NOT_OPEN = 'REGISTRATION_NOT_OPEN',
    REGISTRATION_CLOSED = 'REGISTRATION_CLOSED',
    ERROR = 'ERROR',
}

export default function RegistrationUI({
    event,
    registration,
}: {
    event: Event & {
        _count: {
            eventRegistrations: number
        }
    },
    registration?: EventRegistration,
}) {
    if (!event.takesRegistration) {
        throw new Error('Can only show registration button for event that take registration')
    }

    const getInitialBtnState = () => {
        if (registration) {
            return RegistrationButtonState.REGISTERED
        }
        if (event.registrationStart > new Date()) {
            return RegistrationButtonState.REGISTRATION_NOT_OPEN
        }
        if (event._count.eventRegistrations >= event.places) {
            return RegistrationButtonState.FULL
        }
        if (event.registrationEnd < new Date()) {
            return RegistrationButtonState.REGISTRATION_CLOSED
        }
        return RegistrationButtonState.NOT_REGISTERED
    }

    const [errorText, setErrorText] = useState('')
    const [registrationState, setRegistrationState] = useState(registration)

    const [btnState, setBtnState] = useState(getInitialBtnState())

    const session = useSession()

    useEffect(() => {
        const timeUntilRegistration = event.registrationStart.getTime() - (new Date()).getTime()
        let timeoutId: ReturnType<typeof setTimeout>
        if (timeUntilRegistration > 0) {
            timeoutId = setTimeout(() => {
                setBtnState(RegistrationButtonState.NOT_REGISTERED)
            }, timeUntilRegistration)
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
        }
    })

    if (!session.data) {
        return <>Logg inn for å melde deg på</>
    }

    const buttonOnClick = async () => {
        const result = await createEventRegistrationAction({
            userId: session.data.user.id,
            eventId: event.id,
        })

        if (result.success) {
            setBtnState(RegistrationButtonState.REGISTERED)
            setRegistrationState(result.data)
        } else if (result.error && result.error.length > 0) {
            const message = result.error[0].message
            setErrorText(message)
            setBtnState(RegistrationButtonState.ERROR)
        } else {
            setErrorText('Kunne ikke melde deg på.')
            setBtnState(RegistrationButtonState.ERROR)
        }
    }

    return <>
        {btnState === RegistrationButtonState.REGISTRATION_NOT_OPEN && (
            <p>Påmeldingen åpner om <CountDown referenceDate={event.registrationStart} /></p>
        )}

        <Button
            disabled={btnState !== RegistrationButtonState.NOT_REGISTERED}
            onClick={buttonOnClick}
        >
            {(
                btnState === RegistrationButtonState.NOT_REGISTERED ||
                btnState === RegistrationButtonState.REGISTRATION_NOT_OPEN
            ) && 'Meld meg på'}
            {btnState === RegistrationButtonState.REGISTERED && 'Påmeldt'}
            {btnState === RegistrationButtonState.FULL && 'Fullt'}
            {btnState === RegistrationButtonState.ERROR && errorText}
            {btnState === RegistrationButtonState.REGISTRATION_CLOSED && 'Påmeldingen er over'}
        </Button>

        {registrationState && event.registrationEnd > new Date() && <Form
            action={bindParams(eventRegistrationUpdateNotesAction, { registrationId: registrationState.id })}
            submitText="Oppdater kommentar"
        >
            <TextInput name="notes" label="Kommentar" defaultValue={registrationState.note || ''} />
        </Form>}

    </>
}
