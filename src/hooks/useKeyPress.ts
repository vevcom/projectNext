import { useEffect, useState } from 'react'

function useKeyPress(targetKey: string, callback: (event: KeyboardEvent) => void) {
    const [keyPressed, setKeyPressed] = useState(false)

    useEffect(() => {
        function downHandler(event: KeyboardEvent) {
            const { key } = event
            if (key === targetKey) {
                setKeyPressed(true)
            }
            return undefined
        }

        const upHandler = (event: KeyboardEvent) => {
            const { key } = event
            if (key === targetKey) {
                setKeyPressed(false)
                return callback(event)
            }
        }
        window.addEventListener('keydown', downHandler)
        window.addEventListener('keyup', upHandler)

        return () => {
            window.removeEventListener('keydown', downHandler)
            window.removeEventListener('keyup', upHandler)
        }
    }, [targetKey, callback])

    return keyPressed
}

export default useKeyPress
