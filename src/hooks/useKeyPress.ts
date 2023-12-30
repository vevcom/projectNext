import { useEffect, useState } from 'react'

function useKeyPress(targetKey: string, callback: (event: KeyboardEvent) => void) {
    const [keyPressed, setKeyPressed] = useState(false)

    function downHandler(event: KeyboardEvent) {
        const { key } = event
        if (key === targetKey) {
            setKeyPressed(true)
            return callback(event)
        }
        return undefined
    }

    const upHandler = ({ key }: KeyboardEvent) => {
        if (key === targetKey) {
            setKeyPressed(false)
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', downHandler)
        window.addEventListener('keyup', upHandler)

        return () => {
            window.removeEventListener('keydown', downHandler)
            window.removeEventListener('keyup', upHandler)
        }
    }, [])

    return keyPressed
}

export default useKeyPress
