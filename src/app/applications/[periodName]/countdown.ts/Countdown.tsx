'use client'

import { useEffect } from "react"

type PropTypes = {
    end: Date
}

export function Countdown({ end }: PropTypes) {
    const [timeLeft, setTimeLeft] = useState<number>(end.getTime() - Date.now())
    useEffect
}