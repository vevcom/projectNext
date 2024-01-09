import { useEffect } from 'react'
import { usePathname } from 'next/navigation'


export default function useOnNavigation(callback: () => void) {
    const path = usePathname()
    useEffect(callback, [path])
}