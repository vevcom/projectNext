import { useEffect } from 'react'
import { usePathname } from 'next/navigation'


export default function useOnNavigation(callback: () => void, deps?: any[]) {
    deps ??= []
    const path = usePathname()
    useEffect(callback, [path, ...deps])
}
