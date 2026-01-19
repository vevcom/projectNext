'use client'
import { displayDate } from '@/lib/dates/displayDate'
import { useEffect, useEffectEvent, useState } from 'react'

type PropTypes = {
    date: Date
    includeTime?: boolean
}

/**
 * Just a wrapper for the displayDate function. Importantly it is client side rendered to use the client's timezone.
 * @param date - The date to display
 * @param includeTime - Whether to include time in the display
 * @returns the date in jsx
 */
export default function Date({ date, includeTime = true }: PropTypes) {
    const [isClient, setIsClient] = useState(false)

    const handleClientHydration = useEffectEvent(() => setIsClient(true))

    useEffect(() => handleClientHydration(), [])

    if (!isClient) {
        return `${date.toISOString().substring(0, includeTime ? 16 : 10)} (UTC)`
    }

    return displayDate(date, includeTime)
}
