'use client'
import { useEffect } from 'react'

export default function useInterval(callback: () => void, interval: number) {
    useEffect(() => {
        const id = setInterval(callback, interval)
        return () => clearInterval(id)
    }, [callback, interval])
}