'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
    useEffect(() => {
        if (!('serviceWorker' in navigator)) {
            return undefined
        }

        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Ignore registration failures (e.g. unsupported browsers).
        })

        // Reload once a new service worker takes control so the new version
        // is actually used, then close the listener - it only needs to fire once.
        const handleControllerChange = () => {
            navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
            window.location.reload()
        }
        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

        return () => navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
    }, [])

    return null
}
