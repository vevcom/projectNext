'use client'
import Button from '@/components/UI/Button'
import { useEffect, useState } from 'react'
import type { Event } from '@prisma/client'


export default function RegistrationButton({
    event
}: {
    event: Event
}) {
    if (!event.takesRegistration) {
        throw new Error('Can only show registration button for event that take registration')
    }

    const [disabled, setDisabled] = useState(!(event.registrationStart < new Date() && new Date() < event.registrationEnd))

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

    return <Button disabled={disabled} onClick={() => alert('hei')}>Meld meg på</Button>
}
