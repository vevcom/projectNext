'use client'
import styles from './RegistrationUI.module.scss'
import CountDown from '@/components/countDown/CountDown'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import SubmitButton from '@/components/UI/SubmitButton'
import {
    createEventRegistrationAction,
    eventRegistrationDestroyAction,
    eventRegistrationUpdateNotesAction
} from '@/services/events/registration/actions'
import { configureAction } from '@/services/configureAction'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import type { EventExpanded } from '@/services/events/types'
import type { EventRegistration } from '@/prisma-generated-pn-types'

enum RegistrationButtonState {
    NOT_REGISTERED = 'NOT_REGISTERED',
    REGISTERED = 'REGISTERED',
    FULL = 'FULL',
    ON_WAITING_LIST = 'ON_WAITING_LIST',
    WAITING_LIST_OPEN = 'WAITING_LIST_OPEN',
    REGISTRATION_NOT_OPEN = 'REGISTRATION_NOT_OPEN',
    REGISTRATION_CLOSED = 'REGISTRATION_CLOSED',
    ERROR = 'ERROR',
}

export default function RegistrationUI({
    event,
    onWaitingList,
    registration,
}: {
    event: EventExpanded,
    onWaitingList: boolean,
    registration?: EventRegistration,
}) {
    if (!event.takesRegistration) {
        throw new Error('Can only show registration button for event that take registration')
    }

    const getInitialBtnState = (_onWaitingList: boolean, _registration?: EventRegistration) => {
        if (_onWaitingList) {
            return RegistrationButtonState.ON_WAITING_LIST
        }
        if (_registration) {
            return RegistrationButtonState.REGISTERED
        }
        if (event.registrationStart > new Date()) {
            return RegistrationButtonState.REGISTRATION_NOT_OPEN
        }
        if (event._count.eventRegistrations >= event.places) {
            if (event.waitingList) {
                return RegistrationButtonState.WAITING_LIST_OPEN
            }
            return RegistrationButtonState.FULL
        }
        if (event.registrationEnd < new Date()) {
            return RegistrationButtonState.REGISTRATION_CLOSED
        }
        return RegistrationButtonState.NOT_REGISTERED
    }

    const [errorText, setErrorText] = useState('')
    const [registrationState, setRegistrationState] = useState(registration)

    const [btnState, setBtnState] = useState(getInitialBtnState(onWaitingList, registration))
    const [btnPending, setBtnPending] = useState(false)
    const [btnKey, setBtnKey] = useState(1)

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
        setBtnPending(true)

        if (registrationState) {
            const result = await eventRegistrationDestroyAction({
                params: { registrationId: registrationState.id },
            })
            if (result.success) {
                setBtnState(getInitialBtnState(false, undefined))
                setRegistrationState(undefined)
            } else if (result.error && result.error.length > 0) {
                const message = result.error[0].message
                setErrorText(message)
                setBtnState(RegistrationButtonState.ERROR)
            } else {
                setErrorText('Kunne ikke melde deg av påmelding.')
                setBtnState(RegistrationButtonState.ERROR)
            }
        } else {
            const result = await createEventRegistrationAction({
                params: {
                    userId: session.data.user.id,
                    eventId: event.id,
                }
            })

            if (result.success) {
                if (result.data.onWaitingList) {
                    setBtnState(RegistrationButtonState.ON_WAITING_LIST)
                } else {
                    setBtnState(RegistrationButtonState.REGISTERED)
                }
                setRegistrationState(result.data.result)
            } else if (result.error && result.error.length > 0) {
                const message = result.error[0].message
                setErrorText(message)
                setBtnState(RegistrationButtonState.ERROR)
            } else {
                setErrorText('Kunne ikke melde deg på.')
                setBtnState(RegistrationButtonState.ERROR)
            }
        }

        setBtnPending(false)
        setBtnKey(btnKey + 1)
    }

    return <>
        {btnState === RegistrationButtonState.REGISTRATION_NOT_OPEN && (
            <p>Påmeldingen åpner om <CountDown referenceDate={event.registrationStart} /></p>
        )}

        <SubmitButton
            success={false}
            confirmation={
                btnState === RegistrationButtonState.REGISTERED ||
                    btnState === RegistrationButtonState.ON_WAITING_LIST
                    ? {
                        confirm: true,
                        text: 'Er du sikker på at du vil melde deg av?'
                    }
                    : undefined
            }
            disabled={
                btnState !== RegistrationButtonState.NOT_REGISTERED &&
                btnState !== RegistrationButtonState.WAITING_LIST_OPEN &&
                btnState !== RegistrationButtonState.REGISTERED &&
                btnState !== RegistrationButtonState.ON_WAITING_LIST
            }
            color={
                btnState === RegistrationButtonState.REGISTERED ||
                    btnState === RegistrationButtonState.ON_WAITING_LIST
                    ? 'red'
                    : 'primary'
            }
            className={styles.registrationButton}
            onClick={buttonOnClick}
            pending={btnPending}
            key={btnKey}
        >
            {(
                btnState === RegistrationButtonState.NOT_REGISTERED ||
                btnState === RegistrationButtonState.REGISTRATION_NOT_OPEN
            ) && 'Meld meg på'}
            {btnState === RegistrationButtonState.REGISTERED && 'Meld av arrangement'}
            {btnState === RegistrationButtonState.ON_WAITING_LIST && 'Meld av venteliste'}
            {btnState === RegistrationButtonState.FULL && 'Fullt'}
            {btnState === RegistrationButtonState.WAITING_LIST_OPEN && 'Meld meg på venteliste'}
            {btnState === RegistrationButtonState.ERROR && errorText}
            {btnState === RegistrationButtonState.REGISTRATION_CLOSED && 'Påmeldingen er over'}
        </SubmitButton>

        {registrationState && event.registrationEnd > new Date() && <Form
            action={configureAction(
                eventRegistrationUpdateNotesAction,
                { params: { registrationId: registrationState.id } }
            )}
            submitText="Oppdater notat"
        >
            <TextInput name="note" label="Notat" defaultValue={registrationState.note || ''} />
        </Form>}

    </>
}
