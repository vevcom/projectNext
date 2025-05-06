'use client'
import Button from '@/components/UI/Button'
import { createEventRegistrationAction } from '@/actions/events/registration'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import type { Event } from '@prisma/client'


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

    const [disabled, setDisabled] = useState(!(
        event.registrationStart < new Date()
        && new Date() < event.registrationEnd
        && event._count.eventRegistrations < event.places
    ))
    const [text, setText] = useState(
        event._count.eventRegistrations < event.places ? 'Meld meg på' : 'Arrangementet er fult'
    )
    const session = useSession()

    useEffect(() => {
        const timeUntilRegistration = event.registrationStart.getTime() - (new Date()).getTime()
        let timeoutId: ReturnType<typeof setTimeout>
        if (timeUntilRegistration > 0) {
            timeoutId = setTimeout(() => {
                setDisabled(false)
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

        setDisabled(true)

        if (result.success) {
            setText('Du er påmeldt')
        } else if (result.error && result.error.length > 0) {
            const message = result.error[0].message
            setText(message)
        } else {
            setText('Kunne ikke melde deg på.')
        }
    }

    return <Button
        disabled={disabled}
        onClick={buttonOnClick}
    >{text}</Button>
}
