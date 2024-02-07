import { use, useEffect } from 'react'

export default function useScroll(callback: (width: number, height: number) => void) {
    useEffect(() => {
        const handleScroll = () => {
            callback(window.scrollX, window.scrollY)
        }

        window.addEventListener('scroll', handleScroll)

        // Call handleResize to set the initial size
        handleScroll()

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [callback])

}