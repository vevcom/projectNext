'use client'
import { displayDate } from '@/dates/displayDate'

type PropTypes = {
    date: Date
}

/**
 * Just a wrapper for the displayDate function. Importantly it is client side rendered to use the client's timezone.
 * @param date - The date to display
 * @returns the date in jsx
 */
export default function Date({ date }: PropTypes) {
    return displayDate(date)
}
