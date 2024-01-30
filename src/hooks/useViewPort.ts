import { useEffect } from "react"

export default function useViewPort(callback: (event: Event) => void) {
    useEffect(() => {
        window.addEventListener('resize', callback)
        return () => {
            window.removeEventListener('resize', callback)
        }
    }, [callback])
}