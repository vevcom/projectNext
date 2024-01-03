'use client'

import Button from "./components/UI/Button"

export default function ErrorBoundary({error, reset} : {error: Error, reset: () => void}) {
    return (
        <div>
            <div>500</div>
            An error has acured {error.message}
            <Button onClick={reset}>Try again</Button>
        </div>
    )
} 