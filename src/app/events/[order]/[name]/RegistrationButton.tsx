'use client'
import Button from '@/components/UI/Button'
import { createEventRegistrationAction } from '@/actions/events/registration'
import CountDown from '@/components/countDown/CountDown'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import type { Event } from '@prisma/client'


enum RegistrationButtonState {
    NOT_REGISTERED = 'NOT_REGISTERED',
    REGISTERED = 'REGISTERED',
    FULL = 'FULL',
    REGISTRATION_NOT_OPEN = 'REGISTRATION_NOT_OPEN',
    ERROR = 'ERROR',
}

export default function RegistrationButton({
    event
}: {
    event: Event & {
        _count: {
            eventRegistrations: number
        }
    }
}) {
    if (!event.takesRegistration) {
        throw new Error('Can only show registration button for event that take registration')
    }

    const getInitialBtnState = () => {
        if (event.registrationStart > new Date()) {
            return RegistrationButtonState.REGISTRATION_NOT_OPEN
        }
        if (event._count.eventRegistrations >= event.places) {
            return RegistrationButtonState.FULL
        }
        return RegistrationButtonState.NOT_REGISTERED
    }

    const [errorText, setErrorText] = useState('')

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
        } else if (result.error && result.error.length > 0) {
            const message = result.error[0].message
            setErrorText(message)
            setBtnState(RegistrationButtonState.ERROR)
        } else {
            setErrorText('Kunne ikke melde deg på.')
            setBtnState(RegistrationButtonState.ERROR)
        }
    }

    return <Button
        disabled={btnState !== RegistrationButtonState.NOT_REGISTERED}
        onClick={buttonOnClick}
    >
        {btnState === RegistrationButtonState.NOT_REGISTERED && 'Meld meg på'}
        {btnState === RegistrationButtonState.REGISTERED && 'Påmeldt'}
        {btnState === RegistrationButtonState.FULL && 'Fullt'}
        {btnState === RegistrationButtonState.REGISTRATION_NOT_OPEN && <>
            Påmeldingen åpner om <CountDown referenceDate={event.registrationStart} />
        </>}
        {btnState === RegistrationButtonState.ERROR && errorText}
    </Button>
}
