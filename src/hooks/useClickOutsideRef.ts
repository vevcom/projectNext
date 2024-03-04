
import { useEffect, useRef } from 'react'

/**
 * A hook that returns a ref to a DOM element that can be used to detect clicks outside of the element
 * When a click is detected outside of the element, the callback function is called
 * @param callback - The function to call when a click is detected outside of the element
 * @returns 
 */
export default function useClickOutsideRef(
    callback: (event: MouseEvent | TouchEvent) => void
) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        function handleClickOutside(event: MouseEvent | TouchEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                return callback(event)
            }
            return null
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchstart', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [ref, callback])
    return ref
}
