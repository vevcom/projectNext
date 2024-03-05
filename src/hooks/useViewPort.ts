import { useEffect } from 'react'

/**
 * A hook that calls a callback with the current width and height of the viewport
 * Implements the window resize event listener using useEffect with cleanup
 * @param callback - The function to call with the current width and height of the viewport
 */
export default function useViewPort(callback: (width: number, height: number) => void) {
    useEffect(() => {
        const handleResize = () => {
            callback(window.innerWidth, window.innerHeight)
        }

        window.addEventListener('resize', handleResize)

        // Call handleResize to set the initial size
        handleResize()

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [callback])
}
